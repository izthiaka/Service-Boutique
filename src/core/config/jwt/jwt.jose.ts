import * as jose from "jose"
import { Response } from "express"

export default class JwtJose {
  private issuer = "urn:api_sygeras_nodejs"
  private audience = "urn:flutter_admin_front"
  private algorithm = "ES256"

  async sign(data: any) {
    const ecPublicKey = await this.getTokenKey()

    return new jose.SignJWT(data)
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(process.env.TOKEN_ACCESS_TOKEN_EXPIRE_AT as string)
      .sign(ecPublicKey)
  }

  async getTokenKey() {
    const pkcs8 = `-----BEGIN PRIVATE KEY-----
            MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
            nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
            l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
            -----END PRIVATE KEY-----`
    return jose.importPKCS8(pkcs8, this.algorithm)
  }

  async refresh(data: any) {
    const ecPrivateKey = await this.getTokenKey()

    return new jose.SignJWT(data)
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(process.env.TOKEN_REFRESH_TOKEN_EXPIRE_AT as string)
      .sign(ecPrivateKey)
  }

  async verifyJwt(res: Response, token: string) {
    try {
      return await this.getPayload(token)
    } catch (error) {
      return null
    }
  }

  async getPayload(token: string) {
    const ecPrivateKey = await this.getTokenKey()
    const { payload } = await jose.jwtVerify(token, ecPrivateKey, {
      issuer: this.issuer,
      audience: this.audience,
    })

    return payload
  }
}
