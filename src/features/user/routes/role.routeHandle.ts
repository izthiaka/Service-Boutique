import { Router, Request, Response } from "express"

import RoleController from "../controllers/role.controller"
import RoleDatasource from "../datasources/role.datasource"
import RoleRepository from "../repositories/role.repository"

const router = Router()
const datasource = new RoleDatasource()
const repository = new RoleRepository(datasource)
const controller = new RoleController(repository)

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

const ROLE_V1_ROUTES = router
export default ROLE_V1_ROUTES
