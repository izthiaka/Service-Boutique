import { Router, Request, Response } from "express"

import PaymentMethodController from "../../subscription/controllers/payment_method.controller"
import PaymentMethodDatasource from "../../subscription/datasources/payment_method.datasource"
import PaymentMethodRepository from "../../subscription/repositories/payment_method.repository"


const router = Router()
const datasource = new PaymentMethodDatasource()
const repository = new PaymentMethodRepository(datasource)
const controller = new PaymentMethodController(repository)

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

const PAYMENT_METHOD_V1_ROUTES = router
export default PAYMENT_METHOD_V1_ROUTES
