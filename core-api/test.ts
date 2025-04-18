import path from 'path'
import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'

async function main() {
  const pdfPath = path.join(
    process.cwd(),
    '../resources/pdf',
    'neural-network-and-deep-learning-1666711486261.pdf',
  )
  const pdfLoader = new PDFLoader(pdfPath)
  const docs = await pdfLoader.load()
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const splitDocs = await textSplitter.splitDocuments(docs)
  for (const doc of splitDocs) {
    console.log(doc.pageContent)
  }
}

main().catch(console.error)
