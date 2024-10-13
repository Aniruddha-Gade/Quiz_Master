

# 🎓 Quiz Master

## 🌟 Overview
Quiz Master is a web application that allows users to create, manage, and take quizzes.<br/>
It supports multiple user roles, including Admin and Student, and <br/>
offers functionalities like quiz creation, submission, and score tracking.

## 🛠 Technology Stack
- **Backend**: Node.js, Express.js 🚀
- **Database**: MongoDB 📦
- **TypeScript**: For type safety and enhanced development experience 📜
- **Caching**: Redis 🧊
- **Authentication**: JSON Web Tokens (JWT) 🔑
- **Other Packages**:
  - bcryptjs (for password hashing) 🔒
  - cookie-parser (for cookie handling) 🍪
  - nodemailer (for email sending) 📧
  - ejs (for templating) 📝
  - dotenv (for environment variable management) 🌱
  - cors (for Cross-Origin Resource Sharing) 🌍



## 📜 API Routes

### 👤 User Routes
- `POST /registration`: Register a new user ✍️
- `POST /activate-user`: Activate user account ✔️
- `POST /login`: User login 🔑

### ❓ Quiz Routes
**Only for Authenticated Students:**
- `GET /get-quiz/:quizId`: Get a single quiz 📖
- `POST /submit-quiz`: Submit a quiz 📤

**Only for Admin:**
- `POST /create-quiz`: Create a new quiz ✍️
- `DELETE /delete-quiz/:quizId`: Delete a quiz 🗑️
- `PUT /update-question/:quizId/:questionIndex`: Update a question in a quiz 🔄
- `DELETE /delete-question/:quizId/:questionIndex`: Delete a question from a quiz 🗑️
- `GET /get-all-quizzes`: Get all quizzes 📜

## ⚙️ Installation
To run this project locally, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/Aniruddha-Gade/Quiz_Master.git
   cd quiz-master
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=4000

   # MongoDB Database URL
   DATABASE_URL=

   # redis url
   REDIS_URL=

   # JWt
   ACTIVATION_SECRET=
   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRE=5
   REFRESH_TOKEN_EXPIRE=3
   
   NODE_ENV=''

   # send mail
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=
   SMTP_SERVICE=
   SMTP_MAIL=
   SMTP_PASSWORD=
   ```
4. Run the application:
   ```bash
   npm run dev
   ```
The application should now be running on `http://localhost:4000`. 🌐
