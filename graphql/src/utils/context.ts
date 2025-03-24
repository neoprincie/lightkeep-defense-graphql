import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

import { UserService } from '../users/userService.js'

export const getContext = ({req, res}) => {
    return {
        user: getUserContext(req),
        service: getServicesContext()
    }
}

const getUserContext = (req) => {
    if (req == null) return null

    const token = req.headers.authorization || ''

    if (!token) return null

    return jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);
}

const getServicesContext = () => {
    const prisma = new PrismaClient()

    const userService = new UserService(prisma)

    return {
        user: userService
    }
}