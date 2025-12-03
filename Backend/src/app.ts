import { app } from './server'
import { prismaConnection } from './shared/configurations/db'
import { enviroment } from './shared/configurations/envirement'
import { redisConnection } from './shared/configurations/redis'

prismaConnection()
redisConnection()

app.listen(enviroment.PORT, () => {
  console.table({
    URL: enviroment.URL + enviroment.PORT
  })
})
