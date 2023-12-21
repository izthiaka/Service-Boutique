export default class SeederPath {
  /**
   *
   * @param nameFeature
   * @param nameFile without extention
   * @returns
   */
  static get(nameFeature: string, nameFile: string): string {
    return `src/features/${nameFeature}/seeders/data/${nameFile}.json`
  }
}
