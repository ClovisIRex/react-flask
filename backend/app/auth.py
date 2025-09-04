import os
import datetime as dt
from datetime import datetime, timezone
from functools import wraps
from flask import request, abort, g, current_app
import jwt
now = datetime.now(timezone.utc).astimezone(dt.timezone(dt.timedelta(hours=3)))

def _secret() -> str:
    return os.getenv('SECRET_KEY', current_app.config.get('SECRET_KEY', 'dev-secret-change-me'))

def create_token(user_id: int) -> str:
    payload = {
        'sub': user_id,
        'exp': now + dt.timedelta(hours=8)
    }
    return jwt.encode(payload, _secret(), algorithm='HS256')

def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            abort(401, description='missing token')
        token = auth.split(' ', 1)[1]
        try:
            payload = jwt.decode(token, _secret(), algorithms=['HS256'])
            g.user_id = int(payload['sub'])
        except Exception:
            abort(401, description='invalid token')
        return fn(*args, **kwargs)
    return wrapper
