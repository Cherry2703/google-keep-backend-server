const express = require('express');
const app = express();
const port = process.env.PORT || 3009;
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, './google-keep-database.db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`server is running at ${port}`);
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Middleware to check if the user exists in the database
const checkUserExistsOrNot = async (username) => {
  try {
    const query = `SELECT * FROM users WHERE username='${username}';`;
    const userExistsResult = await db.get(query);
    return userExistsResult;
  } catch (error) {
    throw new Error('Database error');
  }
};

// Sign-up path for new users
app.post('/sign-up/', async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const userResult = await checkUserExistsOrNot(username);

    if (userResult === undefined) {
      const newUserId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO users(user_id, username, email, password)
                     VALUES('${newUserId}', '${username}', '${email}', '${hashedPassword}');`;
      await db.run(query);
      response.send({ message: 'User Created Successfully' });
    } else {
      response.status(400).send({ message: 'User already Exists' });
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Login path for user login
app.post('/login/', async (request, response) => {
  try {
    const { username, password } = request.body;
    const userResult = await checkUserExistsOrNot(username);

    if (userResult === undefined) {
      response.status(400).send({ message: 'User Not Found' });
    } else {
      const isValidPassword = await bcrypt.compare(password, userResult.password);
      if (isValidPassword) {
        const payload = { username };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'mySecretKey');
        response.send({ jwtToken });
      } else {
        response.status(400).send({ message: 'Invalid Password' });
      }
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Middleware to authenticate JWT tokens
const authenticateJwtToken = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Unauthorized Access: Token not provided' });
  }
  const jwtToken = authHeader.split(' ')[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET || 'defaultSecretKey', (error, payload) => {
    if (error) {
      return response.status(401).json({ message: 'Unauthorized Access: Invalid token' });
    }
    request.username = payload.username;
    next();
  });
};





// // get method 
app.get('/',(request,response)=>{
    response.send(`Google Keep Clone Backend       

This is the backend API for a Google Keep-like application, built using Express.js, SQLite, JWT authentication, and bcrypt for password hashing.
    **User Authentication**: Users can sign up and log in using a username and password.
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
  






Go FOR GIT HUB LINK AND READ THE README FILE FOR THE COMPLETE INFORMATION....... THANK YOU.....


git hub URL:::==>   https://github.com/Cherry2703/google-keep-backend-server

`)
})


// Fetch all notes for a user
app.get('/notes/', authenticateJwtToken, async (request, response) => {
  try {
    const { username } = request;
    const userDetails = await checkUserExistsOrNot(username);
    const allNotes = `SELECT * FROM notes WHERE user_id='${userDetails.user_id}' AND is_deleted=0 AND is_archived=0;`;
    const notes = await db.all(allNotes);
    response.send(notes);
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Add a new note based on user
app.post('/notes/', authenticateJwtToken, async (request, response) => {
  try {
    const { username } = request;
    const { title, content, color } = request.body;
    const userDetails = await checkUserExistsOrNot(username);
    const newNoteId = uuidv4();
    const createdTime = new Date().toLocaleString();
    const noteInsertQuery = `INSERT INTO notes(note_id, user_id, title, content, color, created_at)
                             VALUES('${newNoteId}', '${userDetails.user_id}', '${title}', '${content}', '${color}', '${createdTime}');`;
    await db.run(noteInsertQuery);
    response.send({ message: 'Note Added Successfully' });
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Update an existing note
app.put('/notes/', authenticateJwtToken, async (request, response) => {
  try {
    const { title, content, color, is_pinned, is_archived, is_deleted, noteId } = request.body;
    const query = `SELECT * FROM notes WHERE note_id='${noteId}';`;
    const note = await db.get(query);

    if (note !== undefined) {
      const updatedTitle = title !== undefined ? title : note.title;
      const updatedContent = content !== undefined ? content : note.content;
      const updatedColor = color !== undefined ? color : note.color;
      const updatedIsPinned = is_pinned !== undefined ? is_pinned : note.is_pinned;
      const updatedIsArchived = is_archived !== undefined ? is_archived : note.is_archived;
      const updatedIsDeleted = is_deleted !== undefined ? is_deleted : note.is_deleted;
      const updatedTime = new Date().toLocaleString();

      const updatingQuery = `
            UPDATE notes
            SET title='${updatedTitle}',
                content='${updatedContent}',
                color='${updatedColor}',
                is_pinned=${updatedIsPinned},
                is_archived=${updatedIsArchived},
                is_deleted=${updatedIsDeleted},
                updated_at='${updatedTime}'
            WHERE note_id='${noteId}';
      `;
      await db.run(updatingQuery);
      response.send({ message: 'Note updated Successfully' });
    } else {
      response.status(400).send({ message: 'Note not found' });
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Permanently delete or recover a note from trash
app.delete('/trash/', authenticateJwtToken, async (request, response) => {
  try {
    const { noteId, recoverNote } = request.body;

    if (noteId === undefined) {
      const query = `SELECT * FROM notes WHERE is_deleted=1;`;
      const res = await db.all(query);
      response.send(res);
    } else if (recoverNote !== undefined) {
      const query = `UPDATE notes SET is_deleted=0 WHERE note_id='${recoverNote}';`;
      await db.run(query);
      response.send({ message: 'Note recovered Successfully' });
    } else {
      const query = `DELETE FROM notes WHERE note_id='${noteId}';`;
      await db.run(query);
      response.send({ message: 'Note Deleted Successfully' });
    }
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});

// Get all archived notes for a user
app.get('/archieve/', authenticateJwtToken, async (request, response) => {
  try {
    const { username } = request;
    const userDetails = await checkUserExistsOrNot(username);
    const allNotes = `SELECT * FROM notes WHERE user_id='${userDetails.user_id}' AND is_deleted=0 AND is_archived=1;`;
    const notes = await db.all(allNotes);
    response.send(notes);
  } catch (error) {
    response.status(500).send({ message: `Internal Server Error: ${error.message}` });
  }
});




