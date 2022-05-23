import express from "express";

const PORT = "80";
const app = express();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
