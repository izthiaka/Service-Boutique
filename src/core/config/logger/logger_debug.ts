import { createLogger, format, transports } from "winston"

const { combine, timestamp } = format

const formatConf = format.printf(
  ({ level, message, timestamp }) => `${level} ${timestamp} : ${message}`,
)

const loggerDebug = createLogger({
  level: "debug",
  format: combine(
    format.colorize(),
    timestamp({ format: "HH:mm:ss" }),
    formatConf,
  ),
  transports: [new transports.Console()],
})

export default loggerDebug
