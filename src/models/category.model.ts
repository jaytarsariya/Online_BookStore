import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  description: string;
}

const categorySchema: Schema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});
export const Category = mongoose.model<ICategory>('Category', categorySchema);
