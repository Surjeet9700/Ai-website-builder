

# AI Website Builder

An AI-powered website builder that leverages advanced machine learning techniques to generate customizable websites automatically. This project integrates a modern, responsive frontend with a robust backend API that handles AI processing, data storage, and website deployment.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

The AI Website Builder project simplifies the website creation process by taking user inputs and generating complete website layouts and content through AI models. The system consists of two main components:

- A **Frontend** that offers an interactive, user-friendly interface powered by Vite.
- A **Backend** that processes API requests, integrates AI for content generation, and manages database operations.

## Features

- **AI-Driven Design:** Generate website layouts and content based on user inputs.
- **Customizable Templates:** Start with pre-built templates that you can modify.
- **Live Preview:** See updates in real time as you tweak your design.
- **User Authentication:** Secure account management.
- **RESTful API:** A scalable API to connect the frontend with backend services.
- **Scalable Architecture:** Designed to support multiple concurrent users.

## Architecture

The project is divided into two primary parts:

### Frontend

- **Framework & Tooling:** Built using modern JavaScript frameworks (e.g., React, Vue, or Angular) with Vite as the development server.  
- **Port:** By default, Vite serves the frontend on port **5173**.  
- **Features:** Modular components, state management (e.g., Redux or Vuex), client-side routing, and responsive styling (CSS/SCSS, Bootstrap, or Tailwind CSS).

### Backend

- **Server Framework:** Built using Node.js with frameworks like Express.js to manage API endpoints.  
- **Port:** The backend server listens on port **3000**.  
- **AI Integration:** Connects to AI models (e.g., OpenAI’s GPT) to generate website content based on user prompts.  
- **Database:** Uses databases like MongoDB, PostgreSQL, or MySQL for storing user data and generated content.  
- **API Endpoints:** Manages user authentication, website generation, and data updates.

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database system (MongoDB, MySQL, PostgreSQL) installed and configured
- (Optional) Python and its dependencies if parts of the backend use Python

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Surjeet9700/AI-Website-Builder.git
   cd AI-Website-Builder
   ```

2. **Frontend Setup**
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - **Note:** Vite will run the frontend on [http://localhost:5173](http://localhost:5173) by default. To change this port, modify the `server.port` property in your `vite.config.js` file.

3. **Backend Setup**
   - Navigate to the `backend` directory:
     ```bash
     cd ../backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
     
   - Create a `.env` file in the backend directory with necessary configurations:
     ```env
     PORT=3000
     DATABASE_URL=your_database_connection_string
     AI_API_KEY=your_ai_service_api_key
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

4. **Connecting Frontend and Backend**
   - Ensure that the frontend API calls target the backend URL (e.g., `http://localhost:3000`).
   - Adjust any proxy settings or environment variables as needed.

## Usage

With both servers running:

- **Creating a Website:**
  - Open [http://localhost:5173](http://localhost:5173) in your browser.
  - Input your website requirements.
  - The AI processes your input to generate website templates and content.
  
- **Customization & Preview:**
  - Use the built-in editor to modify design elements, text, and images.
  - Preview your changes live before saving or deploying your website.

- **Deployment:**
  - Once satisfied, deploy the website using the integrated deployment features (this may involve exporting the site or pushing it to a hosting provider).

