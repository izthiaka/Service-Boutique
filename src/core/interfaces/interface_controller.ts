import { NextFunction, Request, Response } from "express"

interface IController {
  index(req: Request, res: Response, next?: NextFunction): any
  store(req: Request, res: Response, next?: NextFunction): any
  show(req: Request, res: Response, next?: NextFunction): any
  update(req: Request, res: Response, next?: NextFunction): any
  delete(req: Request, res: Response, next?: NextFunction): any
}
export default IController
