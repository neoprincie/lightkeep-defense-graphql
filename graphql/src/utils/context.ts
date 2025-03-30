import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

import { IUserService, UserService } from '../users/userService.js'
import { CharService, ICharService } from '../characters/charService.js'

export interface IUserContext extends JwtPayload {
    id: number
    email: string
}

export interface IServiceContext {
    user: IUserService,
    character: ICharService
}

export interface IContext {
    user: IUserContext
    service: IServiceContext
}

export const getContext = ({req, res}): IContext => {
    return {
        user: getUserContext(req),
        service: getServicesContext()
    }
}

const getUserContext = (req): IUserContext => {
    if (req == null) return null

    const token = req.headers.authorization || ''

    if (!token) return null

    return jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY) as IUserContext;
}

const getServicesContext = (): IServiceContext => {
    const prisma = new PrismaClient()

    const userService = new UserService(prisma)
    const charService = new CharService(prisma)

    return {
        user: userService,
        character: charService
    }
}