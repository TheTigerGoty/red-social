import { Request, Response } from 'express';
import User, { UserInterface } from '../models/userModel';
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../helpers/generateTokenAndSetCookie';
import { v2 as cloudinary } from 'cloudinary';

//!----------------------------------------------------------------------------------------!//

interface AuthenticatedRequest extends Request {
    user?: UserInterface;
}

//!----------------------------------------------------------------------------------------!//

export const getUserProfile = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password').select('-updatedAt');
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

        res.status(200).json(user);
    } catch (error) {
        console.log('Error en getUserProfile controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const signupUser = async (req: Request, res: Response) => {
    try {
        const { name, email, username, password } = req.body;
        const user: UserInterface | null = await User.findOne({ $or: [{ email }, { username }] }); //Si uno de los 2 datos es validado seguira la ejecucion correctamente

        if (user) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id as string, res)

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ error: 'Los datos del Usuario son invalidos' })
        }

    } catch (error) {
        console.log('Error en signupUser controller', (error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
}

//*----------------------------------------------------------------------------------------*//

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user: UserInterface | null = await User.findOne({ username });
        const isPasswordCorrect: boolean = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) return res.status(400).json({ error: 'Usuario o Contraseña Invalidos' });

        generateTokenAndSetCookie(user._id as string, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log('Error en loginUser controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: 'Sesion Cerrada Exitosamente' })
    } catch (error) {
        console.log('Error en logoutUser controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const followUnFollowUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user?._id);

        if (id === req.user?._id.toString()) return res.status(400).json({ error: 'No puedes seguirte/dejar de seguirte a ti mismo' });

        if (!userToModify || !currentUser) return res.status(400).json({ error: 'Usuario no encontrado' });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user?._id } });
            await User.findByIdAndUpdate(req.user?._id, { $pull: { following: id } });

            res.status(200).json({ message: 'Usuario no seguido con exito' });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user?._id } });
            await User.findByIdAndUpdate(req.user?._id, { $push: { following: id } });

            res.status(200).json({ message: 'Usuario seguido con exito' });
        }
    } catch (error) {
        console.log('Error en followUnFollowUser controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {

    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user?._id;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

        if (req.params.id !== userId?.toString()) return res.status(400).json({ error: 'Tu no puedes actualizar los perfiles de otros usuarios' });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if (profilePic && user && user.profilePic) { // Verifica si hay valores definidos y no un 'null' | 'undefined'
            const fileName = user.profilePic.split("/").pop();

            if (fileName) {
                await cloudinary.uploader.destroy(fileName.split(".")[0]);
            } // Agarra el URL generado por cloudinary y lo recorta hasta convertirlo en algo similar a un 'id' propio

            const uploadedResponse = await cloudinary.uploader.upload(profilePic); // Se sube a Claudinary
            profilePic = uploadedResponse.secure_url; // Reflejara el cambio en el frontend
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        // Convertir en nulo la respuesta de contraseña (Asi no se seteara en localStorage)
        user.password = null;

        res.status(200).json(user);
    } catch (error) {
        console.log('Error en updateUser controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}



