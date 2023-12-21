import Multer from "multer"

export const multerArray = (fileName = "files") =>
  Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024,
    },
  }).array(fileName)
