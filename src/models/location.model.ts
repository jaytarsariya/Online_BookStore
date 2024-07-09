import mongoose, { Schema, Document } from 'mongoose';

const stockLocationSchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Book' },
  contact_number: { type: String },
  name: { type: String },
  address_line1: { type: String },
  landmark: { type: String },
  address_line2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  pin_code: { type: String },
  location: {
    longitude: String,
    latitude: String,
  },
});

export const StockLocation = mongoose.model('StockLocation',stockLocationSchema);
