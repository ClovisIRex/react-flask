import sys, os
import click
from urllib.parse import urlparse
from pathlib import Path
from werkzeug.security import generate_password_hash
from app import create_app
from app.models import db, User, Note

BACKEND_DIR = Path(__file__).resolve().parent

def _normalize_sqlite_url(database_url: str | None) -> str | None:
    if not database_url:
        return None
    if not database_url.startswith("sqlite"):
        return database_url
    # sqlite URLs:
    # - sqlite:///relative/path.db   (3 slashes)
    # - sqlite:////absolute/path.db  (4 slashes)
    # Parse to find the filesystem path
    parsed = urlparse(database_url)
    # For sqlite, parsed.path is the path portion after the scheme and slashes
    raw_path = parsed.path or ""
    if database_url.startswith("sqlite:////"):  # absolute
        db_path = Path(raw_path)  # already absolute
    else:
        # treat as relative to backend/ directory
        db_path = (BACKEND_DIR / raw_path.lstrip("/")).resolve()

    # Ensure parent dir exists
    db_path.parent.mkdir(parents=True, exist_ok=True)

    # Rebuild a proper absolute sqlite URL with four slashes
    return f"sqlite:///{db_path.as_posix()}" if db_path.is_absolute() else f"sqlite:///{db_path.as_posix()}"

@click.group()
def cli():
    """Management commands for the Notes backend."""
    pass

@cli.command("initdb")
@click.option("--database-url", default=None, help="SQLAlchemy connection string")
@click.option("--seed-username", default=None, help="Seed user username, for example admin")
@click.option("--seed-password", default=None, help="Seed user password")
@click.option("--seed-notes", default=0, type=int, help="How many sample notes to create for the seeded user")
def initdb(database_url, seed_username, seed_password, seed_notes):
    """
    Create tables and optionally seed a user and notes.
    If sqlite path is relative, it is resolved relative to backend/ and parent dirs are created.
    """
    database_url = _normalize_sqlite_url(database_url)
    app = create_app(database_url)
    with app.app_context():
        db.create_all()
        user = None
        if seed_username and seed_password:
            username = seed_username.strip()
            user = User.query.filter_by(username=username).first()
            if not user:
                user = User(username=username, password_hash=generate_password_hash(seed_password))
                db.session.add(user)
                db.session.commit()
                click.echo(f"Seeded user {username}")
            else:
                click.echo("User already exists - skipping user seed")

        if user and seed_notes > 0:
            _seed_notes_for_user(user.id, seed_notes)
            click.echo(f"Seeded {seed_notes} note(s) for {user.username}")

def _seed_notes_for_user(user_id: int, count: int):
    existing = Note.query.filter_by(user_id=user_id).count()
    start_index = existing + 1
    for i in range(start_index, start_index + count):
        n = Note(user_id=user_id, title=f"Sample Note {i}", content=f"Demo content for note {i}")
        db.session.add(n)
    db.session.commit()

@cli.command("seed-notes")
@click.option("--database-url", default=None, help="SQLAlchemy connection string")
@click.option("--username", required=True, help="Existing username to attach notes to")
@click.option("--count", default=3, type=int, help="How many notes to add")
def seed_notes(database_url, username, count):
    database_url = _normalize_sqlite_url(database_url)
    app = create_app(database_url)
    with app.app_context():
        user = User.query.filter_by(username=username.strip()).first()
        if not user:
            click.echo(f"User {username} not found", err=True)
            sys.exit(1)
        _seed_notes_for_user(user.id, count)
        click.echo(f"Added {count} note(s) for {username}")

@cli.command("test-login")
@click.option("--database-url", default=None, help="SQLAlchemy connection string")
@click.option("--username", required=True, help="Username to test login with")
@click.option("--password", required=True, help="Password to test login with")
def test_login(database_url, username, password):
    database_url = _normalize_sqlite_url(database_url)
    app = create_app(database_url)
    with app.app_context():
        client = app.test_client()

        r = client.post("/api/login", json={"username": username.strip(), "password": password})
        if r.status_code != 200:
            click.echo(f"Login failed - status {r.status_code}: {r.get_data(as_text=True)}", err=True)
            sys.exit(1)

        data = r.get_json() or {}
        token = data.get("token")
        if not token:
            click.echo("Login response missing token", err=True)
            sys.exit(1)

        r2 = client.get("/api/notes", headers={"Authorization": f"Bearer {token}"})
        if r2.status_code != 200:
            click.echo(f"/api/notes failed - status {r2.status_code}: {r2.get_data(as_text=True)}", err=True)
            sys.exit(1)

        notes = r2.get_json() or []
        click.echo(f"Login OK for {username} - {len(notes)} note(s) found")
        for n in notes[:5]:
            click.echo(f"- [{n.get('id','')}] {n.get('title','')}")
        sys.exit(0)

if __name__ == "__main__":
    cli()