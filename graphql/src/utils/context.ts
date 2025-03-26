import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

import { IUserService, UserService } from '../users/userService.js'

export interface IUserContext {
    id: string
    email: string
}

export interface IServiceContext {
    user: IUserService
}

export interface IContext {
    user: string | JwtPayload
    service: IServiceContext
}

export const getContext = ({req, res}): IContext => {
    return {
        user: getUserContext(req),
        service: getServicesContext()
    }
}

const getUserContext = (req): string | JwtPayload => {
    if (req == null) return null

    const token = req.headers.authorization || ''

    if (!token) return null

    return jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);
}

const getServicesContext = (): IServiceContext => {
    const prisma = new PrismaClient()

    const userService = new UserService(prisma)

    return {
        user: userService
    }
}