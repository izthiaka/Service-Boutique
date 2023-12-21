import IDatabase from "./interface_database"

export default class DbAdapter {
  constructor(public database: IDatabase) {}

  async connectDatabase(): Promise<void> {
    this.database.connect()
  }

  async closeDatabase(): Promise<void> {
    this.database.close()
  }
}
