import { useContext, useEffect, useRef, useState } from "react";
import Links, { IURL } from "../component/dashboard/links";
import Token, { IToken } from "../component/dashboard/token";
import Home from "../component/dashboard/home";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Config from "../utils";
import AuthContext from "../context/Auth";
import { Toast } from "primereact/toast";

const Dashboard = () => {
	const UseAuth = useContext(AuthContext);
	const Navigate = useNavigate();
	const { search } = useLocation();
	const query = new URLSearchParams(search);
	const [err, setErr] = useState("");
	const [token, setToken] = useState<IToken | null>(null);
	const [items, setItems] = useState<IURL[]>([]);
	const toast = useRef<Toast>(null);

	const activePage =
		query.get("page") === "home" ||
		query.get("page") === "links" ||
		query.get("page") === "token"
			? query.get("page")
			: "home";

	const [active, setActive] = useState<"home" | "links" | "token">(
		activePage as "home" | "links" | "token"
	);
	const activeStyle = "text-white bg-violet-500";
	const activeStyleMobile = "text-violet-800";

	const FetchToken = async () => {
		const response = await fetch(`${Config.API_URL}/token`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (response.status === 404) return;
		if (response.status === 401) Logout();
		if (!response.ok) {
			const data = await response.json();
			setErr(data.message);
			throw new Error(data ? data.message : "Error fetching your token!");
		}
		const data = await response.json();
		setToken(data.data);
	};

	const FetchLinks = async () => {
		const response = await fetch(`${Config.API_URL}/url`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		});

		if (!response.ok) {
			const data = await response.json();
			if (response.status === 401) Logout();
			setErr(data.message);
			throw new Error(data ? data.message : "Error fetching your urls!");
		}

		const data = await response.json();

		setItems(() =>
			data.data.map((item: IURL) => ({ ...item, isCollapsed: true }))
		);
	};

	const Logout = () => {
		UseAuth?.logout();
		Navigate("/");
	};

	const Refresh = async (button: HTMLButtonElement) => {
		button.disabled = true;
		if (button.classList.contains("pi")) button.classList.add("pi-spin");
		toast.current?.show({
			severity: "info",
			summary: "Refreshing...",
		});
		await FetchLinks();
		await FetchToken();

		button.classList.remove("pi-spin");
		toast.current?.show({
			severity: "success",
			summary: "Success",
			detail: "Successfully refreshed.",
		});

		setTimeout(() => {
			button.disabled = false;
		}, 60000); // 60000 = 1 minute. Enables the button for refreshing 1 minute after the last refresh.
	};

	useEffect(() => {
		if (!UseAuth?.loading && !UseAuth?.user) Navigate("/auth");
		FetchLinks();
		FetchToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [UseAuth?.user]);

	useEffect(() => {
		window.document.title = `Scissor | Dashboard - ${active}`;
	}, [active]);

	return (
		<div className="flex flex-row w-full h-screen">
			<Toast ref={toast} />
			<aside className="w-[230px] hidden bg-white border-r-2 border-gray-100 md:flex flex-col gap-4 pt-12 px-3">
				<Link
					to="/dashboard?page=home"
					onClick={() => setActive("home")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "home" ? activeStyle : "text-black"
					}`}>
					Home
				</Link>
				<Link
					to="/dashboard?page=links"
					onClick={() => setActive("links")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "links" ? activeStyle : "text-black"
					}`}>
					Links
				</Link>
				<Link
					to="/dashboard?page=token"
					onClick={() => setActive("token")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "token" ? activeStyle : "text-black"
					}`}>
					Token
				</Link>

				<button
					onClick={(e) => Refresh(e.currentTarget)}
					className="px-6 py-1.5 bg-violet-600 disabled:bg-gray-500 hover:bg-violet-700 rounded-md font-semibold text-md text-white duration-300 transition-all mt-10">
					Refresh
				</button>
				<button
					onClick={Logout}
					className="px-6 py-1.5 hover:bg-violet-600 bg-white border-2 font-light border-violet-600 rounded-md hover:font-semibold text-md text-black hover:text-white duration-300 transition-all">
					Logout
				</button>
			</aside>
			<aside className="fixed md:hidden bottom-0 left-0 right-0 h-fit py-2 bg-violet-500 flex flex-row justify-between px-4 items-center">
				<div className="flex flex-row gap-6 items-center">
					<Link
						to="/dashboard?page=home"
						onClick={() => setActive("home")}
						className={` rounded-md ${
							active === "home" ? activeStyleMobile : "text-white"
						}`}>
						<i className="pi pi-home text-2xl"></i>
					</Link>
					<Link
						to="/dashboard?page=links"
						onClick={() => setActive("links")}
						className={` ${
							active === "links"
								? activeStyleMobile
								: "text-white"
						}`}>
						<i className="pi pi-paperclip text-xl"></i>
					</Link>
					<Link
						to="/dashboard?page=token"
						onClick={() => setActive("token")}
						className={` ${
							active === "token"
								? activeStyleMobile
								: "text-white"
						}`}>
						<i className="pi pi-key text-xl"></i>
					</Link>
				</div>

				<div className="flex flex-row gap-2">
					<button
						onClick={(e) => Refresh(e.currentTarget)}
						className="">
						<i className="pi pi-refresh text-white"></i>
					</button>
					<button
						onClick={Logout}
						className="px-4 py-1.5 hover:bg-violet-600 font-light rounded-md hover:font-semibold text-md text-black hover:text-white duration-300 transition-all">
						Logout
					</button>
				</div>
			</aside>
			<main className="flex-1 overflow-y-auto mb-[48px]">
				{err && err}
				{active === "home" && (
					<Home items={items} setItems={setItems} />
				)}
				{active === "links" && (
					<Links items={items} setItems={setItems} />
				)}
				{active === "token" && (
					<Token token={token} setToken={setToken} />
				)}
			</main>
		</div>
	);
};

export default Dashboard;
