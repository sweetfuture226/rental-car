import validation from "./validations";
import controller from "./controller";
import middleware from "./middleware";
import dbservice from "./dbService";


export const ApplicationValidation = validation;
export const ApplicationController = controller;
export const ApplicationDBService = dbservice;
export const ApplicationMiddleware = middleware;

export default {
  ApplicationValidation: validation,
  ApplicationController: controller,
  ApplicationMiddleware: middleware,
  ApplicationDBService: dbservice
};