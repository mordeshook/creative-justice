# download_pdf.py
import modal

stub = modal.App.lookup("pdf-generator")
generate_pdf = stub.functions["generate_pdf"]

URL = "https://nuveuu.com/export-print?id=YOUR_DRAFT_ID"
output_path = "brandbook.pdf"

print("⏳ Generating PDF via Modal...")
pdf = generate_pdf.remote(URL)

with open(output_path, "wb") as f:
    f.write(pdf)

print(f"✅ Saved to {output_path}")
