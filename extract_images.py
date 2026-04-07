import pypdf
import os

pdf_path = "LEBEN™ Fluted Panel.pdf"
output_dir = "pdf_images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found.")
else:
    try:
        reader = pypdf.PdfReader(pdf_path)
        img_count = 0
        for page_num, page in enumerate(reader.pages):
            for count, image_file_object in enumerate(page.images):
                with open(os.path.join(output_dir, f"p{page_num}_i{count}_{image_file_object.name}"), "wb") as fp:
                    fp.write(image_file_object.data)
                    img_count += 1
        print(f"Successfully extracted {img_count} images to {output_dir}")
    except Exception as e:
        print(f"Error: {e}")
