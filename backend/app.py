from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import numpy as np
import base64
from vertexai.preview.generative_models import Part
import vertexai
import tempfile
import io
from werkzeug.utils import secure_filename
from pathlib import Path

load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/data-analysis": {"origins": "https://data-analysis-toolbot-qqghegubv-crocmons-projects.vercel.app"},
    r"/sql-analysis": {"origins":"https://data-analysis-toolbot-qqghegubv-crocmons-projects.vercel.app"},
    r"/visualization": {"origins":"https://data-analysis-toolbot-qqghegubv-crocmons-projects.vercel.app"},
    r"/analysis-report": {"origins":"https://data-analysis-toolbot-qqghegubv-crocmons-projects.vercel.app"},
    r"/data-insights": {"origins": "https://data-analysis-toolbot-qqghegubv-crocmons-projects.vercel.app"}
})

 
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


model = genai.GenerativeModel("gemini-pro")

vision_model = genai.GenerativeModel("gemini-pro-vision")


# only text response
def get_response_gemini(input):
    response = model.generate_content(input)
    return response.text


# Both vision and text response 
def generate_vision_response(input, img, prompt):
    response = vision_model.generate_content([input, img[0], prompt],               
         )
    return response.text



# image setup for vision model
def image_setup(uploaded_file):
    img = Path(uploaded_file)

    if not img.exists():
        raise FileNotFoundError(f"File {img} does not exist")
    
    img_parts = [
        {
            "mime_type": "image/png",
            "data":img.read_bytes()
            
        }
    ]
    return img_parts


### working future functions but not implemented yet ---
# -----------------#--------#-----------------

# def upload_img_to_gcs(uploaded_file):
#     bucket = client.bucket(BUCKET_NAME)
#     blob = bucket.blob(uploaded_file.filename)
#     blob.upload_from_string(
#         uploaded_file.read(),
#         content_type = uploaded_file.content_type
#         ) 
#     return f"gs://{BUCKET_NAME}/{uploaded_file.filename}"


# def is_data_analysis_image(image):
#     img_array = np.array(image)
#     """
#     Analyzes an image to determine if it likely contains data visualization elements.

#     Args:
#         image: The image to be analyzed (preferably in RGB format).

#     Returns:
#         True if the image likely contains data visualization, False otherwise.
#     """

#     # Convert image to grayscale for simpler analysis
#     gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)

#     # Check for presence of lines and charts using adaptive thresholding
#     thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2)  # Adjust parameters if needed
#     num_lines = cv2.countNonZero(thresh)

#     # Check for color gradients (often used in heatmaps)
#     hsv = cv2.cvtColor(img_array, cv2.COLOR_BGR2HSV)
#     saturation = hsv[:, :, 1]
#     num_bright_pixels = cv2.countNonZero(saturation > 128)  # Adjust threshold

#     # Combine checks with weights based on importance (adjust as needed)
#     data_analysis_score = 0.6 * (num_lines / (gray.shape[0] * gray.shape[1])) + 0.4 * (num_bright_pixels / (img_array.shape[0] * img_array.shape[1]))

#     # Set a threshold for desired sensitivity (adjust as needed)
#     return data_analysis_score > 0.5

# -----------------#-----------------#




# All APi Routes

@app.route("/data-analysis", methods=["POST"])
def data_analysis_code():
    data = request.json
    text_input = data.get("text_input", "")
    formatted_prompt = f"""
        Generate a Pandas or Numpy Code snippet for the following text below as user prompts in the text_input field:

        ```
        {text_input}
        ```

        You will only provide a Pandas or Numpy code snippet based on the text_input provided, Do not give any wrong answer if it's not a pandas or numpy code.
    """
    res = get_response_gemini(formatted_prompt)
    res = res.strip().lstrip("```python").rstrip("```")

    if res and ("pandas" in text_input.lower() or "pandas" in text_input.capitalize() or "numpy" in text_input.lower() or "numpy" in text_input.capitalize() or 'data analysis' in text_input or 'project' in text_input):
        expected_output = f"""
            what would be the expected response of this Code snippet:
            
            ```
            {res}
            ```
            Provide sample Response with no explanation
        """
        formatted_expected_output = expected_output.format(res=res)
        expected_output = get_response_gemini(formatted_expected_output)

        explanation = f"""
            Explain this Code snippet:
            
            ```
            {res}
            ```
            Provide with simplest and easy words of explanation:
        """
        formatted_explanation = explanation.format(res=res)
        explanation = get_response_gemini(formatted_explanation)

        return jsonify({
            "code_snippet": res,
            "expected_output": expected_output,
            "explanation": explanation
        })
    else:
        return jsonify({"error": "I am specifically designed for the Data Analysis topic. Please feel free to ask me any questions related to Pandas or Numpy in this input field."})


@app.route('/data-insights', methods=["POST"])
def data_insights():
    data = request.json
    text_input = data.get("text_input", "")
    formatted_prompt = f"""
Generate a Machine Learning code snippet or a Statistical Analysis for the following text below:

                ```
                {text_input}
                ```
                
                I just want only the Machine Learning code snippet or a Statistical Analysis code snippet for any Data Analysis Project only.
            """
    res = get_response_gemini(formatted_prompt)
    res = res.strip().lstrip("```python").rstrip("```")

    if res and ("Machine Learning" in text_input.lower() or "Statistical Analysis" in text_input.lower() or "ML" in text_input.lower() or 'data analysis' in text_input or 'project' in text_input or 'data insights' in text_input):
        expected_output = f"""
        what would be the expected response of this Code snippet:
            
            ```
            {res}
            ```
            Provide sample Response with no explanation
            """
        formatted_expected_output = expected_output.format(res=res)

        # updated expected output with the gemini response

        expected_output = get_response_gemini(formatted_expected_output)

        explanation = f"""
        Explain this Code snippet:
            
            ```
            {res}
            ```
            Provide with simplest and easy words of explanation:
        """

        formatted_explanation = explanation.format(res=res)

        # updated explanation

        explanation = get_response_gemini(formatted_explanation)

        return jsonify({
            "code_snippet": res,
            "expected_output": expected_output,
            "explanation":explanation
        })
    else:
        return jsonify({
            "error":"I am specifically designed for the Data Analysis topic. Please feel free to ask me any questions related to Machine Learning or Statistical Analysis within this tab input field."
        })



