import { Router } from 'express';
const router = Router();
import {
  createBook,
  getAllBookDetails,
  viewAllbooks,
  updateBook,
  deleteBook,
  searchBooks,
} from '../controller/book.controller';
import { upload } from '../utils/multer';
import { auth, authorizeRole } from '../middleware/auth';

router.post('/create',upload.single('file'), auth,authorizeRole('seller'),createBook);

router.get('/getall', getAllBookDetails);

router.get('/search', searchBooks);

router.get('/viewall', viewAllbooks);

router.patch('/update', auth, authorizeRole('seller'), updateBook);

router.delete('/delete', auth, authorizeRole('seller'), deleteBook);

export default router;
