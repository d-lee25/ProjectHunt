# project/vendor/forms.py


from flask_wtf import FlaskForm as Form

from wtforms import TextField, SelectField, IntegerField, SubmitField, HiddenField
from wtforms.validators import DataRequired, URL, Optional, ValidationError
from ..models import Component



class UniqueItemName(object):
    def __init__(self, message=None):
        if not message:
            message = 'Name must be unique. Component already exists with same Name.'
        self.message = message
    def __call__(self, form, field):
        if Component.query.filter_by(itemName=field.data).first():
            raise ValidationError(self.message)


class ComponentCreateForm(Form):
    itemName = TextField('ItemName', validators=[DataRequired(),UniqueItemName()])
    itemModel = TextField('ItemModel', validators=[DataRequired()])
    itemPrice = TextField('ItemPrice', validators=[DataRequired()])

class InventoryLogForm(Form):
    item_id = input('ItemId', validators=[DataRequired()])
    itemName = input('ItemName', validators=[DataRequired()])
