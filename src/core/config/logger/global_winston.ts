import winston from "winston"

const globalWinston = global as typeof globalThis & {
  logger: winston.Logger
}

export default globalWinston
