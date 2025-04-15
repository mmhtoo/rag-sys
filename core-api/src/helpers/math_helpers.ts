// get total page count
export const getTotalPageCount = (total: number, pageSize: number) => {
  return Math.ceil(total / pageSize)
}
