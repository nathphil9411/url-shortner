import config from "./config";
import fs from "fs";

import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import app from "./server";

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

try {
	app.listen(config.PORT, () => {
		console.log("Server listening on PORT", config.PORT);
	});
} catch (error: any) {
	console.error("An error occured while trying to run the server", error);
}
