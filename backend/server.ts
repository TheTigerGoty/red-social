import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute"
import postRoutes from "./routes/postRoute"

//!----------------------------------------------------------------------------------------!//


dotenv.config(); // Utilizar las variables de entorno

connectDB(); // Conectarse a MongoDB

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // Analiza las solicitudes en formato JSON y los transforma en mensaje en un objeto JS (req.body)
app.use(express.urlencoded({ extended: true })); // Analiza datos de formulario HTML y los transforma en mensaje en un objeto JS (req.body)
app.use(cookieParser()); // Analiza las cookies provenientes de solicitudes HTTP y las convierte en objeto JS (req.cookie)

//ROUTES
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(5000, () => console.log(`Server inicio en http://localhost:${PORT}`));
