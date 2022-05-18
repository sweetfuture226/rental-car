import validation from "./validations";
import controller from "./controller";
import middleware from "./middleware";
import dbService from "./dbService";


export const AdminValidation = validation;
export const AdminController = controller;
export const AdminMiddleware = middleware;
export const AdminDBService = dbService;

export default {
  AdminValidation: validation,
  AdminController: controller,
  AdminMiddleware: middleware,
  AdminDBService: dbService
};