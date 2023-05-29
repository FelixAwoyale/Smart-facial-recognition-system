from flask import Flask, request, abort, jsonify
from models import Students, setup_db, Lecturer, Attendance
from flask_cors import CORS
from passlib.hash import pbkdf2_sha256
import jwt
from datetime import datetime, timedelta
from recognition_functions import findEncodings, face_distance
import numpy as np
import base64
import cv2
import face_recognition
import os
from datetime import datetime
import pandas as pd
import dlib
from flask_migrate import Migrate

# Initialize Flask-Migrate


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

        new_firstname = body.get("firstname", None)
        new_lastname = body.get("lastname", None)
        new_email = body.get("email", None)
        new_password = body.get("password", None)
        new_matricno = body.get("matricno", None)
        new_level = body.get("level", None)

        new_encodings = {}

        existing_user = Students.query.filter_by(email=new_email).first()
        if existing_user is not None:
            return jsonify(message="A user with this email already exists"), 409

        hashed_password = pbkdf2_sha256.hash(new_password)

        try:
            student = Students(firstname=new_firstname, lastname=new_lastname, email=new_email,
                               matricno=new_matricno, level=new_level, password=hashed_password)
            student.insert()
            # selection = Students.query.order_by(Students.id).all()

            return jsonify({
                "success": True,
                "created": student.id,
                "Total Students": len(Students.query.all())
            })
        except Exception as e:
            print(e)
            abort(422)

    @app.route('/lecturer/register', methods=['POST'])
    def create_lecturer():
        body = request.get_json()
        new_firstname = body.get('firstname', None)
        new_lastname = body.get('lastname', None)
        new_email = body.get('email', None)
        new_password = body.get('password', None)

        existing_lecturer = Lecturer.query.filter_by(email=new_email).first()
        if existing_lecturer is not None:
            return jsonify(message="A user with this email already exists"), 409
        hashed_password = pbkdf2_sha256.hash(new_password)

        try:
            lecturer = Lecturer(firstname=new_firstname, lastname=new_lastname,
                                email=new_email, password=hashed_password)
            lecturer.insert()

            return jsonify({"success": True,
                            "created": lecturer.id,
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
                'id': student.id,
                'token': token
            })

        else:
            return jsonify(message="Invalid email or password"), 401

    @app.route('/lecturer/login', methods=['POST'])
    def Lecturerlogin():
        body = request.get_json()

        new_email = body.get('email')
        new_password = body.get('password')

        lecturer = Lecturer.query.filter_by(email=new_email).first()

        if lecturer is None:
            return jsonify(message="User does not exist or email is invalid"), 401

        if pbkdf2_sha256.verify(new_password, lecturer.password):
            payload = {
                'email': new_email,
                'id': lecturer.id,
                'exp': datetime.utcnow() + timedelta(minutes=30)  # token expires in 30 minutes
            }
            token = jwt.encode(payload, 'secret_key', algorithm='HS256')
            return jsonify({
                'message': 'success',
                'token': token,
                'id': lecturer.id
            })

        else:
            return jsonify(message="Invalid email or password"), 401

    @app.route('/student/create_encodings/<int:id>', methods=['PATCH'])
    def create_encodings(id):
        data_url = request.json['dataUrl']
        header, encoded = data_url.split(",", 1)
        image_data = base64.b64decode(encoded)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        student = Students.query.filter_by(id=id).first()
        #  alpha = 5
        #  beta = 20
        #  processed_img = cv2.addWeighted(img, alpha, np.zeros(img.shape, img.dtype), 0,beta)
        #  print(processed_img)
        #  file = request.files['file']
        #  file_content = file.read()

        if student is None:
            return jsonify(message="Student not found"), 404

        #  if 'encodings' not in request.json:
        #      return jsonify(message="Request body must contain encodings"), 400

        new_encodings = findEncodings([img])
        if new_encodings is None:
            return jsonify(message="No face detected"), 400
        new_encodings = [e.tolist() for e in new_encodings]

        try:
            student.encodings = new_encodings
            student.update()
            return jsonify(message="Students encoding updated sucessfully"), 200
        except Exception as e:
            print(e)
            abort(422)

    @app.route('/markattendance', methods=['POST'])
    def mark_attendance():
        # Load the encodings and names from the database
        students = Students.query.all()
        encodings = [np.array(student.encodings)
                     for student in students if student.encodings is not None]
        print(encodings)

        ids = [student.id for student in students if student.encodings is not None]
        first_names = [
            student.firstname for student in students if student.encodings is not None]
        last_names = [
            student.lastname for student in students if student.encodings is not None]

        names = [f"{first_name} {last_name}" for first_name,
                 last_name in zip(first_names, last_names)]
        matric_nos = [
            student.matricno for student in students if student.encodings is not None]
        encoding_to_info = {tuple(encoding): {'id': student_id, 'name': student_name, 'matric_no': matric_no}
                            for encoding, student_id, student_name, matric_no in zip(encodings, ids, names, matric_nos)}
        body = request.get_json()
        print(ids)

        new_lecturer = body.get('lecturer')
        new_session = body.get('session')

        stream = cv2.VideoCapture(1)

    # Process the video stream until it is closed
        while True:
            # Read a frame from the video stream
            ret, frame = stream.read()

            # If there was an error reading the frame, exit the loop
            if not ret:
                break

            # Find the face locations and encodings in the frame
            imgS = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            faceCurFrame = face_recognition.face_locations(imgS)
            encodesCurFrame = face_recognition.face_encodings(
                imgS, faceCurFrame)

            for encodeFace, faceLoc in zip(encodesCurFrame, faceCurFrame):
                # matches = face_recognition.compare_faces(
                #     encodings, encodeFace)
                # faceDis = face_recognition.face_distance(
                #     encodings, encodeFace)
                print(encodeFace)
                matches = face_recognition.compare_faces(
                    encodings, encodeFace)
                faceDis = face_recognition.face_distance(
                    encodings, encodeFace)
                print(faceDis)

                matchIndex = np.argmin(faceDis)

            # Recognize the faces and mark attendance

                # If a match is found, mark attendance for the corresponding student
                if matches[matchIndex]:
                    encoding = tuple(encodings[matchIndex])
                    student_info = encoding_to_info[encoding]
                    student_id = student_info['id']
                    student_name = student_info['name']
                    student_matric_no = student_info['matric_no']
                    # student_name = student_info['name']
                    existing_attendance = Attendance.query.filter_by(
                        student_id=student_id, session=new_session).first()
                    if not existing_attendance:
                        attendance = Attendance(
                            student_id=student_id, lecturer_id=new_lecturer, present=True, session=new_session, student_name=student_name, matric_no=student_matric_no)
                        attendance.insert()

            # Wait for a key press to exit the loop (or use a timer to exit automatically)
            cv2.imshow('Video Stream', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # Release the video stream and close the window
        stream.release()
        cv2.destroyAllWindows()

        return jsonify({
            'message': 'success'
        })

    @app.route('/attendance/<int:lecturer_id>', methods=['GET'])
    def get_attendance(lecturer_id):

        # Get the query parameters for session and time
        session = request.args.get('session')
        time = request.args.get('time')

    # Query the database for attendance records based on the lecturer ID, session, and time
        attendance_records = Attendance.query.filter_by(
            lecturer_id=lecturer_id).all()
        # Query the database for attendance records based on the lecturer ID

        # Check if any records were found
        if attendance_records:
            # Create a dictionary to store attendance records by session
            attendance_by_session_time = {}

            # Iterate over the attendance records
            for attendance in attendance_records:
                # Get the session for the attendance record
                session = attendance.session
                time = attendance.date.isoformat()

                # Check if the session exists in the dictionary
                # Check if the session and time exist in the dictionary
                if session in attendance_by_session_time:
                    if time in attendance_by_session_time[session]:
                        # Append the attendance record to the existing session and time key
                        attendance_by_session_time[session][time].append({
                            'student_name': attendance.student_name,
                            'present': attendance.present,
                            'matric_no': attendance.matric_no,
                            'student_id': attendance.student_id,
                            'date': attendance.date,

                        })
                    else:
                        # Create a new time key and assign the attendance record to it
                        attendance_by_session_time[session][time] = [
                            {
                                'student_name': attendance.student_name,
                                'present': attendance.present,
                                'matric_no': attendance.matric_no,
                                'student_id': attendance.student_id,
                                'date': attendance.date,

                            }]
                else:
                    # Create a new session key and assign the attendance record to it
                    attendance_by_session_time[session] = {
                        time: [{
                            'student_name': attendance.student_name,
                            'present': attendance.present,
                            'matric_no': attendance.matric_no,
                            'student_id': attendance.student_id,
                            'date': attendance.date,

                        }]}

            # Return the attendance by session and time dictionary as JSON
            return jsonify({
                'attendance': attendance_by_session_time
            })
        else:
            # Return a message indicating no attendance records were found
            return jsonify({
                'message': 'No attendance records found for the lecturer, session, and time'
            })

    @app.route('/attendance/session/<string:session>/date/<string:date>', methods=['GET'])
    def get_attendance_by_session_and_date(session, date):
        # Parse the date parameter into a datetime object
        # try:
        #     attendance_date = datetime.strptime(date, '%Y-%m-%d').date()
        # except ValueError:
        #     return jsonify({
        #         'message': 'Invalid date format. Please use the format YYYY-MM-DD.'
        #     }), 400

        # Query the database for attendance records based on the session and date
        attendance_records = Attendance.query.filter(
            Attendance.session == session, Attendance.date == date
        ).all()

        # Check if any records were found
        if attendance_records:
            # Create a list to store the attendance records
            attendance_list = []

            # Iterate over the attendance records
            for attendance in attendance_records:

                attendance_info = {
                    'id': attendance.id,
                    'student_id': attendance.student_id,
                    'student_name': attendance.student_name,
                    'present': attendance.present,
                    'date': attendance.date.strftime("%Y-%m-%d"),
                    'session': attendance.session,
                    'matricno': attendance.matric_no
                }

                attendance_list.append(attendance_info)

            # Return the attendance records as JSON
            return jsonify({
                'attendance': attendance_list
            })
        else:
            # Return a message indicating no attendance records were found for the session and date
            return jsonify({
                'message': 'No attendance records found for the session and date'
            })

    @app.route('/student/get', methods=['GET'])
    def get_students():
        student = Students.query.all()

        formatted_students = [{'matricno': s.matricno,
                               'lastname': s.lastname,
                               'email': s.email,
                               'level': s.level,
                               'encodings': s.encodings,
                               'firstname': s.firstname} for s in student]

        return jsonify({
            'student': formatted_students,

        })

    @app.route('/lecturer/get', methods=['GET'])
    def get_lecturer():
        lecturer = Lecturer.query.all()

        formatted_lecturer = [{'firstname': s.firstname,
                               'lastname': s.lastname,
                               'email': s.email,
                               'department': s.department
                               } for s in lecturer]

        return jsonify({
            'lecturer': formatted_lecturer,

        })

    @app.route('/student/get/<int:id>', methods=['GET'])
    def get_studentsbyId(id):
        student = Students.query.filter_by(id=id).first()
        if student is None:
            return jsonify({'error': 'Student not found'})
        formatted_students = {'matricno': student.matricno,
                              'lastname': student.lastname,
                              'email': student.email,
                              'level': student.level,
                              'encodings': student.encodings,
                              'firstname': student.firstname}

        return jsonify(
            formatted_students,

        )

    @app.route('/lecturer/get/<int:id>', methods=['GET'])
    def get_lecturerbyId(id):
        lecturer = Lecturer.query.filter_by(id=id).first()
        if lecturer is None:
            return jsonify({'error': 'Lecturer not found'})
        formatted_lecturer = {'firstname': lecturer.firstname,
                              'lastname': lecturer.lastname,
                              'email': lecturer.email,
                              'department': lecturer.department}

        return jsonify(
            formatted_lecturer,

        )

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
