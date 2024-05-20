import { Schema, model } from 'mongoose';

const messagesCollection = 'messages';

const messageSchema = new Schema({
    user: { type: String },
    text: { type: String },
    date: { type: Date }
});

const messageModel = model(messagesCollection, messageSchema);

export default messageModel;