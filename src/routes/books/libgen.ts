// fix the any type def
const routes = async (fastify: any, options: any) => {
	fastify.get("/", async (request: any, reply: any) => {
		return "Welcome to Consumet Books Libgen";
	});
};

export default routes;
