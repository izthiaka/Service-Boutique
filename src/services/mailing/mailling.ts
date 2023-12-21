import * as nodemailer from "nodemailer"
import handlebars from "nodemailer-express-handlebars"
import * as path from "path"

import IMailling from "./interface_mailling"
import ParamsMailling from "./params_mailling"

const { log } = console

export default class Mailling implements IMailling {
  private pathTemplate = "./src/views/mailling/"

  async sendMail(paramsMailling: ParamsMailling): Promise<void> {
    try {
      const MAIL_PORT = parseInt(`${process.env.MAIL_PORT}`)
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      })

      transporter.use(
        "compile",
        handlebars({
          viewEngine: {
            partialsDir: path.resolve(this.pathTemplate),
            defaultLayout: '',
          },
          viewPath: path.resolve(this.pathTemplate),
        }),
      )

      const mailOptions = {
        from: paramsMailling.from,
        to: paramsMailling.to,
        subject: paramsMailling.subject,
        template: paramsMailling.templateName,
        context: paramsMailling.context,
      }

      await transporter.sendMail(mailOptions)
    } catch (error: any) {
      log(`Error sending email: ${error.message}`)
    }
  }
}
