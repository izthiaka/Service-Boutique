interface IDatasource {
  findAll(page: string, limit: string): any
  findOne(match: object): any
  findOneByName(name: string): any
  findOneByCode(code: string): any
  store(body: any): any
  update(code: string, body: any): any
  deleteOne(code: string): any
  isExiste(match: object): Promise<boolean>
}
export default IDatasource
