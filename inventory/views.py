# project/vendor/views.py

#################
#    imports    #
#################
import datetime
from flask import render_template, Blueprint, url_for, \
    redirect, flash, request

from flask.views import View

from flask_login import login_required

from project import db
from project.models import Component, Inventory_log
from project.inventory.forms import ComponentCreateForm

################
#    config    #
################

inventory_blueprint = Blueprint('inventory',
                                __name__,
                                template_folder='templates')

################
#    views     #
################



################
#    routes    #
################


import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

@inventory_blueprint.route('/component/create', methods=['GET', 'POST'])
@login_required
def create_component():
    form = ComponentCreateForm()
    if form.validate_on_submit():
        component = Component.query.filter_by(sku=form.sku.data).first()
        if component is None:
            id, text = reader.read()
            component = Component(sku=form.sku.data,
                                  description=form.description.data, 
                                  rfid_id= id)
            
            try:
                reader.write(form.description.data)
                print('tag written success')
            finally:
                GPIO.cleanup()
                
            db.session.add(component)
            db.session.commit()
            flash('New Component Added', 'success')
            return redirect(url_for('.view_component'))
    return render_template('/component/create.html', form=form)


@inventory_blueprint.route('/component/<int:component_id>', methods=['GET'])
@inventory_blueprint.route('/component/', methods=['GET'])
@login_required
def view_component(component_id=None):
    if component_id:
        component = Component.query.get_or_404(component_id)
        return render_template('component/view.html', result=component)
    component = Component.query.all()

    return render_template('/component/view_all.html', result=component)

@inventory_blueprint.route('/component/<int:component_id>', methods=['GET'])
@inventory_blueprint.route('/inventory/inventory_log/', methods=['GET', 'POST'])
@login_required
   
def view_log(component_id=None):    
    component = Inventory_log.query.all()
    if component_id:
        component = Component.query.get_or_404(component_id)
        return render_template('component/view.html', result=component)
    component = Component.query.all()

    return render_template('/component/view_all.html', result=component)

    try:
        while True:
            print('Place Card to\nrecord attendance')
            id, text = reader.read()

            result = db.session.execute("Select id FROM component WHERE rfid_id =" +str(id))
            if result:
                print(result)
                db.session.execute("insert into inventory_log (item_id) values (%s)", result)
        
      
            #db.session.execute(db.session"INSERT INTO inventory_log (item_id) VALUES (%s)" (result,) )
            db.session.commit()
            
                
    finally:
        GPIO.cleanup()
