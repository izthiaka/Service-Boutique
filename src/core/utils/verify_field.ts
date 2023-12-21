import { isPossiblePhoneNumber } from "libphonenumber-js"
import validator from "validator"

const regExDateTime = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/

const regExDate = /(\d{4})-(\d{2})-(\d{2})/

export default class VerifyField {
  isValid(string: any) {
    return !(string === undefined || string === null || string === "")
  }

  isValidArray(string: any) {
    try {
      if (Array.isArray(string)) {
        if (string.length !== 0) {
          return true
        }
      }
      return false
    } catch (error) {
      return false
    }
  }

  isNumber(string: any) {
    return typeof string === "number"
  }

  isString(string: any) {
    return typeof string === "string"
  }

  isBoolean(string: any) {
    return typeof string === "boolean"
  }

  // isDate(a: any) {
  //   try {
  //     return (Object.prototype.toString.call(a) === '[object Date]');
  //   } catch (error) {
  //     return false
  //   }
  // }

  isPhone(string: any) {
    try {
      return isPossiblePhoneNumber(string) && string.startsWith("+")
    } catch (error) {
      return false
    }
  }

  isEmail(string: any) {
    try {
      return validator.isEmail(string)
    } catch (error) {
      return false
    }
  }

  isDateTime(string: any) {
    try {
      return string.match(regExDateTime) !== null
    } catch (error) {
      return false
    }
  }

  isDate(string: any) {
    try {
      return string.match(regExDate) !== null
    } catch (error) {
      return false
    }
  }
}
