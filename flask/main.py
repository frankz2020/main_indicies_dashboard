from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS  # Import CORS
import yfinance as yf
import os

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for the app

@app.route('/data/<ticker>', methods=['GET'])
def get_data(ticker):
    ticker_data = yf.Ticker(ticker)
    df = ticker_data.history(start="2022-01-01", interval="1d")
    try:
        name = ticker_data.info['longName']  # Fetch the long name
    except:
        name = ticker_data.info['shortName']  # Fetch the long name
    data = {
        "name": name,
        "prices": df.Close.reset_index().to_json(orient='records', date_format='iso')
    }
    print(jsonify(data))
    return jsonify(data)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=False)