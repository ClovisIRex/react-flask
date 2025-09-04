import click
from werkzeug.security import generate_password_hash
from app import create_app
from app.models import db, User

@click.group()
def cli():
    pass

@cli.command('initdb')
@click.option('--database-url', default=None, help='SQLAlchemy connection string')
@click.option('--seed-username', default=None, help='Seed user username (eg admin)')
@click.option('--seed-password', default=None, help='Seed user password')
def initdb(database_url, seed_username, seed_password):
    "Create tables and optionally seed the admin user."
    app = create_app(database_url)
    with app.app_context():
        db.create_all()
        if seed_username and seed_password:
            username = seed_username.strip()
            if not User.query.filter_by(username=username).first():
                u = User(username=username, password_hash=generate_password_hash(seed_password))
                db.session.add(u)
                db.session.commit()
                click.echo(f"Seeded user {username}")
            else:
                click.echo("User already exists - skipping seed")

if __name__ == '__main__':
    cli()
