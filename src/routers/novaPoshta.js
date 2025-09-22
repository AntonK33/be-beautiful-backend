import { Router } from "express";
import {getCities, getWarehouses} from "../controllers/novaPoshtaController.js"

 

const router = Router();
router.get("/np/cities", getCities)
router.get("/np/warehouses/:cityRef", getWarehouses)

export default router;