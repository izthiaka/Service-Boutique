import { Router, Request, Response } from "express"

import ShopOwnershipController from "../controllers/shop_ownership.controller"
import ShopOwnerDatasource from "../datasources/shop_ownership.datasource"
import ShopOwnerRepository from "../repositories/shop_ownership.repository"

const router = Router()
const datasource = new ShopOwnerDatasource()
const repository = new ShopOwnerRepository(datasource)
const controller = new ShopOwnershipController(repository)

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

router.put("/:code/account_status", (req: Request, res: Response) => {
    return controller.statusAccount(req, res)
})

const SHOP_OWNERSHIP_V1_ROUTES = router
export default SHOP_OWNERSHIP_V1_ROUTES
