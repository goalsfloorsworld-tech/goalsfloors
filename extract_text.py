import pypdf
import os

pdf_path = "LEBEN™ Fluted Panel.pdf"
output_path = "extracted_pdf_text.txt"

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found.")
else:
    try:
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            full_text += page.extract_text() + "\n--- PAGE BREAK ---\n"
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error: {e}")
