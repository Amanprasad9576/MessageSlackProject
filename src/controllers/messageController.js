import { StatusCodes } from "http-status-codes";

import { getMessageService } from "../service/messageService.js";
import {  customErrorResponse,
         internalErrorResponse,
         successResponse      } from "../utils/common/responseObjects.js";
export const getMessage = async (req,res)=>{
   try{
   const message = await getMessageService(  {
    channelId: req.params.channelId
    },
   req.query.page || 1,
   req.query.limit || 20,
   req.user
  );
  return res
  .status(StatusCodes.OK)
  .json(successResponse(message,'message fatch successfully'));

  }
  catch (error) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};






// create message
// messageParams,page ,limit 