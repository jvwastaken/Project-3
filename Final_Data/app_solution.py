import os
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy import create_engine, Column, Float, Text, inspect
from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################
# Use the absolute path to your uploaded database file
database_path = "/Users/stephenloucel/Desktop/DataClass/Classwork/Project-3/Final_Data/database.sqlite"
if not os.path.exists(database_path):
    raise FileNotFoundError(f"Database file does not exist at path: {database_path}")

engine = create_engine(f"sqlite:///{database_path}")
Base = declarative_base()
session = Session(bind=engine)

# Dynamically create SQLAlchemy models based on database tables
def create_model(table_name, inspector):
    columns = []
    
    # Define the primary keys for each table
    primary_key_map = {
        'covid_rate': 'state',
        'gun_sales': 'state',
        'us_population': 'state',
        'military_bases': 'site_name',
        'hospitals': 'id'
    }

    for column in inspector.get_columns(table_name):
        column_type = column['type']
        col = Column(column['name'], column_type, primary_key=(column['name'] == primary_key_map.get(table_name)))
        columns.append(col)

    return type(table_name, (Base,), {
        '__tablename__': table_name, 
        '__table_args__': {'extend_existing': True},
        **{col.name: col for col in columns}
    })

inspector = inspect(engine)
models = {table_name: create_model(table_name, inspector) for table_name in inspector.get_table_names()}

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    api_routes = [f"/api/v1.0/{table_name}" for table_name in models.keys()]
    return render_template('index.html', routes=api_routes)

# Define a function to create a route for each table
def create_route(table_name, model):
    endpoint = f"get_{table_name}_data"

    @app.route(f"/api/v1.0/{table_name}", endpoint=endpoint)
    def route_function():
        try:
            results = session.query(model).all()
            all_entries = [{column.name: getattr(result, column.name) for column in model.__table__.columns} for result in results]
            return jsonify(all_entries)
        except Exception as e:
            print(f"Error fetching data from {model.__tablename__}: {e}")
            return jsonify({"error": f"Error fetching data from {model.__tablename__}: {e}"}), 500

# Create routes for each table
for table_name, model in models.items():
    create_route(table_name, model)

if __name__ == '__main__':
    app.run(debug=True)
