import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from "../repositories/workspaceRepository.js";
import ValidationError from '../utils/errors/validationError.js';

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
