import mongoose from "mongoose"
import IDatabase from "../interface_database"

export default class MongoDb implements IDatabase {
  database
  constructor() {
    this.database = mongoose
  }

  connect(): void {
    try {
      const DATABASE_NAME = process.env.DB_URL_MONGO as string

      this.database.set("strictQuery", false)
      this.database.connect(DATABASE_NAME)

      console.log(`Connected To Database : ${DATABASE_NAME}`)
    } catch (error) {
      throw Error(error as string)
    }
  }

  close(): void {
    this.database.connection.close()
  }
}
