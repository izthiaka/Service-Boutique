import { Router, Request, Response } from "express"

import SubscriptionController from "../../subscription/controllers/subscription.controller"
import SubscriptionDatasource from "../../subscription/datasources/subscription.datasource"
import SubscriptionRepository from "../../subscription/repositories/subscription.repository"


const router = Router()
const datasource = new SubscriptionDatasource()
const repository = new SubscriptionRepository(datasource)
const controller = new SubscriptionController(repository)

router.get("", (req: Request, res: Response) => {
    return controller.index(req, res)
})

router.get("/public", (req: Request, res: Response) => {
    return controller.indexGuest(req, res)
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
    return controller.changeStatus(req, res)
})

const SUBSCRIPTION_V1_ROUTES = router
export default SUBSCRIPTION_V1_ROUTES
