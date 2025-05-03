# generate_pdf.py
import modal
from playwright.sync_api import sync_playwright

stub = modal.Stub("pdf-generator")

@stub.function()
def generate_pdf(url: str) -> bytes:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        pdf = page.pdf(format="A4", print_background=True)
        browser.close()
        return pdf
