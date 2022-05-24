import libgen from "./libgen";

// fix the any type def
const routes = async (fastify: any, options: any) => {
	fastify.reigster(libgen, { prefix: "libgen" });
	fastify.get("/", async (request: any, reply: any) => {
		return "Welcome to Consumet Books";
	});
};

export default routes;
