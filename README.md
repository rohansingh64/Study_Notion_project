📘 StudyNotion – EdTech MERN Application

StudyNotion is a full-stack EdTech platform built using the MERN stack, designed to provide a seamless learning experience for students and instructors. It supports secure authentication, role-based access, course management, and online payments.

🛠 Tech Stack

Frontend

React.js

Redux Toolkit (State Management)

Tailwind CSS

React Router DOM

Backend

Node.js

Express.js

MongoDB & Mongoose

Authentication & Security

JWT Authentication

Cookies for session handling

OTP-based Signup Verification

Payments

Razorpay Integration

✨ Features
👤 Authentication

Secure Login & Signup with OTP verification

JWT-based authentication with protected routes

🎓 Student

Browse and purchase courses

View enrolled courses

Role-based access control

👨‍🏫 Instructor

Create and manage courses

Upload course content

🛡 Admin

Manage users and courses

🔒 Security

Role-based authorization (Admin / Student / Instructor)

Protected APIs and routes




⚙️ Environment Variables

Create a .env file using .env.example:


For frontend ---

REACT_APP_BASE_URL= https://your-backend-app-url-.com/api/v1

REACT_APP_RAZORPAY_KEY = your_razorpay_key




For backend/server


PORT = 4000



DB_URL = your_mongo_db_url

CLOUD_NAME = dsrsdqh96

API_KEY = cloudinary api key

API_SECRET = cloudinary secret key

FOLDER_NAME = "folder name"



JWT_SECRET = "jwt secret"

MAIL_FROM = mail from
MAIL_HOST = mail host
MAIL_PORT = 587
MAIL_USER = mail user
MAIL_PASS = mail pass

RAZORPAY_KEY = your razor pay key
RAZORPAY_SECRET = your razor pay secret







🧪 Installation & Setup
Clone the repository
git clone https://github.com/your-username/study-notion.git

Frontend

npm install
npm start



Backend

cd server
npm install
npm run dev

