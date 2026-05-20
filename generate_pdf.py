import os
import json
import datetime
from fpdf import FPDF

# Constants
BLOG_FILE = "src/data/blog.json"
EVENTS_FILE = "src/data/events.json"
PDF_OUTPUT_DIR = "public/assets/pdf"
PDF_OUTPUT_PATH = os.path.join(PDF_OUTPUT_DIR, "newsletter-latest.pdf")

# Ensure output directory exists
os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

class PDF(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Title
        self.cell(0, 10, 'BVM e.V. Quartalsbericht', 0, 1, 'C')
        # Line break
        self.ln(10)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, f'Seite {self.page_no()}', 0, 0, 'C')

def parse_date(date_string):
    """Parse common date formats to a datetime object."""
    try:
        # Example: 2026-03-01
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        try:
             # Example: 13. Juni 2026 (Very basic parsing fallback, would need robust localization handle in real app)
             # Returning a safe date for now if parsing fails
             return datetime.date.today() - datetime.timedelta(days=10)
        except:
             return datetime.date.today()

def filter_last_90_days(items, date_key='date'):
    """Filter items that are within the last 90 days based on their date property."""
    recent_items = []
    ninety_days_ago = datetime.date.today() - datetime.timedelta(days=90)
    
    for item in items:
        item_date = parse_date(item.get(date_key, ''))
        if item_date >= ninety_days_ago:
            recent_items.append(item)
    return recent_items

def load_json_data(filepath):
    """Load JSON data from a file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: File not found {filepath}")
        return []

def strip_tags(text):
     """Simple method to strip html tags if they exist"""
     import re
     return re.sub('<[^<]+?>', '', text)

def main():
    print("Starte PDF-Generierung...")
    
    # Load data
    blog_posts = load_json_data(BLOG_FILE)
    events = load_json_data(EVENTS_FILE)
    
    # Filter latest
    recent_blogs = filter_last_90_days(blog_posts, 'date')
    recent_events = filter_last_90_days(events, 'date')
    
    # Create PDF
    pdf = PDF()
    pdf.add_page()
    
    # Fonts
    # Using Arial since utf-8 formatting might need custom fonts for FPDF, 
    # but strictly adhering to fpdf's core fonts for simplicity unless configured.
    # To handle german umlauts properly without installing extra TTF fonts, latin-1 encoding is often used internally.
    pdf.set_font("Arial", size=12)

    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, f"Aktuelles aus den letzten 3 Monaten", 0, 1)
    pdf.set_font("Arial", size=10)
    pdf.cell(0, 10, f"Erstellt am: {datetime.date.today().strftime('%d.%m.%Y')}", 0, 1)
    pdf.ln(5)

    # Blog Section
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, "Neueste Blogbeiträge", 0, 1)
    pdf.ln(5)
    
    if recent_blogs:
        for post in recent_blogs:
            pdf.set_font("Arial", 'B', 12)
            title = post.get('title', 'Ohne Titel').encode('latin-1', 'replace').decode('latin-1')
            pdf.cell(0, 10, title, 0, 1)
            
            pdf.set_font("Arial", 'I', 10)
            date_str = post.get('date', '').encode('latin-1', 'replace').decode('latin-1')
            pdf.cell(0, 6, date_str, 0, 1)
            
            pdf.set_font("Arial", size=11)
            excerpt = post.get('excerpt', '')
            excerpt = strip_tags(excerpt).encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 6, excerpt)
            pdf.ln(10)
    else:
        pdf.set_font("Arial", size=11)
        pdf.cell(0, 10, "Keine neuen Blogbeiträge in den letzten 90 Tagen.", 0, 1)
        pdf.ln(5)

    pdf.add_page()

    # Events Section
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, "Vergangene & Kommende Events", 0, 1)
    pdf.ln(5)

    if recent_events:
        for event in recent_events:
            pdf.set_font("Arial", 'B', 12)
            title = event.get('title', 'Event').encode('latin-1', 'replace').decode('latin-1')
            pdf.cell(0, 10, title, 0, 1)
            
            pdf.set_font("Arial", 'I', 10)
            date_str = event.get('date', '').encode('latin-1', 'replace').decode('latin-1')
            loc_str = event.get('location', '').encode('latin-1', 'replace').decode('latin-1')
            pdf.cell(0, 6, f"{date_str} - {loc_str}", 0, 1)
            
            pdf.set_font("Arial", size=11)
            desc = event.get('description', '')
            desc = strip_tags(desc).encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 6, desc)
            pdf.ln(10)
    else:
        pdf.set_font("Arial", size=11)
        pdf.cell(0, 10, "Keine relevanten Events in den letzten 90 Tagen gefunden.", 0, 1)

    # Save PDF
    pdf.output(PDF_OUTPUT_PATH)
    print(f"PDF erfolgreich erstellt unter: {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    main()
