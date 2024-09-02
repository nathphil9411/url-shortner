import { Dispatch, SetStateAction, useRef, useState } from "react";
import Config from "../../utils";
import { Toast } from "primereact/toast";

const Token = ({
	token,
	setToken,
}: {
	token: IToken | null;
	setToken: Dispatch<SetStateAction<IToken | null>>;
}) => {
	const [visible, setVisibile] = useState<boolean>(true);
	const [tokenVisible, setTokenVisible] = useState<boolean>(false);
	const [err, setErr] = useState("");
	const toast = useRef<Toast>(null);

	const CreateToken = async (button: HTMLButtonElement) => {
		toast.current?.show({
			severity: "info",
			summary: "Creating token...",
		});
		const response = await fetch(`${Config.API_URL}/token`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();
			toast.current?.show({
				severity: "error",
				summary: "Error...",
				detail: data ? data.message : "Error creating your token!",
			});
			setErr(data.message);
			button.disabled = true;
			throw new Error(data ? data.message : "Error creating your token!");
		}

		toast.current?.show({
			severity: "success",
			summary: "Success!",
			detail: "Successfully created token!",
		});
		const data = await response.json();
		setToken(data.data);
	};

	const DeleteToken = async (button: HTMLButtonElement) => {
		toast.current?.show({
			severity: "info",
			summary: "Deleting token...",
		});
		const response = await fetch(`${Config.API_URL}/token`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();
			toast.current?.show({
				severity: "error",
				summary: "Error...",
				detail: data
					? data.message
					: "Error trying to delete your token!",
			});
			setErr(data.message);
			button.disabled = true;
			throw new Error(
				data ? data.message : "Error trying to delete your token!"
			);
		}

		toast.current?.show({
			severity: "success",
			summary: "Success!",
			detail: "Successfully deleted token!",
		});

		setToken(null);
	};

	return (
		<div className="m-8">
			<Toast ref={toast} />
			<header className="flex flex-col gap-1 mb-12">
				<h3 className="font-semibold text-2xl">
					User Token{" "}
					<i
						onClick={() => setVisibile((prev) => !prev)}
						className="pi pi-question-circle cursor-pointer text-gray-400 text-lg ml-2"></i>
				</h3>
				{visible && (
					<p>
						Lorem ipsum dolor sit amet consectetur, adipisicing
						elit. Repellat quam eaque libero ad officiis modi saepe
						unde laboriosam odio perspiciatis sapiente at earum
						neque, similique sint magnam, minus ea temporibus.
					</p>
				)}
			</header>

			{err && err}

			{!token && (
				<button
					onClick={(e) => CreateToken(e.currentTarget)}
					className="px-4 w-fit bg-violet-600 py-2 text-white rounded-lg">
					Create Token
				</button>
			)}
			{token && (
				<div className="max-w-[800px]">
					<div className="border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md rounded-md flex flex-row items-center px-2 overflow-hidden">
						<input
							className="py-2 pl-2 outline-none w-full"
							type={tokenVisible === true ? "text" : "password"}
							name="alias"
							id="alias"
							minLength={5}
							maxLength={8}
							value={
								tokenVisible
									? token.token
									: "why are you peaking :eyes:"
							}
							disabled
						/>
						<span
							className="cursor-pointer"
							onClick={() => setTokenVisible((prev) => !prev)}>
							{tokenVisible && (
								<i className="pi pi-eye-slash"></i>
							)}
							{!tokenVisible && <i className="pi pi-eye"></i>}
						</span>
					</div>
					<button
						onClick={(e) => DeleteToken(e.currentTarget)}
						className="px-4 w-fit bg-red-500 py-2 text-white rounded-lg mt-5">
						Delete Token
					</button>
				</div>
			)}
		</div>
	);
};

export default Token;

export interface IToken {
	token: string;
	expiration_date: Date;
	last_used: Date | undefined;
}
