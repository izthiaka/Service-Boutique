import ISeeder from "./core/interfaces/interface_seeder"

import CategorySeeder from "./features/shop/seeders/category.seeder"
import ShopSeeder from "./features/shop/seeders/shop.seeder"
import RoleSeeder from "./features/user/seeders/role.seeder"
import ShopOwnershipSeeder from "./features/user/seeders/shop_ownership.seeder"

const { log } = console

const allSeeders: Array<ISeeder> = [
    new RoleSeeder(),
    new CategorySeeder(),
    new ShopOwnershipSeeder(),
    new ShopSeeder(),
]

export default function runnerSeeder() {
    if (allSeeders.length != 0) {
        allSeeders.forEach((value) => {
            value.seed().then((value) => {
                log(value)
            })
        })
    }
}
