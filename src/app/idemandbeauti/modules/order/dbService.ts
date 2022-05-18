import { generateRandomAccessKeyString } from '../../../../utils/helpers';
import { ICartCreate, ICartProductCreate, IOrderCreate, IStoreOrderCreate } from "./types";
//@ts-ignore
import { Cart, CartProduct, Product, Order, Payment, StoreOrder, Organization, Admin } from '../../../../db/models';
import { stripeBalanceFunction, transfer } from '../../../../services/job/managePaymentSplit';
import rollbar from '../../../../utils/logger';
class OrderDBService  {
  static async createCart(payload: ICartCreate) {
    const cart = await Cart.create({
      ...payload,
    });
    return cart;
  }

  static async getOrCreateCart(userId: string) {
    let cart = await OrderDBService.getCart(userId);
    if(!cart) {
      cart = await OrderDBService.createCart({
        userId,
        totalQuantity: 0,
        totalAmount: 0,
      });
    }
    return cart;
  }

  static async createCartProduct(payload: ICartProductCreate) {
    const cartProduct = await CartProduct.create({
      ...payload,
    });
    return cartProduct;
  }

  static async addProductToCart(cartId: string, product: any) {
    const cartProduct = await OrderDBService.createCartProduct({
      productId: product.id,
      cartId,
      amount: Number(product.price),
      quantity: 1,
    });
    return cartProduct;
  }

  static async getCartProduct(where: { cartId?: string, productId?: string }) {
    const cartProduct = await CartProduct.findOne({
      where,
    });
    return cartProduct;
  }

  static async clearCart(cartId: string) {
    await CartProduct.destroy({
      where: {
        cartId,
      },
    });

    await Cart.destroy({
      where: {
        id: cartId,
      },
    });
  }


  static async getCartProducts(where: { cartId?: string }, includeStore: boolean = false) {
    const cartProducts = await CartProduct.findAll({
      where,
      ...(includeStore ? {
        include: [{
          model: Product,
          attributes: ['id', 'storeId', 'imageUrl'],
          }],
          } : {}),

    });
    return cartProducts;
  }

  static async getCart(userId: string, includeDependencies: boolean = false) {
    const include = includeDependencies ? {
      include: [{
        model: CartProduct,
        include: [{
          model: Product,
        }],
      }],
    }: {}
    const cart = await Cart.findOne({
      where: {
        userId,
      },
      ...include,
    });
    return cart;
  }

  static async createOrder(payload: IOrderCreate) {
    console.log(payload)
    const order = await Order.create(payload);
    return order;
  }

  static async createStoreOrder (bulkload: IStoreOrderCreate[]) {
    const order = await StoreOrder.bulkCreate(bulkload);
    return order;
  }

  static async getOrders(where: any) {
    const orders = await Order.findAll({
      where,
    });
    return orders;
  }

  static async initiateOrderPaymentRec ({ userId, orderId }) {
    const newPaymentRecord = await Payment.create({
      status: 'STARTED',
      userId: userId,
      meta: {
        orderId: orderId,
      },
      paymentType: 'IDEMAND_PRODUCT_CHECKOUT'
    });

    await Order.update({
      status: 'PAYMENT_INITIATED',
      paymentRef: newPaymentRecord.id,
    }, {
      where: {
        id: orderId,
      }
    });

    return newPaymentRecord;
  }

  static async getVendorStripeAcctId(vendorId: string) {
    const org = await Organization.findOne({
      where: {
        id: vendorId,
      },
    });
    if(org) {
      const owner = await Admin.findOne({
        where: {
          id: org.ownerId,
        },
      });
      if(owner) {
        return owner.stripeAcctId;
      }
    }
    return false;
  }

  static async triggerPayment({ vendorId, amount, storeOrder }: {vendorId: string; amount: number, storeOrder: any}) {
    const vendorStripeAcctId = await OrderDBService.getVendorStripeAcctId(vendorId);
    if(!vendorStripeAcctId) {
      throw new Error('Vendor Stripe Account Id not found');
    };

    // confirm balance on payment account
    const balance = await stripeBalanceFunction();

    if (balance.available > Number(amount) * 100) {
      // create payment record
      const newPaymentRecord = await Payment.create({
         status: 'STARTED',
         userId: vendorId,
         amount,
         currency: 'usd',
        paymentType: 'IDEMAND_VENDOR_SETTLEMENT',
         meta: {
           storeOrder,
           vendorId,
         }
      });

      // transfer payment

      const res = await transfer(amount, 'usd', vendorStripeAcctId, 'payment for store order: ' + storeOrder.id);
      if(res) {
        // transaction is successful
        await newPaymentRecord.update({
          status: 'SUCCESS',
        });
      } else {
        // transaction failed
        await newPaymentRecord.update({
          status: 'FAILED',
        });
      }
    } else {
      // balance not available
      rollbar("Transfer succeeded: ", balance);
      throw new Error('Payment cannot be fulfilled. Error code 007')
    }
  }
};

export default OrderDBService;