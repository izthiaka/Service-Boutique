import { Storage, Bucket } from "@google-cloud/storage"

const BASE_URL_PUBLIC_BUCKET = "https://storage.googleapis.com"

interface Options {
  projectId: string
  keyFilename: string
  bucketName: string
}

interface FileParams {
  fieldname: string
  originalname: string
  encoding: string
  buffer: Buffer
  mimetype: string
  size: number
}

export default class GoogleCloudBucket {
  private storage: Storage
  private bucket: Bucket

  constructor(options: Options) {
    this.storage = new Storage({
      projectId: options.projectId,
      keyFilename: options.keyFilename,
    })

    this.bucket = this.storage.bucket(options.bucketName)
  }

  /**
   *
   * @param files
   * @returns List of public url files
   */
  async uplodaFiles(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined,
  ): Promise<string[]> {
    const filesParams = this.convertToListOfFileParams(files)
    const promises: Promise<string>[] = []

    for (const f of filesParams) {
      const gcsname = Date.now() + f.originalname.replace(/\s/g, "")
      const file = this.bucket.file(gcsname)

      const stream = file.createWriteStream({
        metadata: {
          contentType: f.mimetype,
        },
        resumable: false,
      })

      stream.on("error", (err) => {
        throw err
      })

      stream.end(f.buffer)

      promises.push(
        new Promise<string>((resolve, reject) => {
          stream.on("finish", () => {
            file
              .makePublic()
              .then(() => {
                const url = `${BASE_URL_PUBLIC_BUCKET}/${
                  this.bucket.name
                }/${file.name.replace(/\s/g, "")}`
                resolve(url)
              })
              .catch((error) => {
                reject(error)
              })
          })
        }),
      )
    }

    const publicUrlFiles = await Promise.all(promises)
    return publicUrlFiles
  }

  convertToListOfFileParams(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined,
  ): FileParams[] {
    const listFileParams: FileParams[] = []
    if (Array.isArray(files)) {
      for (const file of files) {
        const { fieldname, originalname, encoding, buffer, mimetype, size } =
          file
        const fileObject: FileParams = {
          fieldname,
          originalname,
          encoding,
          buffer,
          mimetype,
          size,
        }
        listFileParams.push(fileObject)
      }
      return listFileParams
    }
    return listFileParams
  }

  async deleteFile(fileName: string) {
    try {
      const name = fileName.replace(
        `${BASE_URL_PUBLIC_BUCKET}/${this.bucket.name}/`,
        "",
      )
      await this.bucket.file(name).delete()
    } catch (error) {
      console.log(error)
    }
  }
}
