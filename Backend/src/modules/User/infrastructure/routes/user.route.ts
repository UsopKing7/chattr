import { Router } from 'express'
import { UserController } from '../controllers/User.controller'
import { rutaProtected } from '../../../../shared/middlewares/rutaProtected.middleware'
import { cacheMiddleware } from '../../../../shared/middlewares/redisResponse.middleware'
import { KEY } from '../../../../shared/configurations/keys'

export const userRouter = Router()
const controller = new UserController()

userRouter.post('/register', controller.register.bind(controller))
userRouter.post('/login', controller.login.bind(controller))
userRouter.delete('/delete/:id_user', rutaProtected, controller.delete.bind(controller))
userRouter.post('/logout', rutaProtected, controller.logout.bind(controller))
userRouter.patch('/update/:id_user', rutaProtected, rutaProtected, controller.update.bind(controller))
userRouter.get('/users', rutaProtected, cacheMiddleware(() => KEY.users), controller.allUsers.bind(controller))
