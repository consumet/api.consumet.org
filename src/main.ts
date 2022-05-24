import Fastify from "fastify";
import books from "./routes/books";

const PORT = 8081;
const fastify = Fastify({
	logger: true,
});

fastify.register(
	(instance, opts, next) => {
		instance.get("/", (req, res) => {
			res.status(200).send("welcome");
		});
		next();
	},
	{ prefix: "/" }
);

fastify.listen(PORT, (_, address) => console.log(`server listening on ${address}`));
