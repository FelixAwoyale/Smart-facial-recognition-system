from flask import Flask, request, abort, jsonify
from models import Students, setup_db, Lecturer
from flask_cors import CORS
from passlib.hash import pbkdf2_sha256
import jwt
from datetime import datetime, timedelta
from recognition_functions import findEncodings

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)
    with app.app_context():
        app.run()

    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        return response

    @app.route('/student/register', methods=['POST'])
    def register():
        body = request.get_json()
        # print(body)
        print(request)

        new_firstname=body.get("firstname", None)
        new_lastname=body.get("lastname", None)
        new_email=body.get("email", None)
        new_password = body.get("password", None)
        new_matricno = body.get("matricno", None)
        new_level = body.get("level", None)

       
        new_encodings ={}
        



        existing_user = Students.query.filter_by(email=new_email).first()
        if existing_user is not None:
            return jsonify(message="A user with this email already exists"), 409
        
        hashed_password = pbkdf2_sha256.hash(new_password)

        try:
            student = Students(firstname=new_firstname, lastname=new_lastname, email=new_email, matricno=new_matricno, level=new_level, password=hashed_password) 
            student.insert()
            # selection = Students.query.order_by(Students.id).all()

            return jsonify({
                "success":True,
                "created": Students.id,
                "Total Students": len(Students.query.all())
            })
        except Exception as e:
            print(e)
            abort(422)

    @app.route('/lecturer/register', methods=['POST'])
    def create_lecturer():
         body=request.get_json()
         new_firstname = body.get('firstname', None)
         new_lastname = body.get('lastname', None)
         new_email = body.get('email', None)
         new_password = body.get('password', None)

         existing_lecturer = Lecturer.query.filter_by(email=new_email).first()
         if existing_lecturer is not None:
            return jsonify(message="A user with this email already exists"), 409
         hashed_password = pbkdf2_sha256.hash(new_password)

         try:
              lecturer = Lecturer(firstname=new_firstname, lastname=new_lastname, email=new_email, password=hashed_password)
              lecturer.insert()

              return jsonify({"success":True,
                "created": Lecturer.id,
                "Total Students": len(Lecturer.query.all())})
         except Exception as e:
              print(e)
              abort(422)


    @app.route('/student/login', methods=['POST'])
    def Studentlogin():
         body = request.get_json()

         new_matric = body.get('matricno')
         new_password = body.get('password')

         student = Students.query.filter_by(matricno=new_matric).first()

         if student is None:
              return jsonify(message="User does not exist or email is invalid"), 401
         
         if pbkdf2_sha256.verify(new_password, student.password):
            payload = {
              'matricno': new_matric,
              'exp': datetime.utcnow() + timedelta(minutes=30)  # token expires in 30 minutes
          }
            token = jwt.encode(payload, 'secret_key', algorithm='HS256')
            return jsonify({
              'message': 'success',
              'id':student.id,
              'token': token
                })
              
         else:
              return jsonify(message="Invalid email or password"), 401
         
    @app.route('/student/create_encodings/<int:id>', methods=['PATCH'])
    def create_encodings(id):
         student =Students.query.filter_by(id=id).first()

         file = request.files['file']
         file_content = file.read()


         if student is None:
            return jsonify(message="Student not found"), 404
         
         if 'encodings' not in request.json:
             return jsonify(message="Request body must contain encodings"), 400
         
         new_encodings = findEncodings(file_content)
         

         try: 
              student = Students(encodings=new_encodings)
              student.update()
              return jsonify(message="Students encoding updated sucessfully"), 200
         except Exception as e:
              print(e)
              abort(422)
         
        
    
        




    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
                "success": False,
                "error": 400,
                "message": "Bad request(Wrong Input)" + str(error)
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
                "message": 'Unable to Process your request' + str(error)
            }), 422
    
    return app


