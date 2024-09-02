import nodemailer from "nodemailer";
import config from "../../config";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.GMAIL.USER,
		pass: config.GMAIL.PASS,
	},
});

transporter.verify((error, success) => {
	if (error) {
		console.error("Error connecting to the email server:", error);
	} else {
		console.log("Email server is ready to send messages:", success);
	}
});

// Function to send email notifications
export const sendEmailNotifications = async (
	items: { message: string; subject: string; email: string }[]
) => {
	const promises = items.map((item) => {
		const mailOptions = {
			from: config.GMAIL.USER,
			to: item.email,
			subject: item.subject,
			text: item.message,
		};

		return transporter.sendMail(mailOptions);
	});

	try {
		const results = await Promise.all(promises);
		results.forEach((info, index) => {
			console.log(`Email sent to ${items[index].email}:`, info.response);
		});
	} catch (error) {
		console.error("Error sending one or more emails:", error);
	}
};
