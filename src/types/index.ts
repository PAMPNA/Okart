export interface Product {
  id: string;
  name: string;
  origin: string;
  price: number;
  unit: string;
  verifiedOrigin: boolean;
  description: string;
  image: string;
}

export interface DeliveryFormValues {
  fullName: string;
  mobileNumber: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderPayload {
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  deliveryCharge: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: 'Cash on Delivery';
  createdAt: string;
}
