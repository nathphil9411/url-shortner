import { DeleteTokens } from "./token.cronjob";
import { deleteUrls } from "./url.cronjob";

const Run = async () => {
	await deleteUrls();
	await DeleteTokens();
};

Run();
