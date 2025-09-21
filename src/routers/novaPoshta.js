import { Router } from "express";
// import { ctrlWrapper } from "../utils/ctrlWrapper.js";
// import dotenv from "dotenv";
// import NovaPoshta from "novaposhta";

// dotenv.config();
import {getCities, getWarehouses} from "../controllers/novaPoshtaController.js"

 

const router = Router();
// const np = new NovaPoshta({ apiKey: process.env.NOVAPOSHTA_KEY });
router.get("/np/cities", getCities)
// router.get("/np/cities", async (req, res) => {
//     try {
//         const data = await np.address.getCities();
//         res.json(data);
//       } catch (err) {
//         res.status(500).json({ error: err.message || "Ошибка API" });
//       }
// })
router.get("/np/warehouses/:cityRef", getWarehouses)

export default router;