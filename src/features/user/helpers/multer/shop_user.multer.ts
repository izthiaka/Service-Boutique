import { diskStorageMulter, singleMulter } from "../../../../core/plateform/multer_config"

const directory = "src/public/images/users"

const storage = diskStorageMulter(`${process.env.APP_SLUG}_user`, directory)

export default singleMulter(storage, "picture")
