import os
from flask import Flask, render_template, request, redirect, url_for, flash
from keras.models import load_model
from keras.preprocessing import image
import numpy as np

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure secret key
MODEL_PATH = os.path.join('model', 'trained.h5')
model = load_model(MODEL_PATH)

app.config['UPLOAD_FOLDER'] = 'static/uploads/'  

@app.route('/')
def home():
    return render_template('home.html')  # Home page description

@app.route('/analysis', methods=['GET'])
def analysis():
    return render_template('index.html')
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # Save the file to static/uploads folder
        uploads_dir = os.path.join(app.root_path, 'static/uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, file.filename)
        file.save(file_path)

        # Preprocess the image
        img = image.load_img(file_path, target_size=(300, 300))  # Ensure this matches your model input
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array /= 255.0  # Normalize the image

        # Make prediction
        predictions = model.predict(img_array)
        result = 'Pneumonia' if predictions[0][0] > 0.5 else 'No Pneumonia'

        # Create a relative path for the uploaded image to display
        uploaded_image_path = f"/static/uploads/{file.filename}"

        return render_template('index.html', prediction=result, uploaded_image=uploaded_image_path)  # Pass result and image path back to index.html
    else:  # Handle GET request to show the form
        return render_template('index.html')  # Show the prediction form

if __name__ == '__main__':
    app.run(debug=True)
