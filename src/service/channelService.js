import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
    try {
      const channel =
        await channelRepository.getAllChannelWithWorkspaceDetails(channelId);
  
      console.log(channel);
  
      if (!channel || !channel.workspaceId) {
        throw new ClientError({
          message: 'Channel not found with the provided ID',
          explanation: 'Invalid data sent from the client',
          statusCode: StatusCodes.NOT_FOUND
        });
      }
  
      const isUserPartOfWorkspace = isUserMemberOfWorkspace(
        channel.workspaceId,
        userId
      );
  
      if (!isUserPartOfWorkspace) {
        throw new ClientError({
          message:
            'User is not a member of the workspace and hence cannot access the channel',
          explanation: 'User is not a member of the workspace',
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
  
      
      console.log('Channel in service', channel);
  
      return {
      
        _id: channel._id,
        name: channel.name,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        workspaceId: channel.workspaceId
      };
    } catch (error) {
      console.log('Get channel by ID service error', error);
      throw error;
    }
  };
  


// match the channelId with the feature of workspace of channel
// check user is member of workspace or not if yes then return channelDetail
//



//  memeber of workspace and channelId 
// channel is part of workspace 
// now find the workspace of it and userId is member of it or not
// if yes then fetch detail of it 
// 