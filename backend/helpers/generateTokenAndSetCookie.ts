import { Response } from "express";
import jwt from "jsonwebtoken";

//!----------------------------------------------------------------------------------------!//

const generateTokenAndSetCookie = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "15d",
    }); // JWT solo tendra de contenido el ID del usuario

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // La cookie solo es accesible desde el servidor, no desde el navegador mediante JavaScript
        sameSite: "strict", // La cookie solo se enviara si la solicitud se origino desde el mismo sitio web
        secure: process.env.NODE_ENV !== "development" // La cookie solo se enviará a través de conexiones seguras
    });

    return token
};

//!----------------------------------------------------------------------------------------!//

export default generateTokenAndSetCookie