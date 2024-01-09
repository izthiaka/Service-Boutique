import multer, { diskStorage } from "multer"

export const MIME_TYPES: any = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/svg+xml": "svg",
}

export const multerArray = (fileName = "files") =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024,
    },
  }).array(fileName)

export const diskStorageMulter = (prefixFile: string, staticDirectory: string) =>
  diskStorage({
      destination: (req, file, callback) => {
          callback(null, staticDirectory)
      },
      filename(req, file, callback) {
          const name = `${prefixFile}_`
          const extension = MIME_TYPES[file.mimetype]
          callback(null, `${name + Date.now()}.${extension}`)
      },
  })

export const singleMulter = (diskStorageData: any, fileName: string) =>
  multer({
    storage: diskStorageData,
    limits: {
        fileSize: 8000000, // Compliant: 8MB
    },
  }).single(fileName)