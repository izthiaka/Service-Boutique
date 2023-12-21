export default class DateUtils {
  static dateDiff(date1: Date, date2: Date) {
    const diff: { day: number; hour: number; min: number; sec: number } = {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0,
    } // Initialisation du retour
    let tmp = date1.getTime() - date2.getTime()

    tmp = Math.floor(tmp / 1000) // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60 // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60) // Nombre de minutes (partie entière)
    diff.min = tmp % 60 // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60) // Nombre d'heures (entières)
    diff.hour = tmp % 24 // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24) // Nombre de jours restants
    diff.day = tmp

    return diff
  }

  static convertToSeconds(duration: string) {
    const regexHours = /^(\d+)h$/
    const regexDays = /^(\d+)d$/

    let seconds = 0

    if (regexHours.test(duration)) {
      const match = duration.match(regexHours)
      if (match) {
        const hours = parseInt(match[1], 10)
        seconds = hours * 3600
      }
    } else if (regexDays.test(duration)) {
      const match = duration.match(regexDays)
      if (match) {
        const days = parseInt(match[1], 10)
        seconds = days * 24 * 3600
      }
    }
    return seconds
  }

  static isTimestampValid(timestamp: any) {
    const expirationTime = timestamp * 1000
    const currentTime = Date.now()  
    return expirationTime > currentTime;
  }
}
