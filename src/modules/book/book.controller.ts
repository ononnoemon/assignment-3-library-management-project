import express,{ Request, Response } from 'express';
const bookHandler=express.Router()

import {Book} from './book.model'


// POST  /api/books
bookHandler.post('/books', async (req:Request, res:Response):Promise<void> => {
  try {
    
    const newBook = new Book(req.body)
    await newBook.save()

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Book creation failed',
      error,
    });
  }
});
//Get All Book
bookHandler.get('/books', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = req.query.filter as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sort = req.query.sort === 'asc' ? 1 : -1;
    const limit = parseInt(req.query.limit as string) || 10;

    const query: any = {};
    if (filter) {
      query.genre = filter.toUpperCase();
    }

    const books = await Book.find(query)
      .sort({ [sortBy]: sort })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get books',
      error: error instanceof Error ? error.message : error,
    });
  }
});

//Get book by ID
bookHandler.get('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response): Promise<void> => {
      try {
    const book = await Book.findById(req.params.bookId);

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

  } catch (error) {
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
});

//Update Book by ID

bookHandler.put('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData,
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error,
    });
  }
});

// DELETE /api/books/:bookId
bookHandler.delete('/books/:bookId', async (req: Request<{ bookId: string }>, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;

    const deletedBook = await Book.findByIdAndDelete(bookId);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error,
    });
  }
});


export default bookHandler;
