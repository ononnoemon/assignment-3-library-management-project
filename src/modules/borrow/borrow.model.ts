// src/modules/borrow/borrow.model.ts
import { Schema, model, Types } from 'mongoose';
import { Book } from '../book/book.model';

interface borrowItem {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

const borrowSchema = new Schema<borrowItem>(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

//Static method to reduce book copies and set availability
borrowSchema.statics.adjustBookAvailability = async function (bookId: Types.ObjectId, quantity: number) {
  const book = await Book.findById(bookId);
  if (!book) throw new Error('Book not found');
  if (book.copies < quantity) throw new Error('Not enough copies available');

  book.copies -= quantity;
  if (book.copies === 0) book.available = false;
  await book.save();
};

//Pre-save middleware for adjust book before saving borrow record
borrowSchema.pre('save', async function (next) {
  const borrow = this as any;
  await (borrow.constructor as any).adjustBookAvailability(borrow.book, borrow.quantity);
  next();
});

// Post-save middleware for logging
borrowSchema.post('save', function (doc) {
  console.log(`Borrow record saved for Book ID: ${doc.book}`);
});

export const Borrow = model<borrowItem>('Borrow', borrowSchema);

