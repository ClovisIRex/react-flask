from flask import Blueprint, request, jsonify, abort, g
from werkzeug.security import check_password_hash, generate_password_hash
from .models import db, User, Note
from .auth import create_token, require_auth

api_bp = Blueprint('api', __name__)

@api_bp.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    if not email or not password:
        abort(400, description='email and password are required')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        abort(401, description='invalid credentials')
    token = create_token(user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email}})

@api_bp.get('/notes')
@require_auth
def list_notes():
    notes = Note.query.filter_by(user_id=g.user_id).order_by(Note.updated_at.desc()).all()
    return jsonify([{'id': n.id, 'title': n.title, 'content': n.content,
                     'created_at': n.created_at.isoformat(),
                     'updated_at': n.updated_at.isoformat()} for n in notes])

@api_bp.post('/notes')
@require_auth
def create_note():
    data = request.get_json(silent=True) or {}
    title = (data.get('title') or '').strip()
    content = (data.get('content') or '').strip()
    if not title:
        abort(400, description='title is required')
    note = Note(user_id=g.user_id, title=title, content=content)
    db.session.add(note)
    db.session.commit()
    return jsonify({'id': note.id, 'title': note.title, 'content': note.content,
                    'created_at': note.created_at.isoformat(),
                    'updated_at': note.updated_at.isoformat()}), 201

@api_bp.put('/notes/<int:note_id>')
@require_auth
def update_note(note_id: int):
    note = Note.query.filter_by(id=note_id, user_id=g.user_id).first()
    if not note:
        abort(404, description='note not found')
    data = request.get_json(silent=True) or {}
    if 'title' in data: note.title = (data['title'] or '').strip()
    if 'content' in data: note.content = (data['content'] or '').strip()
    db.session.commit()
    return jsonify({'id': note.id, 'title': note.title, 'content': note.content,
                    'created_at': note.created_at.isoformat(),
                    'updated_at': note.updated_at.isoformat()})

@api_bp.delete('/notes/<int:note_id>')
@require_auth
def delete_note(note_id: int):
    note = Note.query.filter_by(id=note_id, user_id=g.user_id).first()
    if not note:
        abort(404, description='note not found')
    db.session.delete(note)
    db.session.commit()
    return '', 204
