import { createLogger, format, transports } from "winston"

const { combine, timestamp } = format

const formatConf = format.printf(
  ({ level, message, timestamp }) => `${level} ${timestamp}: ${message}`,
)

const loggerProduction = createLogger({
  level: "info",
  format: combine(timestamp(), formatConf),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./logs/error.log" }),
  ],
})

export default loggerProduction
