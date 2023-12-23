import ISeeder from "./core/interfaces/interface_seeder"

import ShopOwnershipSeeder from "./features/user/seeders/shop_ownership.seeder"

const { log } = console

const allSeeders: Array<ISeeder> = [
    new ShopOwnershipSeeder()
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
