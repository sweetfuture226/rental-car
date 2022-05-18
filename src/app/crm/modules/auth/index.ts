import middleware from "./middleware";
import controller from "./controller";
import validations from "./validations";


export const AuthMiddleware = middleware;
export const AuthController = controller;
export const AuthValidation = validations;

export default {
  AuthMiddleware: middleware,
  AuthController: controller,
  AuthValidation: validations
};