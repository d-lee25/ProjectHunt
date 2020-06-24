# project/vendor/forms.py


from flask_wtf import FlaskForm as Form

from wtforms import TextField, SelectField, IntegerField, SubmitField, HiddenField
from wtforms.validators import DataRequired, URL, Optional, ValidationError
from ..models import Component


STATE_ABBREV = ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IO', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY')

class UniqueSku(object):
    def __init__(self, message=None):
        if not message:
            message = 'Sku must be unique. Component already exists with same Sku.'
        self.message = message
    def __call__(self, form, field):
        if Component.query.filter_by(sku=field.data).first():
            raise ValidationError(self.message)


class ComponentCreateForm(Form):
    sku = TextField('Sku', validators=[DataRequired(),UniqueSku()])
    description = TextField('Description', validators=[DataRequired()])


