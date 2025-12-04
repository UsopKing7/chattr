import { Router } from 'express'
import { ChannelController } from '../controllers/Channel.controller'

export const channelRouter = Router()
const controller = new ChannelController()

channelRouter.post('/create/channel/:id_user_owner', controller.create.bind(controller))
