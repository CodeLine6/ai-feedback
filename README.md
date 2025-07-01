# AI Feedback App

A full-stack application that allows users to submit feedback and receive AI-powered analysis.

## Features

*   User registration and authentication (JWT-based)
*   AI-powered feedback analysis using the OpenAI API
*   Secure backend with validation and rate limiting
*   Modern frontend built with React and Tailwind CSS

## Tech Stack

### Frontend (Client)

*   **Framework:** [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** React Hooks
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation
*   **HTTP Client:** [Axios](https://axios-http.com/)

### Backend (Server)

*   **Framework:** [Express.js](https://expressjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
*   **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/)
*   **API:** [OpenAI API](https://beta.openai.com/docs/)
*   **Validation:** [Joi](https://joi.dev/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v14 or later)
*   [npm](https://www.npmjs.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-feedback-app.git
    cd ai-feedback-app
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Environment Variables

You will need to create `.env` files for both the `client` and `server` directories. You can use the provided `.env.example` files as a template.

**Server (`server/.env`):**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/feedback-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key-here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Server Port
PORT=5000
```

**Client (`client/.env`):**

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the frontend development server:**
    ```bash
    cd client
    npm run dev
    ```
    The client will start on `http://localhost:5173`.

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.
