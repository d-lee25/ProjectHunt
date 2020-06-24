#!/usr/bin/env python
import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import mysql.connector


db = mysql.connector.connect(
  host="localhost",
  user="projecthunt",
  passwd="password",
  database="inventory"
)

cursor = db.cursor(buffered=True)
reader = SimpleMFRC522()


try:
  while True:
   
    print('Place Card to\nrecord attendance')
    id, text = reader.read()

    cursor.execute("Select id, description FROM component WHERE rfid_id="+str(id))
    result = cursor.fetchone()
    print(result[0])

    

    if cursor.rowcount >= 1:
      print("Welcome " + result[1])
      
      cursor.execute("INSERT INTO inventory_log (item_id, item_name) VALUES (%s, %s)", (result[0],result[1]) )
      db.commit()
    else:
      print("User does not exist.")
    time.sleep(1)
finally:
  GPIO.cleanup()

