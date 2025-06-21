"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
// src/modules/borrow/borrow.model.ts
const mongoose_1 = require("mongoose");
const book_model_1 = require("../book/book.model");
const borrowSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
}, {
    timestamps: true,
});
//Static method to reduce book copies and set availability
borrowSchema.statics.adjustBookAvailability = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield book_model_1.Book.findById(bookId);
        if (!book)
            throw new Error('Book not found');
        if (book.copies < quantity)
            throw new Error('Not enough copies available');
        book.copies -= quantity;
        if (book.copies === 0)
            book.available = false;
        yield book.save();
    });
};
//Pre-save middleware for adjust book before saving borrow record
borrowSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const borrow = this;
        yield borrow.constructor.adjustBookAvailability(borrow.book, borrow.quantity);
        next();
    });
});
// Post-save middleware for logging
borrowSchema.post('save', function (doc) {
    console.log(`Borrow record saved for Book ID: ${doc.book}`);
});
exports.Borrow = (0, mongoose_1.model)('Borrow', borrowSchema);
