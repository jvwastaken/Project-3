from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/api/v1.0/covid_cases', methods=['GET'])
def get_covid_cases():
    # Load the data
    df = pd.read_csv('/path/to/clean_covid_cases.csv')
    
    # Convert DataFrame to dictionary
    data = df.to_dict(orient='records')
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
