from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
import numpy as np
import base64
import vertexai
import tempfile
import textwrap
from IPython.display import Markdown
from werkzeug.utils import secure_filename
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)


# Enable CORS for all routes
CORS(app, resources={
    r"/data-analysis": {"origins": "https://data-analysis-toolbot.vercel.app"},
    r"/sql-analysis": {"origins":"https://data-analysis-toolbot.vercel.app"},
    r"/visualization": {"origins":"https://data-analysis-toolbot.vercel.app"},
    r"/analysis-report": {"origins":"https://data-analysis-toolbot.vercel.app"},
    r"/data-insights": {"origins": "https://data-analysis-toolbot.vercel.app"}
})

os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")
client = Groq()

# gemini api key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# gemini model
model = genai.GenerativeModel("gemini-1.5-flash")


# only gemini text response
def get_response_gemini(input):
    # gemini response
    response = model.generate_content(input)
    return response.text


# only data insights text response using groq
def get_groq_response(input):
    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": input
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response = ""
    for chunk in completion:
        response += chunk.choices[0].delta.content or ""
    
    return response

    
# Markdown text function:
def markdown_text(text):
    text = text.replace('*', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _:True))


# Both vision and text response 
def generate_vision_response(input, img, prompt):
    response = model.generate_content([input, img[0], prompt],               
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

    if res:
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
            \n\n-----------\n Explain this Code snippet by list format:
            
            ```
            {res}
            ```
            \n\n-----------\nProvide with simplest and easy words of explanation:
            
            \n\n-----------\n
            1. 
            2.
            3.
            ...
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
Generate a Machine Learning code snippet or ML code snippet or a Statistical Analysis for the following text below as user prompts in the text_input field:

                ```
                {text_input}
                ```
                
                I just want only the Machine Learning code snippet or a Statistical Analysis code snippet or any ml model code snippet for the Project only.
            """
    res = get_groq_response(formatted_prompt)
    res = res.strip().lstrip("```python").rstrip("```")

    if res:


        expected_output = f"""
        what would be the expected response of this Code snippet:
            
            ```
            {res}
            ```
            Provide sample Response with no explanation
            """
        formatted_expected_output = expected_output.format(res=res)

        # updated expected output with the gemini response

        expected_output = get_groq_response(formatted_expected_output)

        explanation = f"""
            \n\n-----------\n Explain this Code snippet by list format:
            
            ```
            {res}
            ```
            \n\n-----------\nProvide with simplest and easy words of explanation:
            
            \n\n-----------\n
            
            1. 
            2.
            3.
            ...
"""

        formatted_explanation = explanation.format(res=res)

        # updated explanation

        explanation = get_groq_response(formatted_explanation)

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

    if res:

        # and ("sql" in text_input.lower() or "sql query" in text_input or 'data analysis' in text_input or 'sql project' in text_input or 'database project' in text_input or 'db' in text_input or 'SQL Database' in text_input.lower())

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
            \n\n-----------\n Explain this Code snippet by list format:
            
            ```
            {res}
            ```
            \n\n-----------\nProvide with simplest and easy words of explanation:
            
            \n\n-----------\n
            1. 
            2.
            3.
            ...
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

    if res:
        # and ("matplotlib" in text_input.lower() or "matplotlib" in text_input.capitalize() or "plotly" in text_input.lower() or "plotly" in text_input.capitalize() or "seaborn" in text_input.lower() or "seaborn" in text_input.capitalize() or 'data analysis' in text_input.lower() or 'project' in text_input or 'visualization' in text_input or 'plot' in text_input or 'data visualization' in text_input.lower() or "analysis" in text_input.lower())


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
            \n\n-----------\n Explain this Code snippet by list format:
            
            ```
            {res}
            ```
            \n\n-----------\nProvide with simplest and easy words of explanation:
            
            \n\n-----------\n
            1. 
            2.
            3.
            ...
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
            You're an expert data analyst. You're going to make a data analysis report for the following image and explain every line from that given image. Please follow the format below:

            -----------

            **Title of the image**

            -----------

            **Data Analysis Report**

            \n\n
            1. **Category**
                - Explanation here.

            \n\n
            2. **Cause**
                - Explanation here.

            3. **Month**
                - Explanation here.

            4. **Site**
                - Explanation here.

            5. **Trend**
                - Explanation here.
                - Explanation here.

            6. **Severity**
                
                - Explanation here.

            **Overall Observations:**

            - Explanation here.

            **Recommendations:**

            - Explanation here.
            - Explanation here.
            - Explanation here.
            

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
