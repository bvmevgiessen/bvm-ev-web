import os
import json
import datetime
import re
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
        if self.page_no() > 1:
            self.set_font('helvetica', 'B', 12)
            self.cell(0, 10, 'BVM e.V. Quartalsbericht', border=0, new_x='LMARGIN', new_y='NEXT', align='C')
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Seite {self.page_no()}', border=0, align='C')

def parse_date(date_string):
    """Parse common date formats to a datetime object."""
    try:
        return datetime.datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        try:
             # Basic fallback
             return datetime.date.today() - datetime.timedelta(days=10)
        except Exception:
             return datetime.date.today()

def filter_last_90_days(items, date_key='date'):
    """Filter items that are within the last 90 days."""
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
     return re.sub('<[^<]+?>', '', text)

def generate_ai_editorial(compiled_raw_content):
    """Generate the AI editorial using Gemini API."""
    prompt = f"Du bist der digitale Redakteur für den Verein BVM e.V. Schreibe ein herzliches, professionelles und motivierendes Vorwort (ca. 150-200 Wörter) für unseren vierteljährlichen Newsletter auf Deutsch. Basierend auf folgenden Themen, Blogbeiträgen und Events der letzten 3 Monate, fasse zusammen, worum es in dieser Ausgabe geht, und bedanke dich bei den Unterstützern:\n\n{compiled_raw_content}"
    
    fallback_text = "Liebe Leserin, lieber Leser,\n\nherzlich willkommen zu unserem neuesten Quartalsbericht. Auch in den vergangenen drei Monaten haben wir als BVM e.V. wieder viel bewegt und gemeinsam mit Ihnen zahlreiche Projekte umgesetzt. Unser Newsletter begleitet Sie durch die neuesten Blogbeiträge und gibt Ihnen einen Rückblick sowie Ausblick auf unsere Events in Gießen und Umgebung.\n\nWir danken Ihnen für Ihre treue Unterstützung und wünschen Ihnen viel Freude beim Lesen dieser Ausgabe.\n\nHerzliche Grüße,\nIhr Team des BVM e.V."

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Hinweis: GEMINI_API_KEY nicht gesetzt. Nutze Standard-Vorwort.")
        return fallback_text

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        if response.text:
            return response.text
        return fallback_text
    except Exception as e:
        print(f"Warnung: KI-Generierung fehlgeschlagen ({str(e)}). Nutze Standard-Vorwort.")
        return fallback_text

def main():
    print("Starte PDF-Generierung...")
    
    # 1. Load Data & Filter
    blog_posts = load_json_data(BLOG_FILE)
    events = load_json_data(EVENTS_FILE)
    
    recent_blogs = filter_last_90_days(blog_posts, 'date')
    recent_events = filter_last_90_days(events, 'date')
    
    # Compile raw content string for AI
    compiled_raw_content = ""
    if recent_blogs:
        compiled_raw_content += "Blogbeiträge:\n"
        for pb in recent_blogs:
            compiled_raw_content += f"- {pb.get('title')} ({pb.get('date')}): {strip_tags(pb.get('excerpt', ''))}\n"
    if recent_events:
        compiled_raw_content += "\nEvents:\n"
        for pe in recent_events:
             compiled_raw_content += f"- {pe.get('title')} am {pe.get('date')} ({pe.get('location')}): {strip_tags(pe.get('description', ''))}\n"

    # 2. Setup PDF Layout
    pdf = PDF()
    
    # ~~~ PAGE 1: The Editorial Cover ~~~
    pdf.add_page()
    
    pdf.set_font("helvetica", 'B', 24)
    # Important: fpdf2 handles unicode native
    pdf.cell(0, 15, "BVM e.V. - Quartalsbericht & Journal", border=0, new_x='LMARGIN', new_y='NEXT', align='C')
    
    current_date = datetime.date.today()
    quarter = (current_date.month - 1) // 3 + 1
    pdf.set_font("helvetica", 'I', 12)
    pdf.cell(0, 10, f"Ausgabe: Quartal {quarter} / {current_date.year} (Erstellt am: {current_date.strftime('%d.%m.%Y')})", border=0, new_x='LMARGIN', new_y='NEXT', align='C')
    
    pdf.ln(20)
    
    # Editorial Section
    editorial_text = generate_ai_editorial(compiled_raw_content)

    # Box for editorial
    pdf.set_font("helvetica", 'B', 16)
    pdf.cell(0, 10, "Editorial der Redaktion", border=0, new_x='LMARGIN', new_y='NEXT')
    pdf.ln(5)
    
    pdf.set_font("helvetica", size=12)
    pdf.multi_cell(0, 7, editorial_text)
    
    # ~~~ PAGE 2+: The Content Feed ~~~
    pdf.add_page()

    # Blog Section
    pdf.set_font("helvetica", 'B', 18)
    pdf.cell(0, 10, "Neueste Blogbeiträge", border=0, new_x='LMARGIN', new_y='NEXT')
    pdf.ln(5)
    
    if recent_blogs:
        for post in recent_blogs:
            pdf.set_font("helvetica", 'B', 14)
            title = post.get('title', 'Ohne Titel')
            pdf.cell(0, 10, title, border=0, new_x='LMARGIN', new_y='NEXT')
            
            pdf.set_font("helvetica", 'I', 11)
            date_str = post.get('date', '')
            pdf.cell(0, 6, date_str, border=0, new_x='LMARGIN', new_y='NEXT')
            
            pdf.set_font("helvetica", size=11)
            excerpt = strip_tags(post.get('excerpt', ''))
            pdf.multi_cell(0, 6, excerpt)
            
            # Divider
            pdf.ln(5)
            pdf.set_draw_color(200, 200, 200)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.w - pdf.get_x(), pdf.get_y())
            pdf.ln(5)
    else:
        pdf.set_font("helvetica", size=11)
        pdf.cell(0, 10, "Keine neuen Blogbeiträge in den letzten 90 Tagen.", border=0, new_x='LMARGIN', new_y='NEXT')
        pdf.ln(5)

    pdf.ln(10)

    # Events Section
    pdf.set_font("helvetica", 'B', 18)
    pdf.cell(0, 10, "Vergangene & Kommende Events", border=0, new_x='LMARGIN', new_y='NEXT')
    pdf.ln(5)

    if recent_events:
        for event in recent_events:
            pdf.set_font("helvetica", 'B', 14)
            title = event.get('title', 'Event')
            pdf.cell(0, 10, title, border=0, new_x='LMARGIN', new_y='NEXT')
            
            pdf.set_font("helvetica", 'I', 11)
            date_str = event.get('date', '')
            loc_str = event.get('location', '')
            pdf.cell(0, 6, f"{date_str} - {loc_str}", border=0, new_x='LMARGIN', new_y='NEXT')
            
            pdf.set_font("helvetica", size=11)
            desc = strip_tags(event.get('description', ''))
            pdf.multi_cell(0, 6, desc)
            
            # Divider
            pdf.ln(5)
            pdf.set_draw_color(200, 200, 200)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.w - pdf.get_x(), pdf.get_y())
            pdf.ln(5)
    else:
        pdf.set_font("helvetica", size=11)
        pdf.cell(0, 10, "Keine relevanten Events in den letzten 90 Tagen gefunden.", border=0, new_x='LMARGIN', new_y='NEXT')

    # Save PDF
    pdf.output(PDF_OUTPUT_PATH)
    print(f"PDF erfolgreich erstellt unter: {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    main()
