import { Router } from "express";
import {getCities, getWarehouses} from "../controllers/novaPoshtaController.js"

 

const router = Router();
router.get("/cities", getCities)
router.get("/warehouses/:cityRef", getWarehouses)

export default router;