# # Full Stack Web Development Project - REST API & React Client

This repository contains a full stack web development project that simulates the popular **jsonplaceholder** service. The project includes:

* A fully functional **REST API** built with **Node.js**, **Express**, and **MySQL**.
* A **React** frontend client with user authentication, personal dashboards, and interaction with the backend data.

---

## 📂 Project Structure

```
/backend      --> Node.js + Express + MySQL REST API
/frontend     --> React Application (Client)
```

---

## ⚙️ Technologies Used

* **Backend:** Node.js, Express, MySQL 
* **Frontend:** React, React Router, Axios
* **Tools:** Postman, ESLint

---

## 🔗 Live Demo

🚧 *Coming soon* (You can deploy with Heroku/Render/Netlify/GitHub Pages)

---

## 🎯 Backend - REST API Features

* Database schema: `users`, `posts`, `todos`, `comments`, including `users + passwords`.
* CRUD Operations for:

  * **Users:** Create, Read, Update, Delete
  * **Todos:** Add, update, delete, complete tasks
  * **Posts & Comments:** CRUD on posts and their comments
* Advanced:

  * Albums & Photos APIs
  * Filtering via URL params
  * Admin endpoints for managing users
* Authentication:

  * User registration & login
  * Passwords hashed & stored securely

### ✅ API Endpoints

| Method | Endpoint                                    | Description       |
| ------ | ------------------------------------------- | ----------------- |
| GET    | /users                                      | Get all users     |
| POST   | /users/register                             | Register new user |
| POST   | /users/login                                | Login user        |
| CRUD   | /posts, /comments, /todos, /albums, /photos | Full CRUD support |

---

## 🎮 Frontend - React Features

* **Login / Register pages**
* **User Dashboard:** Display personal info, todos, posts
* **Todos Management:** Add, edit, delete, mark as done
* **Posts & Comments:** View & manage posts with comments
* **Personalized routes:** Example - `/users/username/posts`
* **Logout functionality**
* Info display for logged-in user


---

## ✅ Status

✔️ The project is **complete** and includes all base requirements and advanced features.

---

## 🛠️ How to Run Locally

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm start
```

---


## 📌 Notes

* The backend mimics the behavior of `jsonplaceholder.typicode.com` but with full database persistence.
* You can test the API with Postman for all endpoints.

---

Thank you for checking out this repository! 🎉
