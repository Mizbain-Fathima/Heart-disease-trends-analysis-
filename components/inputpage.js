import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './inputpage.css';

function InputPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    chestPain: '',
    blood_pressure: '',
    cholesterol_level: '',
    Fasting_BS: '',
    exerciseAngina: '',
    Maximum_HR: '',
    oldpeak: '',
    st_slope: '',
    Resting_ECG: '',
    zscore_chol: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert form data to match the model's expected input
    const features = [
      parseFloat(formData.age),  // Age
      ['M', 'F'].indexOf(formData.gender),  // Gender index (0 for Male, 1 for Female)
      ['ASY', 'NAP', 'TA', 'ATA'].indexOf(formData.chestPain),  // Chest pain type index
      parseFloat(formData.blood_pressure),  // Resting Blood Pressure
      parseFloat(formData.cholesterol_level),  // Cholesterol Level
      formData.Fasting_BS === '1' ? 1 : 0,  // Fasting Blood Sugar (0 or 1)
      ['Normal', 'ST', 'LVH'].indexOf(formData.Resting_ECG),  // Resting ECG index
      ['N', 'Y'].indexOf(formData.exerciseAngina),  // Exercise Angina index
      parseFloat(formData.Maximum_HR),  // Maximum Heart Rate
      parseFloat(formData.oldpeak),  // Oldpeak
      ['Up', 'Flat', 'Down'].indexOf(formData.st_slope),  // ST Slope index
      parseFloat(formData.zscore_chol)  // Z-Score Cholesterol
    ];

    // Add error handling to ensure all required fields are filled in and contain valid data
    if (features.includes(NaN) || features.includes(-1) || features.includes(undefined)) {
      alert('Please fill in all required fields with valid data.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response was not ok:', errorText);
        alert('Error: Unable to submit the form. Please try again later.');
        return;
      }

      const result = await response.json();
      console.log('Result:', result);
      navigate('/result', { state: { result } });
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error: Unable to submit the form. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Heart Disease Trends</h1>
      <form id="healthForm" onSubmit={handleSubmit}>
        <label htmlFor="Age">Age:</label>
        <input
          type="number"
          id="Age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="Sex">Gender:</label>
        <select
          id="Sex"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select><br /><br />

        <label htmlFor="ChestPainType">Type of chest pain:</label>
        <select
          id="ChestPainType"
          name="chestPain"
          value={formData.chestPain}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="ASY">No pain</option>
          <option value="NAP">Mild pain</option>
          <option value="TA">Moderate pain</option>
          <option value="ATA">Severe pain</option>
        </select><br /><br />

        <label htmlFor="RestingBP">Resting Blood Pressure:</label>
        <input
          type="number"
          id="RestingBP"
          name="blood_pressure"
          value={formData.blood_pressure}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="Cholesterol">Cholesterol Level:</label>
        <input
          type="number"
          id="Cholesterol"
          name="cholesterol_level"
          value={formData.cholesterol_level}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="FastingBS">Fasting Blood Sugar level (higher than 120mg/dl?):</label>
        <select
          id="FastingBS"
          name="Fasting_BS"
          value={formData.Fasting_BS}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select><br /><br />

        <label htmlFor="RestingECG">Resting ECG:</label>
        <select
          id="RestingECG"
          name="Resting_ECG"
          value={formData.Resting_ECG}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="Normal">Normal</option>
          <option value="ST">Part of the heart's electrical signal is off</option>
          <option value="LVH">Heart's signals appear taller and more pronounced in certain parts of the graph</option>
        </select><br /><br />

        <label htmlFor="MaxHR">Maximum Heart Rate Achieved:</label>
        <input
          type="number"
          id="MaxHR"
          name="Maximum_HR"
          value={formData.Maximum_HR}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="ExerciseAngina">Exercise Induced Angina:</label>
        <select
          id="ExerciseAngina"
          name="exerciseAngina"
          value={formData.exerciseAngina}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select><br /><br />

        <label htmlFor="Oldpeak">Oldpeak:</label>
        <input
          type="number"
          step="0.1"
          id="Oldpeak"
          name="oldpeak"
          value={formData.oldpeak}
          onChange={handleChange}
          required
        /><br /><br />

        <label htmlFor="ST_Slope">ST Slope:</label>
        <select
          id="ST_Slope"
          name="st_slope"
          value={formData.st_slope}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select an option</option>
          <option value="Up">Up</option>
          <option value="Flat">Flat</option>
          <option value="Down">Down</option>
        </select><br /><br />

        <label htmlFor="zscore_chol">Z-Score Cholesterol:</label>
        <input
          type="number"
          id="zscore_chol"
          name="zscore_chol"
          value={formData.zscore_chol}
          onChange={handleChange}
          required
        /><br /><br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default InputPage;
