import { useContext, useEffect, useRef, useState } from "react";
import { findFlagUrlByCountryName } from "country-flags-svg";
import { Dialog } from "primereact/dialog";
import linkedin from "../assets/icons/linkedin.svg";
import github from "../assets/icons/github.svg";
import email from "../assets/icons/email.svg";
import Config from "../utils";
import { Toast } from "primereact/toast";
import AuthContext from "../context/Auth";

// const API_URL = "http://localhost:5000";
function Index() {
  const UserContext = useContext(AuthContext);
  const [data, setData] = useState<IData>({
    longUrl: "",
    shortUrl: "",
    dialogVisible: false,
    url: undefined,
    prevUrl: undefined,
    QRCode: undefined
  });
  const toast = useRef<Toast>(null);

  // const generateQRCode = async (id: string) => {
  // 	const response = await fetch(API_URL + "/api" + id + "/qrcode", {
  // 		method: "POST",
  // 		headers: { "Content-Type": "application/json" },
  // 	});

  // 	if (!response.ok) {
  // 		throw new Error("Could not generate QRCode.");
  // 	}

  // 	setData((prev) => {
  // 		return {
  // 			...prev,
  // 			QRCode: response.data.QRCode,
  // 		};
  // 	});
  // };

  const ShortenURL = async () => {
    const fetchData = await fetch(Config.API_URL + "/url", {
      method: "POST",
      body: JSON.stringify({
        long_url: data.longUrl,
        short_url: data.shortUrl.length === 0 ? undefined : data.shortUrl
      }),
      headers: {
        Authorization: UserContext?.user
          ? `Bearer ${localStorage.getItem("access_token")}`
          : "",
        "Content-Type": "application/json"
      }
    });

    if (!fetchData.ok) {
      const data = await fetchData.json();

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: data
          ? fetchData.status === 422
            ? data.errors[0].message
            : data.message
          : "Failed to shorten URL!"
      });
      throw new Error(data ? data.message : "Failed to authenticate!");
    }

    const response = await fetchData.json();
    const { short_url, long_url } = response.data;

    setData((prev) => ({
      ...prev,
      url: `${Config.BASE_URL}/${short_url}`,
      prevUrl: long_url,
      dialogVisible: true
    }));
  };

  useEffect(() => {
    window.document.title = `Scissor`;
  }, []);

  const countries = [
    "United Kingdom",
    "United States",
    "Nigeria",
    "Canada",
    "France",
    "Germany"
  ];
  const faqs = [
    {
      id: 1,
      question: "What is URL scissor?",
      answer:
        " A tool that condenses long URLs into shorter, more manageable links. It makes lengthy web addresses shorter and easier to share, especially on platforms with character limits, such as social media."
    },
    {
      id: 2,
      question: "How does a URL shortener work?",
      answer:
        "URL shorteners use a process called URL redirection, where a short link redirects users to the original, longer URL. When a user clicks on a shortened link, they're instantly redirected to the intended destination."
    },
    {
      id: 3,
      question: "Are shortened links permanent?",
      answer:
        " Url scissor generally aim for link permanence. However, some services have expiration settings where links may become inactive after a specified period. It's advisable to check the terms and conditions of the service for details on link longevity."
    },
    {
      id: 4,
      question: "Can I edit or delete a shortened link?",
      answer:
        " Url scissor do not allow users to edit or modify a created short link once it's generated. However, some services might offer account-based management where you can delete or deactivate links from your account dashboard."
    },
    {
      id: 5,
      question: "What is a QR code?",
      answer:
        "A QR code, short for Quick Response code, is a two-dimensional barcode that stores information in a machine-readable format. It consists of black squares arranged on a white square grid, typically seen as a square image. QR codes can contain various types of data, such as text, URLs, contact information, or other forms of data."
    },
    {
      id: 6,
      question: "How does a QR code work?",
      answer:
        "QR codes work by encoding information within the pattern of black squares and white spaces. When scanned using a smartphone camera or a QR code scanner app, the encoded data is quickly interpreted and processed, allowing the user to access the embedded information, such as a website link, contact details, or other digital content."
    },
    {
      id: 7,
      question: "Are shortened links safe?",
      answer:
        "Url scissor services prioritize user safety and security, shortened links can pose risks. Users should be cautious when clicking on shortened URLs from unknown or untrusted sources. Some services offer features like link preview to help users identify the destination before clicking."
    },
    {
      id: 8,
      question: "Can I track statistics for shortened links?",
      answer:
        "Yes, url scissor provide analytics and tracking features. Users can view statistics like the number of clicks, geographic location of users, referral sources, and more. This data can be valuable for marketing, campaign tracking, or understanding user behavior."
    },
    {
      id: 9,
      question: "Are there limitations on how many links I can shorten?",
      answer:
        "url scissor Don't have limitations on the number of links users can shorten, you can shorten urls as many as you want."
    }
  ];

  return (
    <div className="h-full bg-white pb-12">
      <Toast ref={toast} />
      <main className="h-full min-h-screen">
        <section className="pt-36 flex flex-col items-center px-4 md:px-0">
          <h1 className="text-2xl md:text-5xl font-bold text-center">
            Conscise and powerful short links
          </h1>
          <p className="font-base mt-4 text-gray-500 text-base md:text-xl text-center">
            ALl your links in one place, stay in control of shortening and
            tracking links.
          </p>

          <div className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15.95 16"
              style={{
                width: "1.4rem",
                height: "1.4rem",
                transform: "rotate(-17deg)",
                right: "2rem",
                top: "2rem",
                filter: "blur(1px)"
              }}
              className="position-absolute"
            >
              <path
                d="M10,.42,8.46,0,7.14,5,5.94.48,4.37.9,5.66,5.73,2.44,2.51,1.29,3.66,4.82,7.19.42,6,0,7.59,4.81,8.87a2.92,2.92,0,0,1-.09-.73,3.26,3.26,0,1,1,6.52,0,3.55,3.55,0,0,1-.08.73L15.52,10,16,8.47l-4.83-1.3L15.52,6,15.1,4.42l-4.83,1.3,3.22-3.23L12.34,1.34,8.86,4.83Z"
                style={{ fill: "#f97316" }}
              ></path>
              <path
                d="M11.15,8.89a3.2,3.2,0,0,1-.81,1.49l3.17,3.17,1.15-1.15Z"
                style={{ fill: "#f97316" }}
              ></path>
              <path
                d="M10.31,10.41a3.3,3.3,0,0,1-1.46.87L10,15.57l1.58-.42Z"
                style={{ fill: "#f97316" }}
              ></path>
              <path
                d="M8.79,11.29a3.1,3.1,0,0,1-.81.1,3.58,3.58,0,0,1-.87-.11L6,15.58,7.53,16Z"
                style={{ fill: "#f97316" }}
              ></path>
              <path
                d="M7.06,11.26a3.18,3.18,0,0,1-1.43-.87L2.45,13.56,3.6,14.71Z"
                style={{ fill: "#f97316" }}
              ></path>
              <path
                d="M5.6,10.36a3.23,3.23,0,0,1-.79-1.48L.43,10.06l.42,1.57Z"
                style={{ fill: "#f97316" }}
              ></path>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              style={{
                width: "1.7rem",
                transform: "rotate(22deg)",
                right: "6rem",
                top: "0",
                filter: "blur(1px)"
              }}
              className="position-absolute"
            >
              <polygon
                points="0 0 50 0 0 50 0 0"
                style={{ fill: "#009cea" }}
              ></polygon>
              <polygon
                points="0 50 50 50 0 100 0 50"
                style={{ fill: "#009cea" }}
              ></polygon>
              <polygon
                points="50 0 100 0 50 50 50 0"
                style={{ fill: "#009cea" }}
              ></polygon>
              <circle
                cx="75"
                cy="75"
                r="25"
                style={{ fill: "#009cea" }}
              ></circle>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 45 45"
              style={{
                width: "1.3rem",
                height: "1.3rem",
                transform: "rotate(-5deg)",
                right: "4.5rem",
                top: "4rem",
                filter: "blur(1px)"
              }}
              className="position-absolute"
            >
              <path
                d="M22.5,11.25A11.25,11.25,0,0,1,11.25,22.5H0V11.25a11.25,11.25,0,0,1,22.5,0Z"
                style={{ fill: "#f5718b" }}
              ></path>
              <path
                d="M22.5,33.75A11.25,11.25,0,0,1,33.75,22.5H45V33.75a11.25,11.25,0,0,1-22.5,0Z"
                style={{ fill: "#f5718b" }}
              ></path>
              <path
                d="M0,33.75A11.25,11.25,0,0,0,11.25,45H22.5V33.75a11.25,11.25,0,0,0-22.5,0Z"
                style={{ fill: "#f5718b" }}
              ></path>
              <path
                d="M45,11.25A11.25,11.25,0,0,0,33.75,0H22.5V11.25a11.25,11.25,0,0,0,22.5,0Z"
                style={{ fill: "#f5718b" }}
              ></path>
            </svg>
          </div>

          <section className="w-full max-w-[600px]">
            <div className="flex flex-row justify-center gap-2 mt-8 w-full px-4 md:px-0">
              <input
                className="py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 max-w-[500px] w-full focus:drop-shadow-md"
                placeholder="http://www.example.com/something?cool=true"
                type="url"
                name="url"
                id="url"
                value={data.longUrl}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    longUrl: e.target.value
                  }))
                }
              />
              <button
                onClick={ShortenURL}
                type="submit"
                className="px-4 md:px-6 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-md font-medium md:font-semibold text-lg text-white duration-300 transition-all"
              >
                Shorten
              </button>
            </div>

            <div className="flex flex-col px-4 md:px-0 md:flex-row justify-between gap-8 mt-6 w-full">
              <fieldset className="flex flex-col gap-1 flex-1">
                <label htmlFor="domain">Domain</label>
                <input
                  className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none focus:border-violet-600 transition duration-300 w-full"
                  type="text"
                  name="domain"
                  id="domain"
                  disabled
                  value={Config.BASE_URL}
                />
              </fieldset>

              <fieldset className="flex flex-col gap-1 flex-1">
                <label htmlFor="alias">Alias (optional)</label>
                <input
                  className="py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md"
                  type="text"
                  name="alias"
                  id="alias"
                  minLength={5}
                  maxLength={8}
                  value={data.shortUrl}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      shortUrl: e.target.value
                    }))
                  }
                />
              </fieldset>
            </div>
          </section>
        </section>

        <section className="mt-64 flex justify-center px-4 md:px-0">
          <section className="flex flex-row flex-wrap justify-center gap-20">
            <div id="about">
              <h3 className="font-bold text-3xl">Link management</h3>
              <p className="text-gray-500 mt-2 text-lg max-w-[450px]">
                Complete link management platform to brand, track and share your
                short links.
              </p>

              <div className="flex flex-row gap-4 mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-14 text-violet-700 px-4 py-4 bg-violet-200 rounded-2xl"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>

                <div>
                  <h4 className="font-semibold text-2xl">Links</h4>
                  <p className="text-gray-500">
                    Shorten and share your links with our advanced set of
                    features.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative">
              <div
                className="absolute top-0 right-0 bottom-0 left-0 bg-violet-600 opacity-10 rounded-2xl"
                style={{
                  transform: "translate(0.8rem, 1rem)"
                }}
              ></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div className="flex flex-row items-center justify-between w-full md:w-[500px] bg-white px-4 py-3 rounded-lg shadow-md cursor-default z-10">
                  <div key={i} className="flex flex-col gap-0">
                    <p className="text-violet-600">{Config.BASE_URL}/b5csx</p>
                    <span className="text-gray-500">
                      Cibsectetur - Adipiscing
                    </span>
                  </div>

                  <div className="flex flex-row gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-violet-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-violet-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="flex flex-row justify-center gap-20 mt-32 bg-gray-100 py-12 flex-wrap-reverse px-4 md:px-0">
          <aside className="flex flex-col gap-4 relative">
            <div
              className="absolute top-0 right-0 bottom-0 left-0 bg-violet-600 opacity-10 rounded-2xl"
              style={{
                transform: "translate(-1rem, 1rem)"
              }}
            ></div>
            {countries.map((country: string) => {
              const num = Math.floor(Math.random() * 100);
              return (
                <div
                  key={country}
                  className="flex flex-row items-center justify-between w-full md:w-[500px] bg-white px-4 py-3 rounded-xl shadow-md cursor-default gap-2 z-10 opacity-[7]"
                >
                  <img
                    src={findFlagUrlByCountryName(country)}
                    alt={country + "'s flag"}
                    width={24}
                    height={24}
                  />
                  <div className="flex flex-col gap-0 w-full">
                    {country}
                    <progress
                      className="h-1.5 rounded-full mt-2 custom_progress w-full "
                      value={num}
                      max={100}
                    ></progress>
                  </div>
                  <p className="self-start">{num}</p>
                </div>
              );
            })}
          </aside>
          <div>
            <h3 className="font-bold text-3xl">Statistics</h3>
            <p className="text-gray-500 mt-2 text-lg max-w-[450px]">
              Get to know your audience with our detailed statistics and better
              understand the performance of your links, while also being GDPR,
              CCPA and PECR compliant.
            </p>

            <div className="mt-8 gap-x-24 gap-y-4 grid grid-cols-1 md:grid-cols-2">
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                  />
                </svg>
                Overview
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
                Devices
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                  />
                </svg>
                Browsers
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
                Countries
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
                Languages
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                  />
                </svg>
                Cities
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
                Referrers
              </p>
              <p className="font-semibold text-lg flex flex-row gap-1 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 rounded-md px-1 py-1 bg-violet-200 text-violet-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                  />
                </svg>
                Platforms
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center mt-12 px-4 md:px-0">
          <h3 id="faq" className="text-3xl pb-8 font-semibold">
            Frequently asked questions
          </h3>
          <section className="grid lg:grid-cols-2 gap-x-8 gap-y-8 grid-cols-1">
            {faqs.map(({ id, question, answer }) => {
              return (
                <article key={id} className="max-w-[500px]">
                  <h4 className="font-semibold text-xl">{question}</h4>
                  <p className="text-gray-500">{answer}</p>
                </article>
              );
            })}
          </section>
        </section>

        <section className="bg-gray-100 mt-12 flex flex-row justify-center gap-4 md:gap-20 py-24 flex-wrap">
          <div className="bg-white px-6 py-6 h-fit drop-shadow-md md:w-[300px]">
            <h3 className="font-bold text-lg md:text-2xl">Total Clicks</h3>
            <span className="text-gray-500">
              {Math.floor(Math.random() * 10000000)}
            </span>
          </div>
          <div className="bg-white px-6 py-6 h-fit drop-shadow-md md:w-[300px]">
            <h3 className="font-bold text-lg md:text-2xl">Total Links</h3>
            <span className="text-gray-500">
              {Math.floor(Math.random() * 1000000)}
            </span>
          </div>
          <div className="bg-white px-6 py-6 h-fit drop-shadow-md md:w-[300px]">
            <h3 className="font-bold text-lg md:text-2xl">Links Today</h3>
            <span className="text-gray-500">
              {Math.floor(Math.random() * 100)}+
            </span>
          </div>
        </section>
      </main>

      <footer
        id="footer"
        className="flex flex-col gap-2 mt-12 items-center w-full px-2 md:px-0"
      >
        <section className="flex flex-row justify-between w-full px-2 md:px-32 lg:px-48">
          <div className="flex gap-4 md:gap-16 flex-row ">
            <a className="text-violet-600" href="#about">
              About
            </a>
            <a className="text-violet-600" href="#faq">
              FAQ
            </a>
            <a className="text-violet-600" href="#footer">
              Contact
            </a>
          </div>
          <div className="flex flex-row gap-6">
            <a href="https://github.com/nathphil9411" target="_blank">
              <img
                className="md:w-[24px] md:h-[24px] w-4 h-4"
                src={github}
                alt="Visit my Github page."
              />
            </a>
            <a
              href="https://www.linkedin.com/in/nathaniel-ezeanaka"
              target="_blank"
            >
              <img
                className="md:w-[24px] md:h-[24px] w-4 h-4"
                src={linkedin}
                alt="Visit my LinkedIn page."
              />
            </a>
            <a href="mailto:ezeanakanath@gmail.com">
              <img
                className="md:w-[24px] md:h-[24px] w-4 h-4"
                src={email}
                alt="Email me."
              />
            </a>
          </div>
        </section>

        <p className="text-gray-500 mt-4 font-light">
          © 2024 <span className="text-violet-400">Url</span>
          <span className="text-violet-500">Scissor</span>. All rights reserved.
        </p>
      </footer>

      <Dialog
        header="Success!"
        visible={data.dialogVisible}
        style={{ width: "50vw" }}
        onHide={() =>
          setData((prev) => ({
            ...prev,
            dialogVisible: !prev.dialogVisible
          }))
        }
      >
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-2xl">
            You may copy the link below and share it to your friends.
          </p>
          <a className="font-semibold text-lg" href={data.url}>
            {data.url}
          </a>
          <p className="text-red-400 mt-2 font-light">
            Previous URL: {data.prevUrl}
          </p>
        </div>
      </Dialog>
    </div>
  );
}

export default Index;

interface IData {
  longUrl: string;
  shortUrl: string;
  dialogVisible: boolean;
  url: undefined | string;
  prevUrl: undefined | string;
  QRCode: undefined | string;
}
