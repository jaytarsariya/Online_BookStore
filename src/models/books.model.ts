import mongoose, { Schema, Document } from 'mongoose';

interface IBooks extends Document {
  title: string;
  author: Schema.Types.ObjectId;
  isbn: string;
  price: number;
  description: string;
  category: string;
  publisher: string;
  seller: string;
  publication_date: Date;
  stock: Number;
  cover_img: String;
}

const bookSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
    },
    isbn: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    publisher: {
      type: Schema.Types.ObjectId,
      ref: 'Publisher',
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    publication_date: {
      type: Date,
    },
    stock: {
      type: Number,
    },
    cover_img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<IBooks>('Book', bookSchema);
