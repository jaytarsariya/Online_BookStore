import { Router } from 'express';
const router = Router();
import { createLocation } from '../controller/location.controller';

router.post('/create', createLocation);

export default router;
