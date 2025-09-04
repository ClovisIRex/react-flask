from typing import Tuple
import re
import bleach
from werkzeug.exceptions import BadRequest

TITLE_MAX = 50
CONTENT_MAX = 100

# Allow only plain text (strip tags entirely). Adjust if you want to allow a tiny whitelist.
def sanitize_text(text: str) -> str:
    if text is None:
        return ""
    # normalize newlines and collapse weird spaces
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t\f\v]+", " ", text)  # collapse horizontal whitespace
    text = text.strip()
    # strip all tags and attributes
    return bleach.clean(text, tags=[], attributes={}, protocols=[], strip=True)

def validate_note_payload(data: dict) -> Tuple[str, str]:
    if not isinstance(data, dict):
        raise BadRequest("Invalid payload")

    raw_title = data.get("title", "")
    raw_content = data.get("content", "")

    if not isinstance(raw_title, str) or not isinstance(raw_content, str):
        raise BadRequest("Title and content must be strings")

    title = sanitize_text(raw_title)
    content = sanitize_text(raw_content)

    if not title:
        raise BadRequest("Title is required")

    if len(title) > TITLE_MAX:
        raise BadRequest(f"Title exceeds {TITLE_MAX} characters")

    if len(content) > CONTENT_MAX:
        raise BadRequest(f"Content exceeds {CONTENT_MAX} characters")

    return title, content

def validate_login_payload(data: dict) -> Tuple[str, str]:
    if not isinstance(data, dict):
        raise BadRequest("Invalid payload")

    raw_username = data.get("username", "")
    raw_password = data.get("password", "")

    if not isinstance(raw_username, str) or not isinstance(raw_password, str):
        raise BadRequest("Username and password must be strings")

    username = sanitize_text(raw_username)
    password = raw_password.strip()  # do not bleach passwords, just trim

    if not username or not password:
        raise BadRequest("Username and password are required")

    # Optional: constrain username charset to reduce junk input
    if not re.fullmatch(r"[A-Za-z0-9_.\-]{1,64}", username):
        raise BadRequest("Username contains invalid characters")

    return username, password
