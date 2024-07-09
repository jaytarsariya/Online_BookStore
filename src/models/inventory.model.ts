import mongoose, { Schema, Document } from 'mongoose';

const inventorySchema = new mongoose.Schema({
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
  },
  stock: {
    type: Number,
    default: 0,
  },
  stock_address: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
