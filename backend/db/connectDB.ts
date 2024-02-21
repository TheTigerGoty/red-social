import mongoose from "mongoose";

//!----------------------------------------------------------------------------------------!//

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.log('Error de conexion con MongoDB', (error as Error).message);
        process.exit(1);
    }
}

//!----------------------------------------------------------------------------------------!//

export default connectDB;