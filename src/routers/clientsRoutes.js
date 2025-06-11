import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper";
import {
    addClientsController,
    getClientsController,
    updateClientsController,
    deleteClientsController
 } from "../controllers/clientsController";




const clientsRouter = Router();

clientsRouter.post("/", ctrlWrapper(addClientsController));
clientsRouter.get("/", ctrlWrapper(getClientsController));
clientsRouter.patch("/tel", ctrlWrapper(updateClientsController));
clientsRouter.delete("/tel", ctrlWrapper(deleteClientsController));


export default router;