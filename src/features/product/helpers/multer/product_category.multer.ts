import { diskStorageMulter, singleMulter } from "../../../../core/plateform/multer_config"

const directory = "src/public/images/products/categories"

const storage = diskStorageMulter(`${process.env.APP_SLUG}_product_category`, directory)

export default singleMulter(storage, "picture")
