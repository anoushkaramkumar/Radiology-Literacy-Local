# from googletrans import Translator
from llama_cpp import Llama
import csv
import time 

def analyze(llm, medical_problem, exam_type):
    prompt = '<s>[INST] <<SYS>>\nYou are a health literacy tool. Simplify this radiology finding at an 8th grade level. Be concise and do not use casual language.\n<</SYS>>\n\n' + medical_problem + ' [/INST]\n'
    output = llm(
      prompt,
      max_tokens=500, # Generate up to 500 tokens
      echo=False # Echo the prompt back in the output
    )

    output = output["choices"][0]["text"]
    
    # if (output_language!="en"):
    #     translator = Translator()
    #     translated_output = translator.translate(output, dest=output_language)
    #     return translated_output.text
    # else:
    return output

    
def term_lookup(llm, full_blurb, topic):

    prompt = f"I am a patient who was given medical terminology that I do not understand. Can you please explain what \"{topic}\" means at a 4th grade level in the context of \"{full_blurb}\"?"
    output = llm(
      prompt,
      max_tokens=500, # Generate up to 500 tokens
      echo=False # Echo the prompt back in the output
    )

    return output["choices"][0]["text"]