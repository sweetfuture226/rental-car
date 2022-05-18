import controller from './controller';
import validations from './validations';

export const StripeController = controller;
export const StripeValidator = validations;

export default {
  StripeController: controller,
  StripeValidator: validations,
};
