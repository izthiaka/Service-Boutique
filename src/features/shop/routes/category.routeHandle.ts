import { Router, Request, Response } from "express"

import CategoryController from "../controllers/category.controller"
import CategoryDatasource from "../datasources/category.datasource"
import CategoryRepository from "../repositories/category.repository"

const router = Router()
const datasource = new CategoryDatasource()
const repository = new CategoryRepository(datasource)
const controller = new CategoryController(repository)

import MulterPictureCategory from "../helpers/multer/category.multer"

router.get("", (req: Request, res: Response) => {
    return controller.index(req, res)
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

router.put("/:code/picture", MulterPictureCategory, (req: Request, res: Response) => {
    return controller.updatePicture(req, res)
})

router.get("/:code/reset_picture", (req: Request, res: Response) => {
    return controller.resetPicture(req, res)
})

const CATEGORY_V1_ROUTES = router
export default CATEGORY_V1_ROUTES
