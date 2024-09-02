import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import streamifier from "streamifier";

cloudinary.config({
	cloud_name: config.TOKENS.CLOUDINARY.CLOUD_NAME,
	api_key: config.TOKENS.CLOUDINARY.API_KEY,
	api_secret: config.TOKENS.CLOUDINARY.API_SECRET,
});

export const upload = async ({ file, opts }: IUpload) => {
	const { path, format } = opts;

	// If the file is a buffer, convert it to a stream
	const bufferStream = streamifier.createReadStream(file);

	const data = await new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "/scissor" + path,
				use_filename: false,
				unique_filename: true,
				overwrite: false,
				format,
				public_id: `${new Date().getTime()}`,
			},
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			}
		);

		bufferStream.pipe(uploadStream);
	});

	return data as any;
};

export default cloudinary;

interface IUpload {
	file: any;
	opts: {
		path: string;
		format: string;
	};
}
