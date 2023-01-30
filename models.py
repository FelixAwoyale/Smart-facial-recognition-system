import os
# from sqlalchemy import Column, String, Integer, create_engine, LargeBinary
# from flask_sqlalchemy import SQLAlchemy
from mongoalchemy import MongoAlchemy,fields
import json


database_path =''

db = MongoAlchemy()

def setup_db(app, mongo_uri):
    # app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MONGOALCHEMY_CONNECTION_STRING"] = mongo_uri
    app.config["MONGOALCHEMY_SERVER"] = 'localhost'
    app.config["MONGOALCHEMY_PORT"] = 27017
    app.config["MONGOALCHEMY_DATABASE"] = 'mydatabase'
    db.app = app
    db.init_app(app)
    db.create_all()


class Students(db.Document):
    __tablename__ = 'students'

    id = fields.IntField( primary_key=True)
    firstname = fields.StringField(required=True)
    lastname = fields.StringField(required=True)
    email= fields.StringField(required=True)
    matricno =fields.StringField(required=True)
    level = fields.StringField(required=True)
    password =fields.StringField(required=True)
    encodings = fields.ListField()

    def __init__(self, firstname, lastname, email, matricno, level, password, id, encodings) :
        self.id = id
        self.firstname=firstname
        self.lastname=lastname
        self.email =email
        self.matricno=matricno
        self.level=level
        self.password = password
        self.encodings = encodings

    def insert(self):
        self.save(self)
        

    # def update(self):
    #     db.session.()
    
    def delete(self):
        self.remove(self)
    
    
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


class Lecturer(db.Document):
    __tablename__ = 'lecturer'

    id = fields.IntField( primary_key=True)
    firstname = fields.StringField(required=True)
    lastname = fields.StringField(required=True)
    email= fields.StringField(required=True)
    password =fields.StringField(required=True)

    def __init__(self, firstname, lastname, email, matricno, level, password, id) :
        self.id = id
        self.firstname=firstname
        self.lastname=lastname
        self.email =email
        self.password = password

    def insert(self):
       self.save

    def update(self):
        self.save
    
    def delete(self):
        self.remove
    
    def format(self):
        return{
            'id': self.id,
            'firstname': self.firstname,
            'lastname':self.lastname,
            'email':self.email,
            'password':self.password,
          
        }
