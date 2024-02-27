import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import { v2 as cloudinary } from 'cloudinary';

//!----------------------------------------------------------------------------------------!//


dotenv.config(); // Utilizar las variables de entorno

connectDB(); // Conectarse a MongoDB

const app = express();

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: '50mb' })); // Analiza las solicitudes en formato JSON y los transforma en mensaje en un objeto JS (req.body)
app.use(express.urlencoded({ extended: true })); // Analiza datos de formulario HTML y los transforma en mensaje en un objeto JS (req.body)
app.use(cookieParser()); // Analiza las cookies provenientes de solicitudes HTTP y las convierte en objeto JS (req.cookie)

//ROUTES
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(5000, () => console.log(`Server inicio en http://localhost:${PORT}`));
