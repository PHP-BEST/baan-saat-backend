import { Schema, model } from 'mongoose';

interface IMessage {
    reciever?: Schema.Types.ObjectId;
    sender?: Schema.Types.ObjectId;
    text: string;
    url?: string;
}

const MessageSchema = new Schema(
    {
        reciever: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        text: {
            type: String,
            required: true,
            maxLength: 2000,
        },
        url: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
