import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isMemberPartOfWorkspaceService } from "./memberService.js";

export const getMessageService = async (messageParams,page,limit,user)=>{
  const channelDetails = await channelRepository.
   getAllChannelWithWorkspaceDetails(messageParams.channelId);

   const workspace = channelDetails.workspaceId ;

   const isMember = await isMemberPartOfWorkspaceService(workspace,user);  // workspace,userId
   
   if(!isMember){
    throw new ClientError({
        message:'please enter the correct details',
        explanation:'user is not part of workspace',
        statusCode:StatusCodes.UNAUTHORIZED
    })
   }

  const message = await messageRepository.getPaginatedMessaged(
    messageParams,
    page,
    limit
  );
  return message;
}

export const createMessageService = async (message)=>{
   const newMessage = await messageRepository.create(message);
   return newMessage;
}




// create message 
// messageParam ,user ,limit ,page
// messageParam,limit,page  
// getMessage 
// 