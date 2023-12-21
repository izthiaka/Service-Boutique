import ParamsMailling from "./params_mailling"

export default interface IMailling {
  sendMail(paramsMailling: ParamsMailling): void
}
