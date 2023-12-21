import ISeeder from "./core/interfaces/interface_seeder"

const { log } = console

const allSeeders: Array<ISeeder> = []

export default function runnerSeeder() {
    if (allSeeders.length != 0) {
        allSeeders.forEach((value) => {
            value.seed().then((value) => {
                log(value)
            })
        })
    }
}
