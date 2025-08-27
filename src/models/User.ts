import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    userId: string;
    name: string;
    email?: string;
    profileUrl?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema(
    {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        profileUrl: { type: String, default: null },
        phoneNumber: { type: String, default: null },
        address: { type: String, default: null } 
    },
    { timestamps: true }
);

const User = model<IUser>("Users", userSchema);

export default User;