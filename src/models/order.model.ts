import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItems {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  // name:string
  // author:string
  // description:string
  // image:string
}

interface IPaymentInfo {
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
  amount: number;
  currency: string;
  payment_date: Date;
  // card_last4?: string; // Optional, last 4 digits of the card
  // card_holder_name?: string; // Optional, name on the card
  // gateway_response?: string; // Optional, additional gateway response
}

interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  orderItems: [IOrderItems];
  total_amount: number;
  order_date: Date;
  status: string;
  shipping_address: string;
  payment_info: IPaymentInfo;
}

const orderSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItem: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        total_price: {
          type: Number,
        },
      },
    ],
    total_amount: {
      type: Number,
    },
    order_date: {
      type: Date,
      default: Date.now(),
    },
    order_status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shipping_address: {
      contact_number: String,
      name: String,
      address_line1: String,
      landmark: String,
      address_line2: String,
      city: String,
      state: String,
      country: String,
      pin_code: String,
    },
    payment_info: {
      payment_method: {
        type: String,
      },
      payment_status: {
        type: String,
        enum: ['pending', 'complated', 'failed'],
        default: 'pending',
      },
      transaction_id: {
        type: String,
      },
      amount: {
        type: Number,
      },
      currency: {
        type: String,
      },
      payment_date: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