@app.route('/sql-analysis', methods=["POST"])
def sql_analysis():
    data = request.json
    text_input = data.get("text_input", "")
    formatted_prompt = f"""
Generate a SQL query snippet for the following text below:

                ```
                {text_input}
                ```
                
                I just want only the sql query here for Data Analysis.
            """
    res = get_response_gemini(formatted_prompt)
    res = res.strip().lstrip("```python").rstrip("```")

    if res and ("sql" in text_input.lower() or "sql query" in text_input.capitalize() or 'data analysis' in text_input or 'sql project' in text_input or 'database project' in text_input or 'db' in text_input or 'SQL Database' in text_input.lower()):
        expected_output = f"""
        what would be the expected response of the sql query snippet:
                
                ```
                {res}
                ```
                Provide sample tabular Response with no explanation
            """
        formatted_expected_output = expected_output.format(res=res)

        # updated expected output with the gemini response

        expected_output = get_response_gemini(formatted_expected_output)

        explanation = f"""
        Explain this SQL Query:
            
            ```
            {res}
            ```
            Provide with simplest and easy words of explanation:
        """

        formatted_explanation = explanation.format(res=res)

        # updated explanation

        explanation = get_response_gemini(formatted_explanation)

        return jsonify({
            "code_snippet": res,
            "expected_output": expected_output,
            "explanation":explanation
        })
    else:
        return jsonify({
            "error":"I am specifically designed for the Data Analysis topic. Please feel free to ask me any questions related to the SQL Database or SQL Query for your Data Analysis Project."
        })


@app.route('/visualization', methods=["POST"])
def visualization():
    data = request.json
    text_input = data.get("text_input", "")
    formatted_prompt = f"""
Generate a Data Visualization Code snippet for the following text below:

                ```
                {text_input}
                ```
                
                I just want only the Data Visualization Code snippet using different libraries like Matplotlib or Plotly or Seaborn based on the text_input. 
            """
    res = get_response_gemini(formatted_prompt)
    res = res.strip().lstrip("```python").rstrip("```")

    if res and ("Matplotlib" in text_input.lower() or "matplotlib" in text_input.capitalize() or "Plotly" in text_input.lower() or "plotly" in text_input.capitalize() or "Seaborn" in text_input.lower() or "seaborn" in text_input.capitalize() or 'Data Analysis' in text_input.lower() or 'project' in text_input or 'visualization' in text_input or 'plot' in text_input or 'Data Visualization' in text_input.lower() or "Analysis" in text_input.lower()):

        expected_output = f"""
        what would be the expected response of this Data Visualization Code snippet:
                
                ```
                {res}
                ```
                Provide sample Response with no explanation
            """
        formatted_expected_output = expected_output.format(res=res)

        # updated expected output with the gemini response

        expected_output = get_response_gemini(formatted_expected_output)

        explanation = f"""
        Explain this Data Visualization Code snippet:
                
                ```
                {res}
                ```
                Provide with simplest and easy words of explanation:
        """

        formatted_explanation = explanation.format(res=res)

        # updated explanation

        explanation = get_response_gemini(formatted_explanation)

        return jsonify({
            "code_snippet": res,
            "expected_output": expected_output,
            "explanation":explanation
        })
    else:
        return jsonify({
            "error":"I am specifically designed for the Data Analysis Task. Please feel free to ask me any questions related to Data Visualization topic including (Matplotlib or Plotly or Seaborn) for your Data Analysis Project."
        })



@app.route('/analysis-report', methods=['POST'])
def analysis_report():
    try:
        text_input = request.form.get("text_input", "")
        uploaded_file = request.files.get('uploaded_file')
        prompt = """
            You're an expert data analyst. You're going to make a data analysis Report for the following image and explain every graph from that given image. By following the below format -
            
            Title of the image

            Data Analysis Report in Details

        """

        if uploaded_file:
            # Save the uploaded file to a temporary directory
            filename = secure_filename(uploaded_file.filename)
            # Define the upload directory
            upload_dir = tempfile.mkdtemp()  # Update with your desired directory name
            # Ensure the upload directory exists
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            # Save the file
            file_path = os.path.join(upload_dir, filename)
            uploaded_file.save(file_path)
            # Pass the file path to image_setup function
            img_data = image_setup(file_path)
            if img_data:
                # Generate vision response
                response = generate_vision_response(text_input, img_data, prompt)
                print('File uploaded successfully!')
                return jsonify({'response': response})
            else:
                return jsonify({'error': 'Failed to convert file to data'}), 500
        else:
            return jsonify({'error': 'No file uploaded'})
    except Exception as e:
        print(f'Error uploading file: {e}')
        return jsonify({'error': f'Failed to upload file: {str(e)}'}), 500

# --------#####-------#
# only for development purpose

# if __name__ == "__main__":
#     app.run(debug=True)
