import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const isUserAdminOfWorkspace = async (userId, workspace) => {
    try {
      // Validate workspace and members
      console.log('workspace in service',workspace);
      
      if ( !Array.isArray(workspace.members)) {
        console.error('Invalid  members:', workspace);
        throw new Error(' members data is invalid or missing.');
      }
  
      console.log('Workspace Members: in UserAdmin function', workspace.members);
      console.log('User ID: in UserAdmin function', userId);
  
      // Find the admin member
      const response = workspace.members.find(
        (member) =>
          (member.memberId.toString() === userId ||
            member.memberId._id?.toString() === userId) &&
          member.role === 'admin'
      );
  
      console.log('Is Admin Response:', response);
      return response;
    } catch (error) {
      console.error('Error in isUserAdminOfWorkspace:', error.message);
      throw error;
    }
  };
  
  
  
export const isUserMemberOfWorkspace = (workspace, userId) => {
    return workspace.members.find(
      (member) => member.memberId.toString() === userId
    );
  };

  const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
    return workspace.channels.find(
      (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
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
     console.log('workspace member  in service layer',workspace.members);
     console.log('userId in service layer',userId);
     console.log('member of workspace',workspace.members);

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

export const getWorkspaceByJoinCodeService = async (joinCode,userId) =>{
    try {
      const workspace = await workspaceRepository.
      getWorkspaceByJoinCode(joinCode);
       if(!workspace){
        throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
        });
    }
      const isMember = isUserMemberOfWorkspace(workspace,userId);
     if(!isMember){
        throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'user is not part of workspace',
        statusCode: StatusCodes.NOT_FOUND 
        })
     }
      return workspace;
    } catch (error) {
      console.log('Error in fetch the workspace by joinCode',error);  
    }
}

export const getWorkspacesUserIsMemberOfService = async (userId) => {
    try {
      const response =
        await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
      return response;
    } catch (error) {
      console.log('Get workspaces user is member of service error', error);
      throw error;
    }
  };
  

export const updateWorkspaceService = async (
    workspaceId,
    workspaceData,
    userId
  ) => {
    try {
      const workspace = await workspaceRepository.getById(workspaceId);
      if (!workspace) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'Workspace not found',
          statusCode: StatusCodes.NOT_FOUND
        });
      }
      const isAdmin = isUserAdminOfWorkspace(workspace, userId);
      if (!isAdmin) {
        throw new ClientError({
          explanation: 'User is not an admin of the workspace',
          message: 'User is not an admin of the workspace',
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
      const updatedWorkspace = await workspaceRepository.update(
        workspaceId,
        workspaceData
      );
      return updatedWorkspace;
    } catch (error) {
      console.log('update workspace service error', error);
      throw error;
    }
  };
  
  export const addMemberToWorkspaceService = async (
    workspaceId,
    memberId,
    role,
    userId
  ) => {
    try {
      const workspace = await workspaceRepository.getById(workspaceId);
      if (!workspace) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'Workspace not found',
          statusCode: StatusCodes.NOT_FOUND
        });
      }
  
      const isAdmin = isUserAdminOfWorkspace(workspace, userId);
      if (!isAdmin) {
        throw new ClientError({
          explanation: 'User is not an admin of the workspace',
          message: 'User is not an admin of the workspace',
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
      const isValidUser = await userRepository.getById(memberId);
      if (!isValidUser) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'User not found',
          statusCode: StatusCodes.NOT_FOUND
        });
      }
      const isMember = isUserMemberOfWorkspace(workspace, memberId);
      if (isMember) {
        throw new ClientError({
          explanation: 'User is already a member of the workspace',
          message: 'User is already a member of the workspace',
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
      const response = await workspaceRepository.addMemberToWorkspace(
        workspaceId,
        memberId,
        role
      );
      
      return response;
    } catch (error) {
      console.log('addMemberToWorkspaceService error', error);
      throw error;
    }
  };
  

  export const addChannelToWorkspaceService = async (
    workspaceId,
    channelName,
    userId
  ) => {
    try {
      const workspace =
        await workspaceRepository.getWorkspaceDetailsById(workspaceId);
      if (!workspace) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'Workspace not found',
          statusCode: StatusCodes.NOT_FOUND
        });
      }
      console.log('addChannelToWorkspaceService', workspace, userId);
      const isAdmin = isUserAdminOfWorkspace(workspace, userId);
      if (!isAdmin) {
        throw new ClientError({
          explanation: 'User is not an admin of the workspace',
          message: 'User is not an admin of the workspace',
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
      const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
        workspace,
        channelName
      );
      if (isChannelPartOfWorkspace) {
        throw new ClientError({
          explanation: 'Invalid data sent from the client',
          message: 'Channel already part of workspace',
          statusCode: StatusCodes.FORBIDDEN
        });
      }
      console.log('addChannelToWorkspaceService', workspaceId, channelName);
      const response = await workspaceRepository.addChannelToWorkspace(
        workspaceId,
        channelName
      );
  
      return response;
    } catch (error) {
      console.log('addChannelToWorkspaceService error', error);
      throw error;
    }
  };

    


     




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