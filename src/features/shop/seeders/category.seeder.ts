import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import ShopCategoryDatasource from "../datasources/category.datasource"
import ShopCategorySpecificField from "../helpers/specific_field/category.specific_field"

interface SeederDataShopCategory {
    name: string
}

const URL_SEEDER_FILE =
    "src/features/shop/seeders/data/categories.json"

export default class ShopCategorySeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new ShopCategoryDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataShopCategory[] = JSON.parse(
                fileContentString,
                ) as SeederDataShopCategory[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const categories = await this.getFileSeeder()
            if (categories) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(categories)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS CATEGORIE BOUTIQUE",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS CATEGORIE BOUTIQUE INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS CATEGORIE BOUTIQUE",
            }
        }
    }

    async insertSeederIsNotExist(categories: SeederDataShopCategory[]) {
        const seederToInsert = categories.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const category of categories) {
            const insertInto = await this.saveData(category)
            if (insertInto) {
                Inserted += 1
            } else {
                alreadyCreated += 1
            }
        }

        return {
            total: seederToInsert,
            success: Inserted,
            alreadyCreated,
        }
    }

    async saveData(category: SeederDataShopCategory) {
        try {
            const body = ShopCategorySpecificField.fromSeeder(category)

            let isExisteShopCategory
            if (body.name) {
                const matchShopCategory = {
                    name: body.name,
                }
                isExisteShopCategory = await this.datasource.isExiste(matchShopCategory)
            }
            
            if (!isExisteShopCategory) {
                const code = this.matricule.generate()

                const bodyRequest = {
                    ...body,
                    code,
                }

                await this.datasource.store(bodyRequest)
                return true
            }
            return false
        } catch (error) {
            throw new Error(error as string)
        }
    }
}
