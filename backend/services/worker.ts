import Queue from "bull";
import urlService from "./url.service";
import config from "../config";

const myQueue = new Queue("main", {
	redis: {
		host: config.REDIS.HOST,
		port: config.REDIS.PORT,
		password: config.REDIS.PASSWORD,
	},
});

myQueue.process(async (job: any) => {
	const { type, data } = job.data;
	console.log(`Processing job ${type} with data:`, data);

	try {
		if (type.toUpperCase() === "IP_INFO") {
			await urlService.updateUserIpInfo(data.ip, data.id);
		}

		if (type.toUpperCase() === "SCAN_URL") {
			await urlService.updateUrlInfo(data.long_url, data.id);
		}
	} catch (error) {
		console.log(error);
	}

	console.log("Task completed", type, data);
	return 0;
});

console.log("Worker is active");
