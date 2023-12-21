import dotenv from "dotenv"

import DbAdapter from "./services/database/db_adapter"
import MongoDb from "./services/database/mongoose/mongo_db"

import app from "./routes/api_route.v1"

import loggerDebug from "./core/config/logger/logger_debug"
import loggerProduction from "./core/config/logger/logger_production"
import global from "./core/config/logger/global_winston"
import { errorBodyHandler, errorUrlHandler } from "./core/utils/error_handle"

dotenv.config()

if (!global.logger) {
  if (process.env.APP_ENV !== "production") {
    global.logger = loggerDebug
  } else {
    global.logger = loggerProduction
  }
}

const database = new DbAdapter(new MongoDb())
database.connectDatabase()


app.set("view engine", "handlebars")

app.use(errorUrlHandler)
app.use(errorBodyHandler)

export default app
