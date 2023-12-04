from flask import Flask, render_template, request, jsonify
import urllib.parse
from llama_cpp import Llama

import analyzer
# import spacy

import requests


app = Flask(__name__)

llm = Llama(model_path="./ggml-model-q4_0.gguf")

@app.route('/', methods=['GET', 'POST'])
def index(): 
    return render_template('index.html')

@app.route('/analyze', methods=['POST', 'GET'])
def analyze():
    result = ""
    if request.method == 'POST':
        medical_problem = request.form.get("medical_problem")
        exam_type = request.form.get("exam_type")

        result = analyzer.analyze(llm, medical_problem, exam_type)

    results = {'result': result}
    return jsonify(results)

@app.route('/about', methods=['GET', 'POST'])
def about():
    return render_template('about.html')

@app.route('/dictionary_lookup', methods=['POST', 'GET'])
def dictionary_lookup():
    if request.method == 'POST':
        topic = request.form.get("topic")
        full_blurb = request.form.get("full_blurb")
        return analyzer.term_lookup(llm, full_blurb, topic)

if __name__ == '__main__':
    app.run(debug=True)
