import os
import datetime
from datetime import date
from sqlalchemy import Column, String, Integer, JSON
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
# from mongoalchemy import MongoAlchemy,fields
import json
from settings import database_path
from flask_migrate import Migrate


# database_path = 'postgresql://{}:{}@{}/{}'.format(
#     database_user, database_password, 'localhost:5432', database_name)

db = SQLAlchemy()


def setup_db(app, database_path=database_path):
    # app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    # Initialize Flask-Migrate
    migrate = Migrate(app, db)
    with app.app_context():
        # create the database tables
        db.create_all()

    # app.config["MONGOALCHEMY_CONNECTION_STRING"] = mongo_uri
    # app.config["MONGOALCHEMY_SERVER"] = 'localhost'
    # app.config["MONGOALCHEMY_PORT"] = 27017
    # app.config["MONGOALCHEMY_DATABASE"] = 'mydatabase'
    # db.app = app
    # db.init_app(app)
    # db.create_all()


class Students(db.Model):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, nullable=False)
    matricno = Column(String, nullable=False)
    level = Column(String, nullable=False)
    password = Column(String, nullable=False)
    encodings = Column(JSON, nullable=True)

    def __init__(self, firstname, lastname, email, matricno, level, password, encodings=None, id=None):
        self.id = id
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.matricno = matricno
        self.level = level
        self.password = password
        self.encodings = dict(encodings) if encodings else None

    # def insert(self):
    #     self.save(self)

    # # def update(self):
    # #     db.session.()

    # def delete(self):
    #     self.remove(self)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'email': self.email,
            'matricno': self.matricno,
            'password': self.password,
            'level': self.level,
            'encodings': self.encodings
        }


class Lecturer(db.Model):
    __tablename__ = 'lecturer'

    id = Column(Integer, primary_key=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String, nullable=True)

    def __init__(self, firstname, lastname, email, password, id=None, department=None):
        self.id = id
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.password = password
        self.department = department

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'email': self.email,
            'password': self.password,
            'department': self.department

        }


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)


class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = Column(Integer, primary_key=True)
    student_id = Column(db.Integer, db.ForeignKey(
        'students.id'), nullable=False)
    student = relationship('Students', backref='attendance')
    date = Column(db.Date, nullable=False, default=datetime.datetime.now())
    present = Column(db.Boolean, nullable=False, default=False)
    session = Column(db.String(50), nullable=False)
    lecturer_id = Column(db.Integer, db.ForeignKey(
        'lecturer.id'), nullable=False)
    student_name = Column(db.String(100), nullable=False)
    matric_no = Column(db.String(50), nullable=False)

    def __init__(self, student_id,  present, session, student_name, lecturer_id, matric_no, id=None, date=None,):
        self.id = id
        self.student_id = student_id
        self.date = date
        self.present = present
        self.session = session,
        self.lecturer_id = lecturer_id
        self.student_name = student_name
        self.matric_no = matric_no

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def format(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'date': self.date,
            'present': self.present,
            'session': self.session,
            'lecturer_id': self.lecturer_id

        }
