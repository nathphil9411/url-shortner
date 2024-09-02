import { sendEmailNotifications } from ".";
import config from "../../config";
import { URL } from "../../prisma/db";
import cron from "node-cron";

export const GetDeletableURLS = async () => {
	const today = new Date();
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	today.setHours(0, 0, 0, 0); // Set hours to 00:00:00:000 for precise date comparison

	const urls = await URL.findMany({
		where: {
			expiration_date: {
				gte: tomorrow, // Greater than or equal to tomorrow's date
				lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // Less than the day after tomorrow date.
			},
		},
	});

	return urls;
};

export const DeleteURL = async () => {
	const urls = await URL.findMany({
		where: {
			expiration_date: {
				gte: new Date(new Date().setHours(0, 0, 0)),
				lte: new Date(new Date().setHours(23, 59, 59, 999)),
			},
		},
	});

	console.log("Attempting to delete", urls.length, "urls.");

	if (urls.length > 0) {
		await URL.deleteMany({
			where: {
				expiration_date: {
					gte: new Date(new Date().setHours(0, 0, 0)),
					lte: new Date(new Date().setHours(23, 59, 59, 999)),
				},
			},
		});
		console.log("Deletion successful.");
	}
};

export const deleteUrls = async () => {
	try {
		const urls = await GetDeletableURLS();
		console.log(urls);
		console.log("Successfully fetched deletable urls.");

		if (urls.length === 0) return;

		sendEmailNotifications(
			urls
				.filter((url) => url.owner_id) // Only tokens with a valid user_id
				.map((url) => ({
					email: url.owner_id as string,
					message: `Dear User, \nYour shortened url with the ID ${url.short_url} is about to be deleted.\n${config.BASE_URL}/${url.short_url} \n\nRegards,\nThe Admin Team`,
					subject: "URL Deletion Notice",
				}))
		);
		// Schedule the deletion of tokens at 23:00
		const deletionCron = cron.schedule(
			"0 23 * * *",
			async () => {
				try {
					await DeleteURL();
					console.log("Successfully deleted urls.");
				} catch (error) {
					console.error("Error deleting tokens:", error);
				}
			},
			{
				scheduled: false, // Ensures this cron job is not automatically scheduled
			}
		);

		deletionCron.start();
	} catch (error) {
		console.error("Error trying to delete expired urls:", error);
	}
};
