from flask import Flask, jsonify
from config import Config
from models import db, User, Title, Rating
from flask import request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity


app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": user.user_id,
        "username": user.username,
        "email": user.email
    } for user in users])


@app.route("/titles", methods=["GET"])
def get_all_titles():
    titles = Title.query.all()
    return jsonify([
        {
            "id": t.title_id,
            "name": t.name,
            "year": t.release_year,
            "genre": t.genre,
            "description": t.description
        }
        for t in titles
    ])


@app.route("/titles/<int:title_id>", methods=["GET"])
def get_title(title_id):
    title = Title.query.get(title_id)
    if title is None:
        return jsonify({"error": "Movie not found!"}), 404

    return jsonify({
        "id": title.title_id,
        "name": title.name,
        "year": title.release_year,
        "genre": title.genre,
        "description": title.description
    })


@app.route("/titles/<int:title_id>/ratings", methods=["GET"])
def get_title_ratings(title_id):
    title = Title.query.get(title_id)
    if title is None:
        return jsonify({"error": "Movie not found"}), 404

    ratings = Rating.query.filter_by(title_id=title_id).all()
    return jsonify([
        {
            "user_id": r.user_id,
            "score": r.score,
            "review": r.review,
            "created_at": r.created_at.isoformat()
        }
        for r in ratings
    ])


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields must be filled!"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "This email is already registered!"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(username=username, email=email, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registration successful!"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        token = create_access_token(identity=str(user.user_id))
        return jsonify({"access_token": token}), 200
    else:
        return jsonify({"error": "Invalid email or password!"}), 401


@app.route("/titles/<int:title_id>/ratings", methods=["POST"])
@jwt_required()
def add_rating(title_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    data = request.get_json()
    score = data.get("score")
    review = data.get("review")

    if score is None:
        return jsonify({"error": "Points are required!"}), 400

    rating = Rating(user_id=user.user_id, title_id=title_id, score=score, review=review)
    db.session.add(rating)
    db.session.commit()

    return jsonify({"message": "Points added!"}), 201


@app.route("/titles", methods=["POST"])
@jwt_required()
def add_title():
    data = request.get_json()
    name = data.get("name")
    release_year = data.get("release_year")
    genre = data.get("genre")
    description = data.get("description")

    if not name:
        return jsonify({"error": "Movie title is required!"}), 400

    new_title = Title(name=name, release_year=release_year, genre=genre, description=description)
    db.session.add(new_title)
    db.session.commit()

    return jsonify({"message": "Movie added!"}), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

