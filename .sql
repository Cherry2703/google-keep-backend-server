-- CREATE TABLE users (
--     user_id TEXT PRIMARY KEY,           
--     username TEXT NOT NULL UNIQUE, 
--     email TEXT NOT NULL UNIQUE,    
--     password TEXT NOT NULL,        
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );



-- CREATE TABLE notes (
--     note_id TEXT PRIMARY KEY,             
--     user_id TEXT NOT NULL,           -- Foreign key to the users table
--     title TEXT,                      
--     content TEXT,                    
--     color TEXT,                      
--     is_pinned BOOLEAN DEFAULT 0,     
--     is_archived BOOLEAN DEFAULT 0,   
--     is_deleted BOOLEAN DEFAULT 0,    
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     updated_at DATETIME,             
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
-- );

-- CREATE TABLE labels (
--     label_id TEXT PRIMARY KEY,         
--     name TEXT NOT NULL UNIQUE    
-- );



-- CREATE TABLE note_labels (
--     note_id TEXT,                -- Foreign key to notes table
--     label_id TEXT,               -- Foreign key to labels table
--     PRIMARY KEY (note_id, label_id),
--     FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE,
--     FOREIGN KEY (label_id) REFERENCES labels(label_id) ON DELETE CASCADE
-- );


-- CREATE TABLE reminders (
--     remainder_id TEXT PRIMARY KEY,             
--     note_id TEXT NOT NULL,           -- FORIGN KEY
--     reminder_time DATETIME NOT NULL, 
--     is_done BOOLEAN DEFAULT 0,       
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     FOREIGN KEY (note_id) REFERENCES notes(note_id) ON DELETE CASCADE
-- );


select * from users;
select * from notes;
select * from reminders;
select * from labels;


