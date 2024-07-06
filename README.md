# ChatApp README

## Introduction

Welcome to the ChatApp! This application is a real-time chat platform that allows users to join chat rooms, send messages, and share files. It is built with React, Node.js, and Socket.IO, and uses Cloudinary for image file storage.

## Features

- Real-time messaging
- Emoji support
- Image and file sharing
- User profile editing

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js
- npm (Node package manager)
- Docker (optional, for running MySQL)

## Installation

### Backend Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-repository/chatapp.git
    cd chatapp
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add your Cloudinary credentials:
    ```
    CLOUD_NAME=your_cloudinary_cloud_name
    API_KEY=your_cloudinary_api_key
    API_SECRET=your_cloudinary_api_secret
    ```

4. **Run the server:**
    ```sh
    npm start
    ```

    The server will start on `http://localhost:3001`.

### Frontend Setup

1. **Navigate to the client directory:**
    ```sh
    cd client
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Start the React app:**
    ```sh
    npm start
    ```

    The app will start on `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Enter your username and a chat room ID to join a room.
3. Start chatting with other users in the same room.

