import express from "express"

import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerOptions from "../docs/swageer_config_option"

import passport from "passport"
import session from "express-session"
import bodyParser from "body-parser"
import helmet from "helmet"
import settingCorsOption from "../core/config/cors"

import settingApiKey from "../core/config/api_key"


import SHOP_OWNERSHIP_V1_ROUTES from "../features/user/routes/shop_ownership.routeHandle"


const app = express()

app.use(settingCorsOption)
app.use(helmet())
app.use("/", bodyParser.json({ limit: "250kb" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: "?7r+hu3HeHYh*{ZC@A%Cl&JT1;&RU=",
    resave: false,
    saveUninitialized: true,
  }),
)
  
app.use(passport.initialize())
app.use(passport.session())

export const PREFIX_API_V1 = "/api/v1"

// Route for images directory
app.use(express.static("public"))

const specswagger = swaggerJSDoc(swaggerOptions)
app.use(`${PREFIX_API_V1}/docs`, swaggerUi.serve, swaggerUi.setup(specswagger))

app.use(settingApiKey)
app.use((req, res, next) => {
  const url = req.url
  if (url === '/' || !url.startsWith(PREFIX_API_V1)) {
    res.send('')
  } else {
    next()
  }
})


// USER
app.use(`${PREFIX_API_V1}/users/shop_ownerships`, SHOP_OWNERSHIP_V1_ROUTES)


export default app
