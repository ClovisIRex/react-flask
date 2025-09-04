# backend/app/models.py
from __future__ import annotations
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

def utcnow():
    # timezone-aware UTC, evaluated on each use
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = "users"  # force plural table name

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    notes = db.relationship("Note", backref="user", lazy=True, cascade="all, delete-orphan")

class Note(db.Model):
    __tablename__ = "notes"  # force plural table name

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    # keep limits consistent with your frontend and validators
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
