import { diskStorageMulter, singleMulter } from "../../../../core/plateform/multer_config"

const directory = "src/public/images/categories"

const storage = diskStorageMulter(`${process.env.APP_SLUG}_category`, directory)

export default singleMulter(storage, "picture")
