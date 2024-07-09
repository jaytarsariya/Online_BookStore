import { Router } from 'express';
const router = Router();
import {
  createPublisher,
  getAllPublisher,
  updatePublisher,
  deletePublisher,
} from '../controller/publisher.controller';

router.post('/create', createPublisher);

router.get('/getall/:search', getAllPublisher);

router.patch('/update', updatePublisher);

router.delete('/delete', deletePublisher);

export default router;
