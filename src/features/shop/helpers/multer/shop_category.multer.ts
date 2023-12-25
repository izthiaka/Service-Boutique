import { diskStorageMulter, singleMulter } from "../../../../core/plateform/multer_config"

const directory = "src/public/images/shops/categories"

const storage = diskStorageMulter(`${process.env.APP_SLUG}_shop_category`, directory)

export default singleMulter(storage, "picture")
