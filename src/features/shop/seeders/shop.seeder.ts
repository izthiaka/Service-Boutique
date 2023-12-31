import { readFile } from "fs/promises"
import ISeeder from "../../../core/interfaces/interface_seeder"
import ApiResponse from "../../../core/utils/ApiResponse"
import MatriculeGenerate from "../../../core/utils/matricule_generate"
import ShopDatasource from "../datasources/shop.datasource"
import ShopSpecificField from "../helpers/specific_field/shop.specific_field"
import CategoryDatasource from "../datasources/category.datasource"
import ShopOwnerDatasource from "../../user/datasources/shop_ownership.datasource"

interface SeederDataShop {
    name: string
    email: string
    phone: string
    category_boutique: string
    adresse: object
    proprio: string
    description: string
}

const URL_SEEDER_FILE =
    "src/features/shop/seeders/data/shops.json"

export default class ShopSeeder extends ApiResponse implements ISeeder {
    constructor(
        private datasource = new ShopDatasource(),
        private urlSeeder = URL_SEEDER_FILE,
        private matricule = new MatriculeGenerate(),
    ) {
        super("")
    }

    async getFileSeeder() {
        try {
            const fileContentBuffer = await readFile(this.urlSeeder)
            const fileContentString = fileContentBuffer.toString("utf-8")
            const parsedData: SeederDataShop[] = JSON.parse(
                fileContentString,
                ) as SeederDataShop[]
            return parsedData
        } catch (error) {
            return null
        }
    }

    async seed(): Promise<object> {
        try {
            const shops = await this.getFileSeeder()
            if (shops) {
                const { success, alreadyCreated, total } =
                    await this.insertSeederIsNotExist(shops)

                const response = {
                    size: total,
                    success,
                    already_exist: alreadyCreated,
                }

                return {
                    statusCode: 200,
                    success: true,
                    message: "SEEDERS BOUTIQUE",
                    data: response,
                }
            }
            return {
                statusCode: 500,
                success: false,
                message: "FICHIER SEEDERS BOUTIQUE INTROUVABLE",
            }
        } catch (error) {
            return {
                statusCode: 500,
                success: false,
                message: "ERREURS SEEDERS BOUTIQUE",
            }
        }
    }

    async insertSeederIsNotExist(shops: SeederDataShop[]) {
        const seederToInsert = shops.length
        let Inserted = 0
        let alreadyCreated = 0

        for (const shop of shops) {
            const insertInto = await this.saveData(shop)
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

    async saveData(shop: SeederDataShop) {
        try {
            const body = ShopSpecificField.fromSeeder(shop)

            let isExisteShopEmail
            if (body.email) {
                const matchShop = {
                    email: body.email,
                }
                isExisteShopEmail = await this.datasource.isExiste(matchShop)
            }

            let isExisteShopPhone
            if (body.phone) {
                const matchShop = {
                    phone: body.phone,
                }
                isExisteShopPhone = await this.datasource.isExiste(matchShop)
            }

            let categories: string[] = []
            await Promise.all(body.category.map(async (category: string) => {
                const categoryDatasource = new CategoryDatasource()
                const cat = await categoryDatasource.findOneByName(category)
                if (cat) {
                    categories.push(cat.code)
                }
            }))

            const ownerDatasource = new ShopOwnerDatasource()
            const owner = await ownerDatasource.findOneByName(body.owner)
            
            const category = categories.length === body.category.length
            if (!isExisteShopEmail && !isExisteShopPhone && category && owner) {
                const code = this.matricule.generate()

                const bodyRequest = {
                    ...body,
                    code,
                    category: categories,
                    owner: owner.matricule
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
