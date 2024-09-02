import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Config from "../utils";
import { Toast } from "primereact/toast";
import AuthContext from "../context/Auth";

const Auth = () => {
	const UseAuth = useContext(AuthContext);
	const toast = useRef<Toast>(null);
	const { search } = useLocation();
	const Navigate = useNavigate();
	const query = new URLSearchParams(search);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [mode, setMode] = useState<"login" | "signup">(
		query.get("mode") === "login" ? "login" : "signup"
	);
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});

	const Authenticate = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		UseAuth?.logout();

		toast.current?.show({
			severity: "info",
			summary: mode === "login" ? "Logging in..." : "Registering...",
		});

		if (!credentials.email || !credentials.password) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Please fill in all the fields!",
			});
			throw new Error("Please fill in all the fields!");
		}

		const response = await fetch(
			`${Config.API_URL}/auth/${mode === "login" ? "login" : "register"}`,
			{
				body: JSON.stringify(credentials),
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await response.json();
		if (!response.ok) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: data ? data.message : "Failed to authenticate!",
			});
			throw new Error(data ? data.message : "Failed to authenticate!");
		}

		if (mode === "signup") {
			toast.current?.show({
				severity: "success",
				summary: "Success",
				detail: "Successful registration!",
			});
			// Display signup successfull
			return setMode("login");
		}

		toast.current?.show({
			severity: "success",
			summary: "Success",
			detail: "Successfully logged you in!",
		});

		UseAuth?.login({
			token: data.data.access_token,
		});
		setTimeout(() => {
			Navigate("/dashboard");
		}, 1000);
	};

	useEffect(() => {
		if (UseAuth?.user) Navigate("/dashboard");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [UseAuth?.user]);

	useEffect(() => {
		window.document.title = `Scissor | ${mode.toUpperCase()}`;
	}, [mode]);

	return (
		<div className="grid place-content-center">
			<Toast ref={toast} />
			<header className="mt-12 mx-auto">
				<h2 className="w-full text-center font-medium text-5xl text-violet-600">
					{mode === "login" ? "Login" : "Sign Up"}
				</h2>
				<p className="text-gray-600 w-full text-center font-light mt-1">
					{mode === "login"
						? "Enter your details to be logged into your account!"
						: "Enter your details below to create a new account!"}
				</p>
			</header>

			<form
				onSubmit={Authenticate}
				className="mt-16 flex flex-col items-center gap-4 w-full px-4 md:px-0 md:min-w-[400px]">
				<fieldset className="w-full flex flex-col">
					<label htmlFor="email" className="text-sm font-medium">
						Email:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-user"></i>
						<input
							className="py-3 border-none outline-none w-full"
							placeholder="johndoe@example.com"
							type="email"
							name="email"
							id="email"
							value={credentials.email}
							onChange={(e) =>
								setCredentials((prev) => ({
									...prev,
									email: e.target.value,
								}))
							}
						/>
					</div>
				</fieldset>

				<fieldset className="w-full flex flex-col">
					<label htmlFor="password" className="text-sm font-medium">
						Password:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-key"></i>
						<input
							className="py-3 border-none outline-none w-full"
							placeholder="*********"
							type="password"
							name="password"
							id="password"
							value={credentials.password}
							onChange={(e) =>
								setCredentials((prev) => ({
									...prev,
									password: e.target.value,
								}))
							}
						/>
					</div>
				</fieldset>

				<button
					type="submit"
					className="w-full bg-violet-600 text-white py-2 font-medium rounded-md hover:bg-violet-400 transition-all duration-300 hover:border-violet-500 border border-violet-600">
					{mode === "login" ? "Log In" : "Register"}
				</button>
				<p className="text-gray-400 text-sm">
					Don't have an account?{" "}
					{mode === "login" ? (
						<Link
							to="/auth?mode=register"
							className="text-violet-600 underline hover:text-violet-400"
							onClick={() => setMode("signup")}>
							Signup now
						</Link>
					) : (
						<Link
							className="text-violet-600 underline hover:text-violet-400"
							onClick={() => setMode("login")}
							to="/auth?mode=login">
							Login now
						</Link>
					)}
				</p>
			</form>
		</div>
	);
};

export default Auth;
