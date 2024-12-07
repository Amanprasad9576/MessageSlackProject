import { Channel } from "diagnostics_channel";
import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  body:{
    type:String,
    required:[true,'message is required'],
  },

  image:{
    type:String,
  },
  channelId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Channel',
    required:[true,'channel ID is required']
  },
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'sender Id is required']
  },

  workspaceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'workspace',
    required:[true,'workspace id is required']
  }

});
const Message =mongoose.model('Message',messageSchema);
export default Message;









/*
Receiver 
sender 
message


*/