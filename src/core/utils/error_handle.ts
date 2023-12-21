import { Request, Response, NextFunction } from "express"

export const errorBodyHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    err instanceof SyntaxError &&
    err.message.startsWith("Unexpected token") &&
    "body" in err
  ) {
    res.status(400).json({ message: "Invalid JSON payload" })
  } else {
    next(err)
  }
}

export const errorUrlHandler = (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: "404 NOT FOUND",
  })
  next()
}
