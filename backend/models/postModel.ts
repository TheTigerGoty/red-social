import mongoose, { Document, Schema, Types } from "mongoose";

//!----------------------------------------------------------------------------------------!//

export interface Reply {
    userId: Types.ObjectId;
    text: string;
    userProfilePic?: string;
    username?: string;
}

//*----------------------------------------------------------------------------------------*//

export interface PostInterface extends Document {
    postedBy: Types.ObjectId;
    text?: string;
    img?: string;
    likes?: Types.ObjectId[];
    replies?: Reply[];
}

//!----------------------------------------------------------------------------------------!//

const postSchema: Schema<PostInterface> = new mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            maxLength: 500
        },
        img: {
            type: String
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        replies: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                userProfilePic: {
                    type: String
                },
                username: {
                    type: String
                }
            }
        ]
    },
    { timestamps: true }
)

const Post = mongoose.model<PostInterface>('Post', postSchema);
export default Post;