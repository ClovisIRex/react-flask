import click
from werkzeug.security import generate_password_hash
from app import create_app
from app.models import db, User

@click.group()
def cli():
    pass

@cli.command('initdb')
@click.option('--database-url', default=None, help='SQLAlchemy connection string')
@click.option('--seed-email', default=None, help='Seed user email')
@click.option('--seed-password', default=None, help='Seed user password')
def initdb(database_url, seed_email, seed_password):
    "Create tables for the given connection string and optionally seed a user."
    app = create_app(database_url)
    with app.app_context():
        db.create_all()
        if seed_email and seed_password:
            email = seed_email.strip().lower()
            if not User.query.filter_by(email=email).first():
                u = User(email=email, password_hash=generate_password_hash(seed_password))
                db.session.add(u)
                db.session.commit()
                click.echo(f"Seeded user {email}")
            else:
                click.echo("User already exists - skipping seed")

if __name__ == '__main__':
    cli()
