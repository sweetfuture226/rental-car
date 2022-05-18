export interface ICart {
  id: string;
  userId: string;
  totalQuantity: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartCreate {
  userId: string;
  totalQuantity: number;
  totalAmount: number;
}

export interface ICartProductCreate {
  productId: string;
  cartId: string;
  amount: number;
  quantity: number;
}

export interface IOrderCreate {
  userId: string;
  addressId: string;
  amount: number;
  quantity: number;
  status: string;
  meta?: any;
  expectedDeliveryDate?: string;
}

export interface IStoreOrderCreate {
  storeId: string;
  orderId: string;
  productId: string;
  unitAmount: number;
  quantity: number;
  totalAmount: number;
  status: string;
  meta?: any;
  expectedDeliveryDate?: string;
  isSettled?: boolean;
}