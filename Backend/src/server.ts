import express from 'express'
import { userRouter } from './modules/User/infrastructure/routes/user.route'
import { responseMiddleware } from './shared/middlewares/requestError.middleware'
import cookieParser from 'cookie-parser'
import { channelRouter } from './modules/Channel/infraestructura/routes/channel.route'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api', userRouter)
app.use('/api', channelRouter)
app.use(responseMiddleware)
