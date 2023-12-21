import app from "./app"
import SEEDER_RUNNER from "./runner.seeder"

const { log } = console

const PORT = process.env.APP_PORT || 5000

app.listen(PORT, async () => {
  if (process.env.APP_DEBUG === 'true') {
    SEEDER_RUNNER()
  }
  log(`listening on PORT ${PORT}`)
})
