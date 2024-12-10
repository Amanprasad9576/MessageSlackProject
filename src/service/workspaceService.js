import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const isUserAdminOfWorkspace = async (userId, workspace) => {
    console.log('Workspace Members:', workspace.members);
    console.log('User ID:', userId);
  
    const response = workspace.members.find(
      (member) =>
        (member.memberId.toString() === userId ||
          member.memberId._id?.toString() === userId) &&
        member.role === 'admin'
    );
  
    console.log('Is Admin Response:', response);
    return response;
  };
  
export const isUserMemberOfWorkspace = (workspace, userId) => {
    return workspace.members.find(
      (member) => member.memberId.toString() === userId
    );
  };



export const createWorkspaceService =async (workspaceData)=>{
    try {
     const joinCode = uuidv4().substring(0,6).toUpperCase();
    
     const response = await workspaceRepository.create({
      name:workspaceData.name,
      description:workspaceData.description,
       joinCode
     });
// add channelname to workspace and add member to workspace
   
     await workspaceRepository.addMemberToWorkspace(
         response._id,
         workspaceData.owner,
         'admin'
    )
    const updatedWorkspace = await workspaceRepository.
    addChannelToWorkspace(
        response._id,
        'general'
      );
      return updatedWorkspace;

    } catch (error) {
        console.log('Create workspace service error', error);
        if (error.name === 'ValidationError') {
          throw new ValidationError(
            {
              error: error.errors
            },
            error.message
          );
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new ValidationError(
            {
              error: ['A workspace with same details already exists']
            },
            'A workspace with same details already exists'
          );
        }
        throw error;
      }
    };
    
export const deleteWorkspaceService = async(workspaceId,userId)=>{
    try {
     const workspace = await workspaceRepository.getById(workspaceId);
     if(!workspace){
      throw new ClientError ({
        message:'Invalid Data sent from client',
        explanation:'workspace not found',
        statusCode:'StatusCode.NOT_FOUND',
      });
     }
     console.log(workspace.members,userId);
      const isAllowed =isUserAdminOfWorkspace(workspace,userId);
      
      if(isAllowed){
      await channelRepository.deleteMany(workspace.channels);  // delete the workspace
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }
    throw new ClientError({
      explanation: 'User is either not a memeber or an admin of the workspace',
      message: 'User is not allowed to delete the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
    } catch (error) {
       console.log(error);
       throw error;
  }
};
  

export const getWorkspaceService = async(userId,workspaceId) =>{
    try {
      const workspace = await workspaceRepository.getById(workspaceId); 
      if(!workspace){
       throw new ClientError({
        explanation: 'workspace not found',
        message: 'workspace does not exit',
        statusCode: StatusCodes.NOT_FOUND
       })
      }
     const isMember = isUserAdminOfWorkspace(workspace,userId);
     if(!isMember){
        throw new ClientError({
            message:'member is not found',
            explanation:'member is not part of workspace',
            statusCode:StatusCodes.NOT_FOUND,
        })
     }
     return workspace;
    } catch (error) {
        console.log('Get workspace service error', error);
        throw error;
    }
}




// fetch all the workspace in which user is member of it 
// add the channel to workspace
// create add member to channel 



/*
export const getWorkspaceService = async(workspaceId,userId)=>{
 try {
    const workspace = await workspaceRepository
    .getById(workspaceId);
 } catch (error) {
     console.log(error);
}
}

*/

// getWorkspaceDetailById --> (workspaceId)
// workspace >> channel >>