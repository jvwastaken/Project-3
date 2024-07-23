import sqlite3
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def get_table(table_name):
  conn = sqlite3.connect('project3.sqlite')
  conn.row_factory = sqlite3.Row
  db = conn.cursor()

  rows = db.execute(f"SELECT * FROM {table_name}").fetchall()

  conn.commit()
  conn.close()

  return [dict(row) for row in rows]

def link(url):
  return f"<a href={url}>{url}</a><br>"

@app.route("/")
def home():
  return (
    "Available Routes:<br>" +
    link("/api/v1.0/hospitals") +
    link("/api/v1.0/military_bases") + 
    link("/api/v1.0/us_population") + 
    link("/api/v1.0/gun_sales") + 
    link("/api/v1.0/covid_cases") +
    link("/api/v1.0/gun_geo")
  )

@app.route("/api/v1.0/gun_geo")
def gun_geo():
  return get_table("gun_geo")

@app.route("/api/v1.0/hospitals")
def hospitals():
  return get_table("hospitals")

@app.route("/api/v1.0/military_bases")
def military_bases():
  return get_table("military_bases")

@app.route("/api/v1.0/us_population")
def us_population():
  return get_table("us_population")

@app.route("/api/v1.0/gun_sales")
def gun_sales():
  return get_table("gun_sales")

@app.route("/api/v1.0/covid_cases")
def covid_cases():
  return get_table("covid_cases")

if __name__ == '__main__':
  app.run(debug=True)