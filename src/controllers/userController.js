import { StatusCodes } from "http-status-codes";

import { signInService, signUpService } from "../service/userService.js"
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const signUp = async (req, res) => {
    try {
        console.log(req.body);
      const user = await signUpService(req.body);
      
      return res
        .status(StatusCodes.CREATED)
        .json(successResponse(user, 'User created successfully'));
    } catch (error) {
      console.log('User controller error', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }
  
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  };


  export const signIn = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        if (!req.body.email) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            err: ["email Required"],
            data: {},
            message: "Validation error : email Required"
          });
        }
        if (!req.body.password) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            err: ["password Required"],
            data: {},
            message: "Validation error : password Required"
          });
        }
      const response = await signInService(req.body);
      console.log("Detail in controller layer",response);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(response, 'User signed in successfully'));
    } catch (error) {
      console.log('User controller error', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }
  
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
  };