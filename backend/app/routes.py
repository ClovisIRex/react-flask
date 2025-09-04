from flask import Blueprint, jsonify, request, abort

api_bp = Blueprint("api", __name__)

# in-memory store
TODOS = [
    {"id": 1, "text": "Learn Flask", "done": False},
    {"id": 2, "text": "Connect React", "done": False},
]

@api_bp.get("/hello")
def hello():
    return jsonify({"message": "Hello from Flask"})

@api_bp.get("/todos")
def list_todos():
    return jsonify(TODOS)

@api_bp.post("/todos")
def add_todo():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        abort(400, description="text is required")
    new_id = max([t["id"] for t in TODOS] + [0]) + 1
    todo = {"id": new_id, "text": text, "done": False}
    TODOS.append(todo)
    return jsonify(todo), 201

@api_bp.patch("/todos/<int:todo_id>")
def toggle_todo(todo_id: int):
    for t in TODOS:
        if t["id"] == todo_id:
            t["done"] = not t["done"]
            return jsonify(t)
    abort(404, description="not found")
