import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import CategoryDatasource from "../datasources/category.datasource"
import CategorySpecificField from "../helpers/specific_field/category.specific_field"

interface SeederDataCategory {
    name: string
}

const URL_SEEDER_FILE =
    "src/features/shop/seeders/data/categories.json"

export default class CategorySeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new CategoryDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataCategory[] = JSON.parse(
                fileContentString,
                ) as SeederDataCategory[]
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

    async insertSeederIsNotExist(categories: SeederDataCategory[]) {
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

    async saveData(category: SeederDataCategory) {
        try {
            const body = CategorySpecificField.fromSeeder(category)

            let isExisteCategory
            if (body.name) {
                const matchCategory = {
                    name: body.name,
                }
                isExisteCategory = await this.datasource.isExiste(matchCategory)
            }
            
            if (!isExisteCategory) {
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
