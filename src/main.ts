import express from "express";
import books from "./routes/books";

const PORT = "80";
const app = express();

app.use("/books", books);
app.get("/", (req, res) => {
	res.status(200).send("Welcome to Consumet");
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
