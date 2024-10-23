# Google Keep Clone Backend

This is the backend API for a Google Keep-like application, built using Express.js, SQLite, JWT authentication, and bcrypt for password hashing.

## Features

- **User Authentication**: Users can sign up and log in using a username and password.
- **JWT Authentication**: Secured APIs using JWT for authorized access.
- **Notes Management**: 
  - Add, edit, delete, archive, and retrieve notes.
  - Manage notes' states (e.g., pinned, archived, deleted).
- **Trash and Recovery**: Restore deleted notes from the trash or permanently delete them.

## Technologies Used

- **Node.js** and **Express.js**: Backend framework.
- **SQLite**: Database used to store user and notes data.
- **JWT**: JSON Web Token for authentication.
- **bcrypt**: For secure password hashing.
- **UUID**: For generating unique IDs.
- **CORS**: Enable Cross-Origin Resource Sharing.
  
## Prerequisites

Make sure you have the following installed:

- **Node.js**: v14+ 
- **npm**: v6+
- **SQLite3**

## Setup Instructions

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/google-keep-clone-backend.git
    ```

2. Navigate into the project directory:
    ```bash
    cd google-keep-clone-backend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create the SQLite database:
    - The project uses a file-based SQLite database `googleKeep.db`. Make sure it's located at the correct path specified in the code.

5. Run the server:
    ```bash
    npm start
    ```
    The server will start running on `http://localhost:3000` or the port specified in the environment variables.

## API Endpoints

### User Authentication

- **Sign Up**: `POST /sign-up/`
    - Request body:
        ```json
        {
          "username": "your_username",
          "email": "your_email@example.com",
          "password": "your_password"
        }
        ```
    - Response:
        - 200: `User Created Successfully`
        - 400: `User already Exists`

- **Login**: `POST /login/`
    - Request body:
        ```json
        {
          "username": "your_username",
          "password": "your_password"
        }
        ```
    - Response:
        - 200: `{ jwtToken: "your_jwt_token" }`
        - 400: `User Not Found` or `Invalid Password`

### Notes Management (Authenticated Routes)

- **Get Notes**: `GET /notes/`
    - Headers: `Authorization: Bearer <jwt_token>`
    - Response: Returns all the user's active notes.

- **Create Note**: `POST /notes/`
    - Headers: `Authorization: Bearer <jwt_token>`
    - Request body:
        ```json
        {
          "title": "Note Title",
          "content": "Note Content",
          "color": "#FFFFFF"
        }
        ```
    - Response: `Note Added Successfully`

- **Update Note**: `PUT /notes/`
    - Headers: `Authorization: Bearer <jwt_token>`
    - Request body:
        ```json
        {
          "noteId": "note_id",
          "title": "Updated Title",
          "content": "Updated Content",
          "color": "#FFFFFF",
          "is_pinned": 1,
          "is_archived": 0,
          "is_deleted": 0
        }
        ```
    - Response: `Note updated Successfully...`

- **Delete Note**: `DELETE /trash/`
    - Headers: `Authorization: Bearer <jwt_token>`
    - Request body:
        ```json
        {
          "noteId": "note_id"
        }
        ```
    - Response: `Note Deleted Successfully`

- **Get Archived Notes**: `GET /archieve/`
    - Headers: `Authorization: Bearer <jwt_token>`
    - Response: Returns all archived notes for the user.

## Database Schema

### `users` Table

- `user_id`: Unique identifier (UUID)
- `username`: Username for login
- `email`: User's email
- `password`: Hashed password

### `notes` Table

- `note_id`: Unique identifier (UUID)
- `user_id`: Associated user's ID (foreign key)
- `title`: Note's title
- `content`: Note's content
- `color`: Note's background color
- `is_pinned`: Whether the note is pinned (0 or 1)
- `is_archived`: Whether the note is archived (0 or 1)
- `is_deleted`: Whether the note is deleted (0 or 1)
- `created_at`: Timestamp of note creation
- `updated_at`: Timestamp of last update


