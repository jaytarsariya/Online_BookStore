import { Router } from 'express';
const router = Router();
import {
  createAuthor,
  getAllAuthor,
  updatePublisher,
  deleteauthor,
} from '../controller/author.controller';

router.post('/create',createAuthor);

router.get('/getall/:search', getAllAuthor);

router.patch('/update', updatePublisher);

router.delete('/delete', deleteauthor);

export default router;
