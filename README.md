# CSLab: The Collaborative Coding Lab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**CSLab** is a full-featured, web-based coding laboratory designed for Computer Science students and educators. It offers a unified platform for lessons, assignments, real-time collaboration, and assessments, all within a secure and controlled environment.

**The Problem:**  
In both physical and virtual computer science labs, students and educators often rely on a variety of disconnected tools. Lab computers frequently lack persistent configurations, leading to setup issues and inefficiencies. Many commercial solutions are costly, making them inaccessible to a wider audience.

**The Solution:**  
CSLab creates a modern, robust, and cost-free laboratory experience by integrating essential tools into one platform:
* Completely open-source — no licensing fees required.  
* Educators and lab assistants do not need proprietary software; they can deploy CSLab and configure it to their needs.  
* Seamless integration of features:  
  - **Assignments & Results** via Classroom.  
  - **Collaboration & Groups** for personal or academic projects.  
  - **Coding** with a built-in VS Code environment.  
  - **AI Assistance** using Gemini/ChatGPT.  
* Advanced plagiarism detection tools designed for educators.  
* Students can track their entire academic coding journey and export it as Git repositories or ZIP archives.  
* No more “my code won’t run” or complex environment setup — just start CSLab and begin learning immediately.  

## ✨ Key Features

* **Role-Based Access Control:** Separate interfaces and permissions for Students, Teachers, and Admins.
* **Course Management:** Create and manage lessons, announcements, and assignments.
* **Diverse Assessments:** Supports quizzes, project-based assignments, and automated code grading.
* **Live Codecasting:** A "Lecture Mode" where instructors can code in real-time, and students can follow along visually.
* **Team Workspaces:** Collaborative rooms where multiple students can code simultaneously and view each other's work.
* **Admin Dashboard:** Full control over users, courses, and site-wide settings.

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:**  MongoDB, PostgreSQL, Redis
* **Authentication:**  JWT, OAuth
* **Real-time Communication:**  WebSockets, Socket.IO



## 🚀 Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm / yarn
* [Your Database] installed and running.
* Docker (for code execution sandbox)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/2024ashikul/uniCodeEditor.git
    cd uniCodeEditor
    ```

2.  **Install backend dependencies:**
    ```sh
    cd server
    npm install
    ```

3.  **Install frontend dependencies:**
    ```sh
    cd client
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the necessary configuration (database connection string, JWT secret, etc.).
    ```
    DB_HOST=your_database_host
    DB_PORT=your_db_port
    DB_USER=database_user_name
    DB_PASSWORD=database_password
    DB_NAME=
    DB_DIALECT=database_dialect
    GEMINI_API_KEY = gemini_api_key_for_ai_features
    SECRET = your_jwt_secret
    REFRESH_SECRET = your_jwt_refresh_secret
    NODE_ENV = 'development' 
    ```

    Create a `.env` file in the `frontend` directory and add the necessary configuration (database connection string, JWT secret, etc.).
    ```
    VITE_API_URL=your_backend_uri
    VITE_STATIC_URL=your_static_files_url
    ```

5.  **Run the application:**
    ```sh
    # From the frontend directory
    npm run dev
    ```

    ```sh
    # From the backend directory
    node server.js
    ```

## 📈 Roadmap

We have an extensive roadmap to make this the best open-source coding lab available. Key future features include Docker sandboxing, support for OS and Networking labs, and advanced auto-grading.

See the full roadmap and find out how you can help in our [**CONTRIBUTING.md**](CONTRIBUTING.md).

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our [**CONTRIBUTING.md**](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## 📄 License

This project is licensed under the MIT License - see the [**LICENSE**](LICENSE) file for details.

