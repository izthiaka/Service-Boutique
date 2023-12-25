import { diskStorageMulter, singleMulter } from "../../../../core/plateform/multer_config"

const directory = "src/public/images/shops"

const storage = diskStorageMulter(`${process.env.APP_SLUG}_shop`, directory)

export default singleMulter(storage, "picture")
