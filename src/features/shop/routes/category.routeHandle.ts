import { Router, Request, Response } from "express"

import ShopCategoryController from "../controllers/category.controller"
import ShopCategoryDatasource from "../datasources/category.datasource"
import ShopCategoryRepository from "../repositories/category.repository"

const router = Router()
const datasource = new ShopCategoryDatasource()
const repository = new ShopCategoryRepository(datasource)
const controller = new ShopCategoryController(repository)

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

const SHOP_CATEGORY_V1_ROUTES = router
export default SHOP_CATEGORY_V1_ROUTES
