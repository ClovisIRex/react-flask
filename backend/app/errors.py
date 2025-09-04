from flask import Blueprint, jsonify
from werkzeug.exceptions import HTTPException, BadRequest, Unauthorized, NotFound, Forbidden

errors_bp = Blueprint("errors", __name__)

def _json_error(e: HTTPException):
    response = {
        "error": e.__class__.__name__,
        "message": e.description,
        "status": e.code,
    }
    return jsonify(response), e.code

@errors_bp.app_errorhandler(BadRequest)
def handle_bad_request(e): return _json_error(e)

@errors_bp.app_errorhandler(Unauthorized)
def handle_unauthorized(e): return _json_error(e)

@errors_bp.app_errorhandler(Forbidden)
def handle_forbidden(e): return _json_error(e)

@errors_bp.app_errorhandler(NotFound)
def handle_not_found(e): return _json_error(e)

@errors_bp.app_errorhandler(HTTPException)
def handle_http(e): return _json_error(e)

# Fallback for unhandled exceptions (hide internals)
@errors_bp.app_errorhandler(Exception)
def handle_generic(e):
    from werkzeug.exceptions import InternalServerError
    err = InternalServerError("Internal server error")
    return _json_error(err)
