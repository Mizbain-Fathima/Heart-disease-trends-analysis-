from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Path to the model
model_path = r'C:\Users\Lenovo\HeartHealth\backend\models\heart_disease_pipeline_model.pkl'

# Load the model
with open(model_path, 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return "Welcome to the Heart Disease Prediction API!"

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_features = data.get('features')

        if not input_features or not isinstance(input_features, list):
            logging.error('Invalid input: Features data must be a list')
            return jsonify({'error': 'Invalid input, features data must be a list'}), 400

        # Ensure input_features is a list with the expected length
        if len(input_features) != 12:
            logging.error('Invalid input: Features list must contain 12 elements')
            return jsonify({'error': 'Invalid input, features list must contain 12 elements'}), 400

        # Convert categorical values to numerical values
        try:
            # Convert Sex
            if isinstance(input_features[1], str):
                input_features[1] = 1 if input_features[1] == 'M' else 0  # Sex
            
            # Convert ChestPainType
            if isinstance(input_features[2], str):
                chest_pain_mapping = ['ASY', 'NAP', 'TA', 'ATA']
                if input_features[2] not in chest_pain_mapping:
                    raise ValueError(f"Invalid ChestPainType: {input_features[2]}")
                input_features[2] = chest_pain_mapping.index(input_features[2])  # ChestPainType
            
            # Convert RestingECG
            if isinstance(input_features[6], str):
                ecg_mapping = ['Normal', 'ST', 'LVH']
                if input_features[6] not in ecg_mapping:
                    raise ValueError(f"Invalid RestingECG: {input_features[6]}")
                input_features[6] = ecg_mapping.index(input_features[6])  # RestingECG
            
            # Convert ExerciseAngina
            if isinstance(input_features[8], str):
                input_features[8] = 1 if input_features[8] == 'Y' else 0  # ExerciseAngina
            
            # Convert ST_Slope
            if isinstance(input_features[10], str):
                st_slope_mapping = ['Up', 'Flat', 'Down']
                if input_features[10] not in st_slope_mapping:
                    raise ValueError(f"Invalid ST_Slope: {input_features[10]}")
                input_features[10] = st_slope_mapping.index(input_features[10])  # ST_Slope

        except ValueError as e:
            logging.error(f"Invalid categorical value: {e}")
            return jsonify({'error': f"Invalid categorical value: {e}"}), 400

        # Create DataFrame with expected column names
        columns = ['Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol', 'FastingBS', 'RestingECG', 'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope', 'zscore_chol']
        input_df = pd.DataFrame([input_features], columns=columns)
        
        # Check for NaN values and handle them if necessary
        if input_df.isna().any().any():
            logging.error('Input data contains NaN values')
            return jsonify({'error': 'Input data contains NaN values'}), 400
        
        # Make prediction
        prediction = model.predict(input_df)
        prediction_proba = model.predict_proba(input_df)
        
        result = {
            'prediction': int(prediction[0]),
            'probability': prediction_proba[0].tolist()
        }
        
        return jsonify(result)
    except Exception as e:
        logging.error(f"An error occurred: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
