import { Request, Response } from 'express';
import User, { UserInterface } from '../models/userModel';
import Post, { Reply } from '../models/postModel';
import ObjectId, { Types } from 'mongoose';

//!----------------------------------------------------------------------------------------!//

interface AuthenticatedRequest extends Request {
    user?: UserInterface;
}

//!----------------------------------------------------------------------------------------!//

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { postedBy, text, img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "Los campos 'Publicado por' y 'Texto' son requeridos" });
        };

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ messages: 'Usuario no encontrado' });
        };

        if (user._id.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ messages: 'No autorizado para la creacion de la publicacion' });
        };

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ messages: `El texto debe tener menos de ${maxLength} caracteres.` });
        }

        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        res.status(201).json({ message: 'Post Creado Correctamente', newPost });
    } catch (error) {
        console.log('Error en createPost controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const getPost = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Publicacion no encontrada' });
        }

        res.status(200).json({ message: 'Publicacion Encontrada', post })
    } catch (error) {
        console.log('Error en getPost controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Publicacion no encontrada' });
        };

        if (post.postedBy.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: 'No tienes autorizacion para eliminar esta publicacion' });
        };

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'La publicacion ha sido eliminada correctamente' })
    } catch (error) {
        console.log('Error en deletePost controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const likeUnlikePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?._id as Types.ObjectId;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Publicacion no encontrada' });
        };

        const userLikedPost = post.likes?.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: 'No me gusta la publicacion realizada correctamente' });
        } else {
            post.likes?.push(userId);
            await post.save();
            res.status(200).json({ message: 'Me gusta la publicacion realizada correctamente' })
        }
    } catch (error) {
        console.log('Error en likeUnlikePost controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const replyToPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user?._id;
        const userProfilePic = req.user?.profilePic;
        const username = req.user?.username;

        if (!text) {
            return res.status(400).json({ message: "La seccion 'texto' es requerido" });
        };

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Publicacion no encontrada' });
        };

        if (!userId) {
            return res.status(400).json({ message: "El usuario no está autenticado" });
        }

        const reply = { userId: userId as Types.ObjectId, text, userProfilePic, username };

        post.replies?.push(reply);
        await post.save();

        res.status(200).json({ message: "'Responder' se añadio correctamente", post })
    } catch (error) {
        console.log('Error en replyToPost controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}

//*----------------------------------------------------------------------------------------*//

export const getFeedPosts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        };

        const following = user.following;
        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json({ feedPosts });
    } catch (error) {
        console.log('Error en getFeedPosts controller', (error as Error).message);
        res.status(500).json({ error: 'Error Interno del Servidor' });
    }
}