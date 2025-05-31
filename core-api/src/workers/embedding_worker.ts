import {Job, Worker} from 'bullmq'
import {env, Extension} from '../configs'
import {newVectorServiceImpl} from '../services/impl/vectory-service.impl'
import {newBucketServiceImpl} from '../services/impl/bucket-service.impl'
import {redis} from '../libs'
import {makeLog} from '../helpers'
import path from 'path'
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {DocxLoader} from '@langchain/community/document_loaders/fs/docx'
import {TextLoader} from 'langchain/document_loaders/fs/text'
import type {BaseDocumentLoader} from '@langchain/core/document_loaders/base'
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'

const bucketService = newBucketServiceImpl()
const vectorService = newVectorServiceImpl()

export function newEmbeddingWorker() {
  return new Worker<EmbeddingWorkerData>(env.DEFAULT_QUEUE_NAME, handleJob, {
    connection: redis,
  })
}

async function handleJob(job: Job<EmbeddingWorkerData, any, string>) {
  try {
    console.log('===== handleJob with input ===== \n', job.data)
    const payloads = job.data.payloads
    const bucketName = payloads[0].bucketName || env.DEFAULT_BUCKET_NAME

    // filter only allowed file extensions
    const [filterPaths, exts] = filterUnSupporteds(payloads)
    // retrive actual resource paths
    const filterResourcePaths = filterPaths.map((item) => item.resourcePath)
    // fetch temp signed url to retrieve blob data
    const signedUrls = await getSignedUrls(filterResourcePaths, bucketName)
    // load blobs data from signed urls
    const blobs = await loadRemoteFiles(signedUrls)
    const splitDocs = await loadBlobsContentWithChunks(blobs, exts)
    const embeddingPromises = splitDocs.map(async (chunks, index) => {
      if (!chunks) return null
      const payload = filterPaths[index]
      const userInputMetadata = payload.metadata
      const decoratedMetadata = {
        ...userInputMetadata,
        sourcePath: payload.resourcePath,
        bucketName: payload.bucketName,
        fileId: payload.fileId,
        originalFileName: payload.originalFileName,
        createdAt: new Date().toISOString(),
        contentType: payload.contentType,
      }
      const addDocRes = await vectorService.addDocuments({
        collectionName: env.DEFAULT_VECTOR_COLLECTION_NAME,
        documents: chunks.map((chunk) => ({
          content: chunk.pageContent,
          metadata: decoratedMetadata,
        })),
      })
      console.log('For file id ', payload.fileId)
      console.log('Vector ids ', addDocRes.ids)
      // send message to sync history success
    })
    await Promise.all(embeddingPromises)
    // send sync history group success
  } catch (e) {
    console.log('===== handleJob error =====', e)
    throw e
  }
}

async function getSignedUrls(
  sourcePaths: string[],
  bucketName: string,
): Promise<string[]> {
  try {
    const signedUrlsRes = await bucketService.getSignedUrls({
      bucketName,
      paths: sourcePaths,
      expiresIn: 60 * 60, //  1 hrs
    })
    const signedUrls = signedUrlsRes.map((item) => item.signedUrl)
    return signedUrls
  } catch (e) {
    console.log('===== getSignedUrls error =====', e)
    throw e
  }
}

function getFileExtension(fileName: string) {
  return path.extname(fileName)
}

async function loadRemoteFiles(signedUrls: string[]): Promise<Blob[] | null[]> {
  try {
    makeLog('info', '===== loadRemoteFile with input ===== \n', signedUrls)
    const promises = signedUrls.map((signedUrl) =>
      fetch(signedUrl).then((res) => res.blob()),
    )
    const results = await Promise.all(promises)
    return results
  } catch (e) {
    makeLog('error', '===== loadRemoteFile error =====', e)
    return new Array(signedUrls.length).fill(null)
  }
}

// [payload[],string[]] => [filterPaths array, filterPaths's extension array]
function filterUnSupporteds(
  payloads: FilterUnSupportedPathsInput,
): [EmbeddingWorkerData['payloads'], string[]] {
  const filterPaths: EmbeddingWorkerData['payloads'] = []
  const extensions: string[] = []
  for (const payload of payloads) {
    const extension = getFileExtension(payload.originalFileName)
    if (
      env.ALLOWED_FILE_TYPES.includes(payload.contentType) &&
      env.ALLOWED_EXTENSIONS_FOR_SYNC.includes(extension)
    ) {
      filterPaths.push(payload)
      extensions.push(extension)
    }
  }
  return [filterPaths, extensions]
}
async function loadBlobsContentWithChunks(
  blobs: Blob[] | null[],
  extensions: string[],
) {
  const loaders: (BaseDocumentLoader | null)[] = extensions.map(
    (ext, index) => {
      const blob = blobs[index]
      if (!blob) return null
      switch (ext) {
        case Extension.pdf:
          return new PDFLoader(blob)
        case Extension.docx:
          return new DocxLoader(blob)
        case Extension.html:
        case Extension.md:
        case Extension.txt:
          return new TextLoader(blob)
        default:
          return null
      }
    },
  )
  const loadPromises = loaders.map((loader) => loader?.load())
  const loadedDocuments = await Promise.all(loadPromises)
  const textsplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const splitDocsPromises = loadedDocuments.map((loadedDoc) =>
    loadedDoc ? textsplitter.splitDocuments(loadedDoc) : null,
  )
  const splitDocs = await Promise.all(splitDocsPromises)
  return splitDocs
}

export type EmbeddingWorkerData = {
  payloads: {
    fileId: string
    metadata: Record<string, string | number>
    bucketName: string
    resourcePath: string
    taskId: string
    contentType: string
    originalFileName: string
  }[]
  syncId: string
}

type FilterUnSupportedPathsInput = {
  fileId: string
  metadata: Record<string, string | number>
  bucketName: string
  resourcePath: string
  taskId: string
  contentType: string
  originalFileName: string
}[]
