# project/models.py


import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.functions import sum

from project import db, bcrypt




class Base(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)
    date_create = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime,
                              default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())


class User(db.Model):

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)


    def __init__(self, email, password, admin=False):
        self.email = email
        self.password = bcrypt.generate_password_hash(password)
        self.registered_on = datetime.datetime.now()
        self.admin = admin

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User {0}>'.format(self.email)


class Inventory_log(db.Model):
    __tablename__ = "inventory_log"

    id = db.Column(db.Integer, nullable=False, autoincrement=True, primary_key=True)
    item_id = db.Column(db.BigInteger, nullable=False)
    itemName = db.Column(db.String(255), nullable=False)
    clock_in = db.Column(db.DateTime, default=datetime.datetime.now(), nullable=False)

class Component(db.Model):
    __tablename__ = "component"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    itemName = db.Column(db.String(255), unique=True, nullable=False)
    itemModel = db.Column(db.String(255), nullable=False)
    itemPrice = db.Column(db.String(255), nullable = False)
    rfid_id = db.Column(db.BigInteger, nullable=False)
