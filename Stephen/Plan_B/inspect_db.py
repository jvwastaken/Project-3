import os
from sqlalchemy import create_engine, MetaData

# Use the absolute path to your uploaded database file
database_path = "/Users/stephenloucel/Desktop/DataClass/Classwork/Project-3/Final_Data/database.sqlite"
engine = create_engine(f"sqlite:///{database_path}")

# Reflect the tables using MetaData
metadata = MetaData()
metadata.reflect(bind=engine)

# Print the structure of each table
for table_name in metadata.tables:
    print(f"Table: {table_name}")
    table = metadata.tables[table_name]
    for column in table.columns:
        print(f"  Column: {column.name} - {column.type}")
