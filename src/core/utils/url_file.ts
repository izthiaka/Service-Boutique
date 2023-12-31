import { Request } from "express"
import { unlink } from "node:fs/promises"

const { log } = console

export default class UrlFileUtil {
    
    static getUrlFileIsExist(req: any, pathImage: string) {
        try {
            const { filename } = req.file
            return `${pathImage}/${filename.replace("images\\", "")}`
        } catch (error) {
            return ""
        }
    }

    static setUrlWithHosting(req: Request, imageUrl: string) {
        return `${req.protocol}s://${req.get("host")}/${imageUrl}`
    }

    static deleteFileAsset(req: Request, imageUrl: string) {
        try {
            const urlGet = `${req.protocol}s://${req.get("host")}/`
            const substr = imageUrl.split(urlGet)
            
            unlink(`src/public/${substr[1]}`)
        } catch (error) {
            log(error)
        }
    }
  }
  