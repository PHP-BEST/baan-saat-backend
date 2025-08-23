"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    mongoose_1.default.set('strictQuery', true);
    let mongoUri = '';
    if (process.env.NODE_ENV === 'production') {
        mongoUri = process.env.MONGO_URI_PROD || '';
    }
    else {
        mongoUri = process.env.MONGO_URI_DEV || '';
    }
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose_1.default.connect(mongoUri);
};
exports.default = connectDB;
