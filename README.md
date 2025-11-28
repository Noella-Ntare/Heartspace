📄 HeArtSpace — Frontend Documentation
1. Introduction

HeArtSpace is a digital wellness platform designed to support emotional healing through artistic expression, interactive programs, and community engagement.
This repository contains the client-side codebase, responsible for the user interface, user interaction flows, and communication with the backend API.

The frontend was developed following a mobile-first design strategy, ensuring accessibility and usability across different screen sizes.

2. Project Objectives

The frontend of HeArtSpace aims to:

Provide a simple, welcoming user experience for individuals looking to explore healing programs.

Allow users to browse, read, join programs, and track emotional growth.

Enable user account management (sign-in/sign-up).

Display content retrieved from the backend API in structured components.

Support community engagement (view posts, like, comment) and art exploration features.

3. System Architecture (Frontend Perspective)

The frontend is a client-side single page application (SPA).
It communicates with the backend REST API through secured HTTP requests.

Core Elements:

UI rendering: HTML + CSS

Business logic: ES6 JavaScript

API calls: Fetch API

Authentication: JWT stored locally

The system follows the separation of concerns principle:

/src/views — Rendering templates & pages

/src/services — API handlers

/src/styles — CSS stylesheets / components

4. Technology Stack
Layer	Technology
Structure	HTML5
Styling	CSS3, modular styles
Logic	JavaScript ES6
Routing	Client-side route handling
State	localStorage

This approach ensures low overhead and wide device compatibility.

5. Key Functional Features

User Authentication

Sign in / Sign up UI flow

Token stored in browser storage

User Dashboard

Personalized screen with available programs, insights, and progress

Healing Programs

Readable modules

Enrollment actions

Art Gallery

Browse artworks

Like/comment interactions (retrieved via API)

Profile Management

Edit name, location, biography

Responsive Layout

Works on mobile, tablet, and desktop

6. Installation and Local Setup
6.1 Prerequisites

Node.js version ≥ 16

Modern browser (Chrome, Firefox, Safari, Edge)

6.2 Installation Steps

Clone repository

git clone https://github.com/your-frontend-repo.git
cd your-frontend-repo


Install dependencies

npm install


Configure environment variables
Create a .env (or config.js depending on architecture):

API_URL=http://localhost:5000/api


Launch development environment

npm run dev

7. Deployment Considerations

The frontend can be deployed using:

Netlify

Vercel

GitHub Pages (static hosting)

Requirements:

Update API_URL in production environment

Ensure CORS permissions on backend

8. Known Limitations

Offline mode not implemented

No native mobile app

Browser localStorage JWT can be vulnerable if abused (secure hosting recommended)

9. Future Improvements

Add automated tests

Implement accessibility standards (WCAG)

Offline caching via Service Workers
