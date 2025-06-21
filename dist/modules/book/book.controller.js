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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookHandler = express_1.default.Router();
const book_model_1 = require("./book.model");
// POST  /api/books
bookHandler.post('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBook = new book_model_1.Book(req.body);
        yield newBook.save();
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: newBook,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Book creation failed',
            error,
        });
    }
}));
//Get All Book
bookHandler.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy || 'createdAt';
        const sort = req.query.sort === 'asc' ? 1 : -1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};
        if (filter) {
            query.genre = filter.toUpperCase();
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort })
            .limit(limit);
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get books',
            error: error instanceof Error ? error.message : error,
        });
    }
}));
//Get book by ID
bookHandler.get('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findById(req.params.bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: 'Book not found',
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve book',
            error,
        });
    }
    //   res.json({
    //     success: true,
    //     message: 'Book retrieved',
    //     data: { id: req.params.bookId },
    //   });
}));
//Update Book by ID
bookHandler.put('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(bookId, updateData, { new: true, runValidators: true });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: 'Book not found',
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update book',
            error,
        });
    }
}));
// DELETE /api/books/:bookId
bookHandler.delete('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const deletedBook = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: 'Book not found',
                data: null,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete book',
            error,
        });
    }
}));
exports.default = bookHandler;
