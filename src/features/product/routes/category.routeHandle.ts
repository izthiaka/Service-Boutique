import { Router, Request, Response } from "express"

import ProductCategoryController from "../controllers/category.controller"
import ProductCategoryDatasource from "../datasources/category.datasource"
import ProductCategoryRepository from "../repositories/category.repository"

const router = Router()
const datasource = new ProductCategoryDatasource()
const repository = new ProductCategoryRepository(datasource)
const controller = new ProductCategoryController(repository)

import MulterPictureProductCategory from "../helpers/multer/product_category.multer"

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

router.put("/:code/picture", MulterPictureProductCategory, (req: Request, res: Response) => {
    return controller.updatePicture(req, res)
})

router.get("/:code/reset_picture", (req: Request, res: Response) => {
    return controller.resetPicture(req, res)
})

const PRODUCT_CATEGORY_V1_ROUTES = router
export default PRODUCT_CATEGORY_V1_ROUTES
