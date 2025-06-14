import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    addClientsController,
    // getClientsController,
    // updateClientsController,
    deleteClientsController
 } from "../controllers/clientsController.js";




const router = Router();

router.post("/", ctrlWrapper(addClientsController));
//router.get("/", ctrlWrapper(getClientsController));
//router.patch("/tel", ctrlWrapper(updateClientsController));
router.delete("/tel", ctrlWrapper(deleteClientsController));


export default router;