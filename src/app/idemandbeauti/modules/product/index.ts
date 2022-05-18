import validation from "./validations";
import controller from "./controller";
import middleware from "./middleware";

export const ProductValidation = validation;
export const ProductController = controller;
export const ProductMiddleware = middleware;

export default {
  ProductValidation: validation,
  ProductController: controller,
  ProductMiddleware: middleware,
};