import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    addClientsController,
     getAllClientsController,
    getClientsByTelController,
    deleteClientsController
 } from "../controllers/clientsController.js";




const clientsRouter = Router();

clientsRouter.post("/", ctrlWrapper(addClientsController));
clientsRouter.get("/", ctrlWrapper(getAllClientsController));
clientsRouter.get("/:phoneNumber", ctrlWrapper(getClientsByTelController));
clientsRouter.delete("/:phoneNumber", ctrlWrapper(deleteClientsController));


export default clientsRouter;