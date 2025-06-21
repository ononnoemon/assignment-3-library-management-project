import express, { Request, Response } from 'express';
import { Borrow } from './borrow.model';
import { Book } from '../book/book.model';

const borrowHandler = express.Router();

// Borrow a Book
borrowHandler.post('/borrow', async (req: Request, res: Response): Promise<void> => {
  try {
    const { book, quantity, dueDate } = req.body;

   const borrowRecord = new Borrow({ book, quantity, dueDate })
   await borrowRecord.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Borrowing failed',
      error: error instanceof Error ? error.message : error,
    });
  }
});

//Borrowed Books Summary
borrowHandler.get('/borrow', async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo',
        },
      },
      { $unwind: '$bookInfo' },
      {
        $project: {
          book: {
            title: '$bookInfo.title',
            isbn: '$bookInfo.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get summary',
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default borrowHandler;
