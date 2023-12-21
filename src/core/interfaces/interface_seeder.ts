interface ISeeder {
  getFileSeeder(): Promise<any[] | null>
  seed(): Promise<object>
  insertSeederIsNotExist(admins: any[]): Promise<object>
  saveData(admin: any): Promise<boolean>
}

export default ISeeder
