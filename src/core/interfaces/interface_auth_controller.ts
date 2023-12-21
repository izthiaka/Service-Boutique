import { NextFunction, Request, Response } from "express"

interface IAuthController {
  signIn(req: Request, res: Response): any
  getProfil(req: Request, res: Response, next?: NextFunction): any
  sendToken(req: Request, res: Response, next?: NextFunction): any
  modifyPassword(req: Request, res: Response, next?: NextFunction): any
}
export default IAuthController
