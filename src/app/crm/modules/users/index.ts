import validation from "./validations";
import controller from "./controller";
import dbService from "./dbService";


export const UserValidation = validation;
export const UserController = controller;
export const UserDBService = dbService;

export default {
  UserValidation: validation,
  UserController: controller,
  UserDBService: dbService
};