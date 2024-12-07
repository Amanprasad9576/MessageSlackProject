import mongoose from 'mongoose'

export const channelSchema = new mongoose.Schema({
   
      name:{
           type:String,
           required:[true,'channel name is required']
       },
  },
    {timestamps:true},);

const Channel = mongoose.model('Channel',channelSchema);
export default Channel;







// sender id 
// receiver id 
// message