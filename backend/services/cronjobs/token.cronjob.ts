import { sendEmailNotifications } from ".";
import cron from "node-cron";
import { Token } from "../../prisma/db";

/**
 * Deletes tokens based on the provided array of IDs.
 */
export const DeleteTokens = async () => {
	const tokens = await Token.findMany({
		where: {
			expiration_date: {
				gte: new Date(new Date().setHours(0, 0, 0)),
				lte: new Date(new Date().setHours(23, 59, 59, 999)),
			},
		},
	});

	console.log("Attempting to delete", tokens.length, "tokens.");

	if (tokens.length > 0) {
		await Token.deleteMany({
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

/**
 * Retrieves the list of deletable tokens.
 * Tokens are considered deletable if their expiration date is greater than or equal to tomorrow's date
 * and less than the day after tomorrow's date.
 *
 * @returns {Promise<Token[]>} The list of deletable tokens.
 */

export const GetDeletableTokens = async () => {
	const today = new Date();
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	today.setHours(0, 0, 0, 0); // Set hours to 00:00:00:000 for precise date comparison

	const tokens = await Token.findMany({
		where: {
			expiration_date: {
				gte: tomorrow, // Greater than or equal to tomorrow's date
				lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000), // Less than the day after tomorrow date.
			},
		},
	});

	return tokens;
};

const deleteTokens = async () => {
	try {
		const tokens = await GetDeletableTokens();
		// Optionally, send emails or perform other actions here
		console.log(tokens);
		console.log("Successfully fetched deletable tokens.");

		if (tokens.length === 0) return;

		sendEmailNotifications(
			tokens
				.filter((token) => token.user_id) // Only tokens with a valid user_id
				.map((token) => ({
					email: token.user_id as string,
					message: `Dear User, \nYour token with the ID ${token.token} is about to be deleted. \n\nRegards,\nThe Admin Team`,
					subject: "Token Deletion Notice",
				}))
		);
		// Schedule the deletion of tokens at 23:00
		const deletionCron = cron.schedule(
			"0 23 * * *",
			async () => {
				try {
					await DeleteTokens();
					console.log("Successfully deleted tokens.");
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
		console.error("Error fetching deletable tokens:", error);
	}
};
