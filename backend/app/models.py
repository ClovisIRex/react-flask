from flask_sqlalchemy import SQLAlchemy
import datetime as dt
from datetime import datetime, timezone

# Always use timezone-aware UTC
now = datetime.now(timezone.utc).astimezone(dt.timezone(dt.timedelta(hours=3)))


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    title = db.Column(db.String(50), nullable=False)  # enforce at DB too
    content = db.Column(db.Text, nullable=False)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: now,
        nullable=False
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: now,
        onupdate=lambda: now,
        nullable=False
    )
