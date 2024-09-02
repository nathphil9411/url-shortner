# Scissor - URL Shortening and Analysis Service

Scissor is a URL shortening and insight services that allows users to create shortened links, customize their URLs, and generate QR codes. It also provides basic insight and user management features. This project is a personal project that inspired from my personal struggle of mangement of links.

## Table of Contents

1. [Scissor - URL Shortening and Analysis Service](#scissor---url-shortening-service)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Usage](#usage)
   - [Web Interface](#web-interface)
   - [API](#api)
5. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup](#setup)
6. [Workers and Cron Jobs](#workers-and-cron-jobs)
   - [Workers](#workers)
   - [Cron Jobs](#cron-jobs)
7. [Unique IPs](#unique-ips)
8. [FAQ](#faq)

## Features

- **URL Shortening**: Convert URLs into short, shareable links.
- **Custom URLs**: Create custom shortened URLs.
- **QR Code Generation**: Generate QR codes for shortened URLs.
- **Analytics**: Track link clicks, unique visitors, and geolocation data.
- **User Management**: Register, and login.
- **API Access**: Provides API endpoints for developers to integrate the service using tokens.

## Technologies Used

- **Frontend**: React, and TypeScript
- **Backend**: Node.js, TypeScript, Express, PostgresSQL, Redis, and Cloudinary
- **Deployment**: Vercel

### Usage

##### Web Interface

- Visit the deployed application at [scissor-capstone-project-five.vercel.app](https://scissor-capstone-project-five.vercel.app/)

#### API

- Send requests to the backend at [https://arowobenedict.tech/api](https://arowobenedict.tech/api)
- Visit the deployed documentation at [https://arowobenedict.tech/api/docs](https://arowobenedict.tech/api/docs)
- Vist a shortened url at [https://arowobenedict.tech/:id](https://arowobenedict.tech/google)

## Installation

###### Prerequisites

- Node.js
- npm or yarn
- Postgresql
- [Redis](https://redis.io/)
- [Cloudinary](https://cloudinary.com/)
- Workers server (optional)
- [VirusTotal](https://virustotal.com/gui/home/upload)
- [WeatherAPI](https://weatherapi.com/)
- [Gmail](http://gmail.com)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Benedict-arowo/Scissor---Capstone-Project.git
   ```
2. Navigate into the repository:
   ```bash
   cd Scissor---Capstone-Project
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
4. Create a .env file in the **backend** directory and add your environment variables:
   ```.env
   PORT= 8000
   DATABASE_URL = ""
   WEATHER_API_TOKEN = ""
   CLOUDINARY_API_KEY = ""
   CLOUDINARY_CLOUD_NAME = ""
   CLOUDINARY_API_SECRET = ""
   VIRUSTOTAL_API_KEY = ""
   JWT_SECERET = 'secret'
   REDIS_HOST = ""
   REDIS_PORT = ""
   REDIS_PASSWORD = ""
   USE_WORKER = false # If you want to use a worker. False by default
   GMAIL_USER = ""
   GMAIL_PASS = "" # Use google app password
   ```
5. Edit the **backend** config file to your desired settings:
   ```js
   ROUTE_PREFIX: "api", // The route prefix
   BASE_URL: "http://arowobenedict.tech/", // The base URL of the application. Should be your domain name.
   NODE_ENV: "production",
   PORT: parseInt(process.env.PORT as string) || 5000,
   JWT_SECERET: process.env.JWT_SECERET as string,
   USE_WORKER: (process.env.USE_WORKER as string) === "true" ? true : false,
   REDIS: {
   	HOST: process.env.REDIS_HOST as string,
   	PORT: parseInt(process.env.REDIS_PORT as string),
   	PASSWORD: process.env.REDIS_PASSWORD as string,
   },
   OPTIONS: {
   	SCAN_URLS: true, // Using VirusTotal api to scan urls if urls are malicious or not.
   	UPDATE_USER_IP_INFO: true, // Using WeatherAPI to update the user's IP info, and geolocation data.
   	TOKEN_EXPIRY_DAYS: 7, // The amount of days the token created by users would last for by default
   	TOKEN_LENGTH: 32, // The length of the token
   },
   DB: {
   	HOST: process.env.HOST as string,
   	PORT: parseInt(process.env.PORT as string),
   	USER: process.env.USER as string,
   	PASSWORD: process.env.PASSWORD as string,
   	DATABASE: process.env.DATABASE as string,
   },
   TOKENS: {
   	WEATHER_API: process.env.WEATHER_API_TOKEN as string,
   	CLOUDINARY: {
   		CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
   		API_KEY: process.env.CLOUDINARY_API_KEY as string,
   		API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
   	},
   	VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY as string,
   },
   GMAIL: {
   	USER: process.env.GMAIL_USER as string,
   	PASS: process.env.GMAIL_PASS as string,
   },
   ```
6. Edit the **frontend** utils file:
   ```js
   const Config = {
     API_URL: "https://arowobenedict.tech/api", // Replace with your base URL ending with /api or whatever your route prefix is.
     BASE_URL: "https://arowobenedict.tech" // Replace with your base URL.
   };
   ```
7. Start the development servers:
   ```bash
   # Backend Server
   npm run start:dev
   # Frontend Server
   npm run start:dev
   ```
8. Start a worker (backend service):
   ```bash
   npm run start:worker
   ```
9. Start the cronjob (backend service):
   ```bash
   npm run start:cronjob
   ```

### Workers and Cron Jobs

The backend includes background workers and cron jobs which helps in handling specific tasks, such as cleaning up expired URLs, and tokens, and also help with faster response times by sending the time taking resources for workers to handle.

##### Workers (can be disabled in the .env file)

- User IP Info Worker: Responsible for collecting and storing information about the IP addresses of users interacting with the service. It gathers geolocation data, such as country, city, and region, based on the user's IP.
- URL Scan Worker: Ensures the safety of URLs being shortened by scanning them for potential threats or malicious content.

##### Cron Jobs

- URL Expiry Check: Runs everyday to check for URLs that are about to expire and handles their removal from the database. It ensures that outdated links are automatically cleaned up, and an email is sent to the owners of those urls a day before deletion.
- Token Expiry Check: Runs everyday to check for tokens about to expire and sends email notifications to users whose tokens are about to expire, and eventually deletes those tokens.

### Unique IPs:

###### How We Make Sure Your Clicks Count – Just Once!

When you interact with a link on our platform, we want to ensure that each click is meaningful and unique. But how do we do that? Let me walk you through our process in a way that’s easy to understand, even if you’re not a tech expert.

##### What Are We Checking?

Whenever you click on a link, two things happen:

Your Device’s ID (IP Address): Every device you use to browse the internet has its own unique ID, kind of like your device’s personal fingerprint.
The Link You Click (URL ID): Every link on our platform has its own special ID, too.

##### The Magic Behind the Scenes

Our system runs a check called isUnique every time you click on a link. Here’s what it does:

Looks Back 7 Days: We only consider clicks that happened in the last 7 days. This keeps things fresh and relevant.
Asks a Simple Question: “Has this device clicked on this link in the past week?”
If your device hasn’t clicked on that link recently, your click is considered unique, and it's recorded as a new interaction. If you have clicked it before within the last 7 days, we don’t count it again.

##### Why Does This Matter?

It is to make sure that each person’s interaction is counted fairly, without duplicates. This helps give you accurate insights, whether you’re tracking how many people are clicking on your links or just making sure your content is reaching a wide audience.

### FAQ

- **Why do URLs have expiration dates?**

  - The initial plan was to introduce payment plans, where paying users would be exempt from expiration dates, while free plan users would have expiration dates.

- **Why do Tokens have expiration dates?**
  - Tokens have expiration dates for security purposes. Expiring tokens helps prevent unauthorized access, limits the risk of token reuse, and ensures that users re-authenticate periodically to maintain secure sessions.
