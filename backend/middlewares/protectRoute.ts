import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from '../models/userModel';

//!----------------------------------------------------------------------------------------!//

interface DecodedToken {
    userId: string;
}

//*----------------------------------------------------------------------------------------*//

interface AuthenticatedRequest extends Request {
    user?: UserInterface;
}

//!----------------------------------------------------------------------------------------!//

const protectRoute = async (req: AuthenticatedRequest, res: Response, next:NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: 'No Autorizado - No se Provee Token' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

        if (!decoded) {
            return res.status(401).json({ error: 'No Autorizado - Token Invalido' })
        }

        const user: UserInterface = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'Usuario no Encontrado' })
        }

        req.user = user

        next()

    } catch (error) {
        console.log('Error en protectRoute middleware: ', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' })
    }
}

//!----------------------------------------------------------------------------------------!//

export default protectRoute