import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    addClientsController,
     getAllClientsController,
    getClientsByTelController,
    deleteClientsController
 } from "../controllers/clientsController.js";




const router = Router();

router.post("/", ctrlWrapper(addClientsController));
router.get("/", ctrlWrapper(getAllClientsController));
router.get("/:phoneNumber", ctrlWrapper(getClientsByTelController));
router.delete("/:phoneNumber", ctrlWrapper(deleteClientsController));


export default router;