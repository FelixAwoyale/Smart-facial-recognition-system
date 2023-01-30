from flask import Flask, request, abort, jsonify
from models import Students, setup_db
from flask_cors import CORS
from passlib.hash import pbkdf2_sha256

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.route('/student/register', method=['POST'])
    def register():
        body = request.get_json()

        new_firstname=body.get("firstName", None)
        new_lastname=body.get("lastName", None)
        new_email=body.get("email", None)
        new_password = body.get("password", None)
        new_matricno = body.get('matricno', None)
        new_level = body.get('level', None)

        existing_user = Students.query.filter_by(email=new_email).first()
        if existing_user is not None:
            return jsonify(message="A user with this email already exists"), 409
        
        hashed_password = pbkdf2_sha256.hash(new_password)

        try:
            student = Students(firstname=new_firstname, lastname=new_lastname, email=new_email, matricno=new_matricno, level=new_level, password=hashed_password) 
            student.insert()
            selection = Students.query.order_by(Students.id).all()

            return jsonify({
                "success":True,
                "created": Students.id
            })
        except:
            abort(422)

    @app.route('/student/login', method=['GET'])
    def Studentlogin():
         body = request.get_json()

         new_matric = body.get('matricno')
         new_password = body.get('password')

         student = Students.query.filter_by(matricno=new_matric).first()

         if student is None:
              return jsonify(message="User does not exist or email is invalid"), 401
         
         if pbkdf2_sha256.verify(new_password, student.password):
              return jsonify(message="success")
         else:
              return jsonify(message="Invalid email or password"), 401




    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
                "success": False,
                "error": 400,
                "message": "Bad request(Wrong Input)"
            }), 400

    @app.errorhandler(404)
    def not_found(error):
            return jsonify({
                "success": False,
                "error": 404,
                "message": 'Not found'
            }), 404

    @app.errorhandler(422)
    def unprocessable(error):
            return jsonify({
                "success": False,
                "error": 422,
                "message": 'Unable to Process your request'
            }), 422
    
    return app