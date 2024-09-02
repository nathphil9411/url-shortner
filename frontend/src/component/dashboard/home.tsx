import { findFlagUrlByCountryName } from "country-flags-svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IURL } from "./links";
import { format } from "timeago.js";
import Config from "../../utils";

const Home = (props: IPROPS) => {
	const { items } = props;
	const [stats, setStats] = useState<{
		clicks: number | undefined;
		countries: undefined | { [key: string]: number };
	}>({
		clicks: undefined,
		countries: undefined,
	});

	const getClicks = () => {
		let clicks = 0;
		const countries: { [key: string]: number } = {};

		items.forEach((item) => {
			item.clicks.forEach((click) => {
				if (click.country) {
					if (countries[click.country]) {
						countries[click.country]++;
					} else {
						countries[click.country] = 1;
					}
				}
				clicks++;
			});
		});
		console.log(countries);
		setStats({ clicks, countries });
	};

	useEffect(() => {
		getClicks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	return (
		<div className="m-8 max-w-full overflow-hidden">
			<header className="w-full flex md:h-[130px] flex-col md:flex-row gap-8 justify-center ">
				<div className="w-full h-full rounded-md bg-violet-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">
						{items.length}
					</p>
					<p className="self-end place-self-end text-5xl font-bold">
						URLS
					</p>
				</div>

				<div className="w-full h-full rounded-md bg-green-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">
						{stats.clicks}
					</p>
					<p className="self-end place-self-end text-5xl font-bold">
						CLICKS
					</p>
				</div>

				<div className="w-full h-full rounded-md bg-yellow-600 flex flex-col justify-between p-4 border border-gray-500 shadow-md">
					<p className="text-6xl font-light text-white">
						{stats.countries && Object.keys(stats.countries).length}
					</p>
					<p className="self-end place-self-end text-5xl font-bold">
						COUNTRIES
					</p>
				</div>
			</header>

			<main className="my-8">
				<section className="w-[500px] mt-4 border border-gray-300 rounded-sm overflow-hidden pb-2 min-h-[200px]">
					<h3 className="w-full bg-violet-500 text-white px-2 py-1 border border-violet-600 rounded-sm mb-2">
						Top Urls
					</h3>
					<ul className="flex flex-col gap-2 px-3">
						{items
							.sort((a, b) => b.clicks.length - a.clicks.length)
							.map((item) => {
								return (
									<li
										key={item.id}
										className="flex flex-row justify-between">
										<a
											href={`${Config.BASE_URL}/${item.short_url}`}
											className="underline">
											/{item.short_url}
										</a>
										<p className="font-light">
											{item.clicks.length} Clicks
										</p>
										<p className="text-gray-400 font-light text-sm">
											{format(item.created_at)}
										</p>
									</li>
								);
							})}{" "}
					</ul>
				</section>

				<section className="w-[500px] mt-4  border border-gray-300 rounded-sm overflow-hidden pb-2 min-h-[150px]">
					<h3 className="w-full bg-violet-500 text-white px-2 py-1 border border-violet-600 rounded-sm mb-2">
						Top Countries
					</h3>
					<ul className="flex flex-col gap-2 px-3">
						{stats.countries &&
							Object.keys(stats.countries)
								.slice(0, 5)
								.map((country) => {
									return (
										<li className="flex flex-row justify-between">
											<div className="flex flex-row gap-2">
												<img
													src={findFlagUrlByCountryName(
														country
													)}
													alt=""
													width={40}
												/>
												<h6 className="capitalize">
													{country}
												</h6>
											</div>
											<p>
												{stats.countries &&
													stats.countries[country]}
											</p>
										</li>
									);
								})}
					</ul>
				</section>
			</main>
		</div>
	);
};

export default Home;

export interface IPROPS {
	items: IURL[];
	setItems: Dispatch<SetStateAction<IURL[]>>;
}
