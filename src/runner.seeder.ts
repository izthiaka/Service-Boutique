import ISeeder from "./core/interfaces/interface_seeder"
import RoleSeeder from "./features/user/seeders/role.seeder"
import ShopManagershipSeeder from "./features/user/seeders/shop_manager.seeder"

import ShopOwnershipSeeder from "./features/user/seeders/shop_ownership.seeder"

const { log } = console

const allSeeders: Array<ISeeder> = [
    new ShopOwnershipSeeder(),
    new ShopManagershipSeeder(),
    new RoleSeeder()
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
