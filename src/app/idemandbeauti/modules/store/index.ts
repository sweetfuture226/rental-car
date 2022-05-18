import validation from "./validations";
import controller from "./controller";
import dbService from "./dbService";
import middleware from "./middleware";

export const StoreValidation = validation;
export const StoreController = controller;
export const StoreDBService = dbService;
export const StoreMiddleware = middleware;

export default {
  StoreValidation: validation,
  StoreController: controller,
  StoreDBService: dbService,
  StoreMiddleware: middleware
};