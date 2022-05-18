import validation from "./validations";
import controller from "./controller";
import middleware from "./middleware";
import dbservice from "./dbService";


export const OrganizationValidation = validation;
export const OrganizationController = controller;
export const OrganizationDBService = dbservice;
export const OrganizationMiddleware = middleware;

export default {
  OrganizationValidation: validation,
  OrganizationController: controller,
  OrganizationMiddleware: middleware,
  OrganizationDBService: dbservice
};