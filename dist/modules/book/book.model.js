"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.GenreEnum = void 0;
// src/modules/book/book.model.ts
const mongoose_1 = require("mongoose");
var GenreEnum;
(function (GenreEnum) {
    GenreEnum["FICTION"] = "FICTION";
    GenreEnum["NON_FICTION"] = "NON_FICTION";
    GenreEnum["SCIENCE"] = "SCIENCE";
    GenreEnum["HISTORY"] = "HISTORY";
    GenreEnum["BIOGRAPHY"] = "BIOGRAPHY";
    GenreEnum["FANTASY"] = "FANTASY";
})(GenreEnum || (exports.GenreEnum = GenreEnum = {}));
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        enum: Object.values(GenreEnum),
        required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
