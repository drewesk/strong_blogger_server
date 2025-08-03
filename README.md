// add more routes and update me when done

# Strong Blogger Server

This is the backend server for **Strong Blogger**, a modern blogging platform built with robust authentication, secure session handling, and scalable database integration.

## 🚀 Tech Stack

- **Node.js** with **Express.js** – Core server framework
- **MongoDB Atlas** – Cloud-hosted NoSQL database
- **Mongoose** – ODM for MongoDB
- **Passport.js** – OAuth authentication (Google & GitHub strategies implemented)
- **express-session** – Session handling with cookie support
- **CORS** – Cross-origin support for frontend/backend integration
- **dotenv** – Secure environment variable management

## 🔐 Features

- Google OAuth & GitHub OAuth login via Passport.js
- Session persistence using `express-session`
- MongoDB user storage and retrieval
- Cookie handling for user sessions with `connect.sid`
- Secure environment setup using `.env` files
- CORS configured for local development (`localhost:5173`)
- Modular strategy management (via `./strategies` directory)

## 📁 Project Structure

```
strong-blogger-server/
├── strategies/             # Passport strategies (Google, GitHub)
├── models/                 # Mongoose user models
├── routes/                 # Auth and API routes
├── .env                    # Environment config (not committed)
├── server.js / app.js      # Main Express app
└── package.json
```

## 🛠️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/strong-blogger-server.git
   cd strong-blogger-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file:

   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=your_secure_session_secret
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the server**
   ```bash
   npm run dev
   # or
   node server.js
   ```

## 🔄 API Endpoints

- `GET /auth/google` – Trigger Google OAuth login
- `GET /auth/google/callback` – Google OAuth callback
- `GET /auth/github` – Trigger GitHub OAuth login
- `GET /auth/github/callback` – GitHub OAuth callback
- `GET /logout` – Log the user out
- `GET /me` – Return session user info  
  // More to come for blog posts

## 🧪 Testing (Coming Soon)

Planned integration with **Mocha** and **Chai** for backend testing.

## 💡 Notes

- CORS is configured for development to accept requests from `http://localhost:5173`.
- In production, adjust session cookie settings and CORS origin appropriately.
- Make sure to whitelist redirect URIs in your Google and GitHub app dashboards.

---

Built with ❤️ by Drew (Andrew Eskenazi)
