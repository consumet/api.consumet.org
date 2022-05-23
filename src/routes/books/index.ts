import express from "express";
import libgen from "./libgen";

const router = express.Router();

router.use("/libgen", libgen);

router.get("/", (req, res) => {
	res.status(200).send("Welcome to Consumet Books");
});

export default router;
