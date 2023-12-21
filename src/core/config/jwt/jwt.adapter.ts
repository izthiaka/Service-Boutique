import JwtJose from "./jwt.jose"

export default class JwtAdapter {
  constructor(private implementation = new JwtJose()) {}

  async generateAccessToken(jsonObject: any) {
    return this.implementation.sign(jsonObject)
  }

  async generateRefreshToken(jsonObject: any) {
    return this.implementation.refresh(jsonObject)
  }

  async verifyToken(req: any, token: any) {
    try {
      return await this.implementation.verifyJwt(req, token)
    } catch (error) {
      return {
        exp: error,
      }
    }
  }

  async getPayload(token: any) {
    try {
      return await this.implementation.getPayload(token)
    } catch (error) {
      return {
        exp: error,
      }
    }
  }
}
