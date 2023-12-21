interface IRepository {
  getAll(page: string, limit: string): any
  getOne(match: object): any
  getOneByName(name: string): any
  getOneByCode(code: string): any
  save(body: any): any
  update(code: string, body: any): any
  deleteOne(code: string): any
}
export default IRepository
