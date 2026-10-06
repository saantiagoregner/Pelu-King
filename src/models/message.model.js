import mongoose from "mongoose";
import { jsonOptions } from "../utils/jsonOptions.js";
const messageSchema = new mongoose.Schema(
{
    user: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
},
{ timestamps: true, toJSON: jsonOptions }
);
export default mongoose.model("Message", messageSchema);