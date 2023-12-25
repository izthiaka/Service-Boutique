import { Router, Request, Response } from "express"

import ShopController from "../controllers/shop.controller"
import ShopDatasource from "../datasources/shop.datasource"
import ShopRepository from "../repositories/shop.repository"

import MulterPictureShop from "../helpers/multer/shop.multer"

const router = Router()
const datasource = new ShopDatasource()
const repository = new ShopRepository(datasource)
const controller = new ShopController(repository)

router.get("", (req: Request, res: Response) => {
    return controller.index(req, res)
})

router.get("/search", (req: Request, res: Response) => {
    return controller.filter(req, res)
})

router.post("/store", (req: Request, res: Response) => {
    return controller.store(req, res)
})

router.get("/:code/detail", (req: Request, res: Response) => {
    return controller.show(req, res)
})

router.put("/:code/update", (req: Request, res: Response) => {
    return controller.update(req, res)
})

router.put("/:code/status", (req: Request, res: Response) => {
    return controller.status(req, res)
})

router.put("/:code/picture", MulterPictureShop, (req: Request, res: Response) => {
    return controller.updatePicture(req, res)
})

router.get("/:code/reset_picture", (req: Request, res: Response) => {
    return controller.resetPicture(req, res)
})

const SHOP_V1_ROUTES = router
export default SHOP_V1_ROUTES
