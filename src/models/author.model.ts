import mongoose, { Schema, Document } from 'mongoose';

interface IAuthor extends Document {
  author_name: string;
  biography: string;
  birth_date: Date;
}

export const authorSchema: Schema = new Schema({
  author_name: {
    type: String,
  },
  biography: {
    type: String,
  },
  birth_date: {
    type: Date,
  },
});

export const Author = mongoose.model<IAuthor>('Author', authorSchema);
