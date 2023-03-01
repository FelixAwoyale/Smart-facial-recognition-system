import os
from sqlalchemy import Column, String, Integer, JSON
from flask_sqlalchemy import SQLAlchemy
# from mongoalchemy import MongoAlchemy,fields
import json
from settings import database_name, database_password, database_user


database_path = 'postgresql://{}:{}@{}/{}'.format(database_user, database_password,'localhost:5432', database_name)

db = SQLAlchemy()

def setup_db(app, database_path=database_path):
    # app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
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

    def __init__(self, firstname, lastname, email, matricno, level, password, encodings=None, id=None) :
        self.id = id
        self.firstname=firstname
        self.lastname=lastname
        self.email =email
        self.matricno=matricno
        self.level=level
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
        return{
            'id': self.id,
            'firstname': self.firstname,
            'lastname':self.lastname,
            'email':self.email,
            'matricno':self.matricno,
            'password':self.password,
            'level':self.level,
            'encodings':self.encodings
        }


class Lecturer(db.Model):
    __tablename__ = 'lecturer'

    id = Column(Integer, primary_key=True)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)

    def __init__(self, firstname, lastname, email, password, id) :
        self.id = id
        self.firstname=firstname
        self.lastname=lastname
        self.email =email
        self.password = password

    def insert(self):
        db.session.add(self)
        db.session.commit()
    
    def format(self):
        return{
            'id': self.id,
            'firstname': self.firstname,
            'lastname':self.lastname,
            'email':self.email,
            'password':self.password,
          
        }

