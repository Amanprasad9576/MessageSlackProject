import { StatusCodes } from "http-status-codes";

import { isMemberPartOfWorkspaceService } from "../service/memberService.js"
import {  customErrorResponse,
           internalErrorResponse,
           successResponse } from "../utils/common/responseObjects.js";


export const isMemberPartOfWorkspaceController = async (req,res)=>{
    try {
       const response = await isMemberPartOfWorkspaceService(
        req.params.workspaceId,
        req.user
       );
       return res 
       .status(StatusCodes.OK)
       .json(successResponse(response,'user is a member of it'));
       
    } catch (error) {
       console.log('error in controller',error); 
       if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }
  
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  };




// workspaceId and userId  