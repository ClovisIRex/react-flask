from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """
    User model representing application users.

    Attributes:
        id (int): Primary key, unique identifier for each user.
        username (str): Unique username for the user, indexed for fast lookup.
        password_hash (str): Hashed password for authentication.

    Table Name:
        users
    """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

class  Note(db.Model):
    """
    Represents a note created by a user.

    Attributes:
        id (int): Primary key for the note.
        user_id (int): Foreign key referencing the user who owns the note.
        title (str): Title of the note, maximum length 255 characters.
        content (str): Content of the note.
        created_at (datetime): Timestamp when the note was created.
        updated_at (datetime): Timestamp when the note was last updated.

        Table Name:
        notes
    """
    __tablename__ = 'notes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
