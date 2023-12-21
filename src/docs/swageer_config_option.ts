import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.APP_PORT || 5000
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SYGERAS",
      version: "1.2.0",
      description: "Application de gestion et de dématérialisation des procédures administratives pour l'Association des Scouts du Sénégal vise à simplifier, centraliser, et automatiser les processus liés à la gestion des membres, des événements et des formations, tout en garantissant l'accessibilité et la sécurité des données.",
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: "Local server (uses test data)"
      },
      {
        url: `https://38.242.153.243:${PORT}/api/v1`,
        description: "Production server (uses live data)"
      },
    ],
  },
  security: [{ Bearer: [] }],
  apis: ["./src/docs/routes/*.ts"],
}
export default swaggerOptions
