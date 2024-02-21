import mongoose, { Document, Schema, Types } from "mongoose";

//!----------------------------------------------------------------------------------------!//

export interface UserInterface extends Document {
    _id: string | Types.ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
    profilePic: string;
    followers: string[];
    following: string[];
    bio: string;
}

//!----------------------------------------------------------------------------------------!//

const userSchema: Schema<UserInterface> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: ''
        },
        followers: {
            type: [String],
            default: []
        },
        following: {
            type: [String],
            default: []
        },
        bio: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

//!----------------------------------------------------------------------------------------!//

const User = mongoose.model<UserInterface>('User', userSchema);
export default User;