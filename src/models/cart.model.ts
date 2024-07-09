import mongoose, { Schema, Document } from 'mongoose';

interface Icart extends Document {
  userId: mongoose.Types.ObjectId;
  books: [
    {
      book_id: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
      sub_total: number;
    }
  ];
  totalPrice: number;
}

const cartSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    books: [
      {
        book_id: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
        sub_total: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<Icart>('Cart', cartSchema);
