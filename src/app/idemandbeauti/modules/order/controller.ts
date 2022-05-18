import { Request, Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import ProductDBService from '../product/dbService';
import OrderDBService from './dbService';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { UserDBService } from '../../../crm/modules/users';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const stripeObj = require('stripe');


class OrderController {
  static async addItemToCart(req: IRequest, res: Response) {
    try {
      const userId = req.decodedUser.id;
      // get user cart
      const userCart = await OrderDBService.getOrCreateCart(userId);
      // get product
      const thisProduct = await ProductDBService.getProduct({
        id: req.body.productId,
      });

      const userCartProduct = await OrderDBService.getCartProduct({
        cartId: userCart.id,
        productId: thisProduct.id,
      });

      if (!userCartProduct) {
        // add product to cart
        await OrderDBService.addProductToCart(userCart.id, thisProduct);
      } else {
        // update product quantity
        const newQuantity = userCartProduct.quantity + 1;
        await userCartProduct.update({
          quantity: newQuantity,
          amount:  thisProduct.price,
        });
      }
      // update cart total amount and quantity
      const newAmount = userCart.totalAmount + thisProduct.price;
      const newQuantity = userCart.totalQuantity + 1;
      await userCart.update({
        totalAmount: newAmount,
        totalQuantity: newQuantity,
      });
      return ApiResponse.success(res, 200, 'Product added to cart', userCart);

    } catch (error) {
      return ApiResponse.error(res, 400, 'Operation failed');
    }
  }

  static async removeItemFromCart(req: IRequest, res: Response) {
    try {
      const userId = req.decodedUser.id;
      // get user cart
      const userCart = await OrderDBService.getCart(userId);
      // get product
      const thisProduct = await ProductDBService.getProduct({
        id: req.body.productId,
      });

      const userCartProduct = await OrderDBService.getCartProduct({
        cartId: userCart.id,
        productId: thisProduct.id,
      });

      if (!userCartProduct) {
        return ApiResponse.error(res, 400, 'Product not in cart');
      } 
      // update product quantity
      if(userCartProduct.quantity < 2) {
        // remove product from cart
        await userCartProduct.destroy();

        // get cart products
        const cartProducts = await OrderDBService.getCartProducts({
          cartId: userCart.id,
        });
        if (cartProducts.length === 0) {
          // remove cart
          await userCart.destroy();
          return ApiResponse.success(res, 200, 'Cart removed');
        }
      };
      const newQuantity = userCartProduct.quantity - 1;
      await userCartProduct.update({
        quantity: newQuantity,
      });
      // update cart total amount and quantity
      const newAmount = userCart.totalAmount - thisProduct.price;
      const newCartQuantity = userCart.totalQuantity - 1;
      await userCart.update({
        totalAmount: newAmount,
        totalQuantity: newCartQuantity,
      });
      return ApiResponse.success(res, 200, 'Product removed from cart', userCart);

    } catch (error) {
      console.log(error.message)
      return ApiResponse.error(res, 400, 'Operation failed');
    }
  }

  static async getCart(req: IRequest, res: Response) {
    try {
      const userId = req.decodedUser.id;
      const cart = await OrderDBService.getCart(userId, true);
      if (!cart) {
        return ApiResponse.success(res, 200, 'Cart is empty', {});
      }
      return ApiResponse.success(res, 200, 'Cart retrieved', cart);
    } catch (error) {
      console.log(error.message);
      return ApiResponse.error(res, 400, 'Operation failed');
    }
  }

  static async createSession({ userId, orderId, amount, email}) {
    try {
    // register the checkout payment
    const paymentRec = await OrderDBService.initiateOrderPaymentRec({userId: userId, orderId});
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        orderId,
        userId,
        internalPaymentId: paymentRec.id,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Payment for IDEMAND BEAUTI Order`,
              images: [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://quikinfluence.com',
      cancel_url: 'https://quikinfluence.com',
    });
    const amountInt = !isNaN(Number(session?.amount_total)) ? Number(session?.amount_total)/100 : amount;
    await paymentRec.update({
      paymentId: session.payment_intent,
      amount: amountInt
    })
    return { session, success: true };
    } catch (error) {
      console.log(error);
      return { session: null, success: false, message: error.message };
    }

  }

  static async checkout(req: IRequest, res: Response) {
    try {
      const userId = req.decodedUser.id;
      const cart = await OrderDBService.getCart(userId, true);
      const cartProducts = await OrderDBService.getCartProducts({
        cartId: cart.id,
      }, true);
      if (!cart || !cartProducts?.length) {
        return ApiResponse.success(res, 200, 'Cart is empty', {});
      }

      const thisAddress = await UserDBService.getAddress({
        id: req.body.addressId,
      });

      if(!thisAddress) {
        return ApiResponse.error(res, 400, 'Address not found');
      };

      const thisUser = await UserDBService.getUserById(userId);
      if(!thisUser?.email) {
        return ApiResponse.error(res, 400, 'User must have a valid email before he can proceed with checkout');
      }
      
      const order = await OrderDBService.createOrder({
        userId,
        addressId: req.body.addressId,
        amount: cart?.totalAmount,
        quantity: cart.quantity,
        status: 'pending',
        meta: {
          cart: cart?.toJSON?.(),
          address: thisAddress?.toJSON?.(),
        }
      });
      // create store order
      const storeProducts = [];
      for (let i = 0; i < cartProducts.length; i++) {
        const cartProduct = cartProducts?.[i]?.dataValues;
        const storeProduct = {
          orderId: order.id,
          storeId: cartProduct.Product.storeId,
          productId: cartProduct.productId,
          quantity: cartProduct.quantity,
          unitAmount: cartProduct.amount,
          totalAmount: cartProduct.amount * cartProduct.quantity,
          status: 'pending',
          meta: {
            cartProduct: cartProduct.toJSON?.()
          }
        }
        storeProducts.push(storeProduct);
      };

      // create store orders
      await OrderDBService.createStoreOrder(storeProducts);

      // clear cart
      await OrderDBService.clearCart(cart.id);

      

      // create sesion for checkout
      const session = await OrderController.createSession({
        userId,
        email: thisUser.email,
        orderId: order.id,
        amount: cart?.totalAmount,
      });

      return ApiResponse.success(res, 200, 'Cart checked out', session);
    } catch (error) {
      console.log(error.message);
      return ApiResponse.error(res, 400, 'Operation failed');
    }
  }
}

export default OrderController;