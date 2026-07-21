from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime


def generate_report(filename, sha256, status, output_path):
    styles = getSampleStyleSheet()

    doc = SimpleDocTemplate(output_path)

    elements = []

    elements.append(Paragraph("<b>SecureSentinel</b>", styles["Title"]))
    elements.append(Paragraph("File Verification Report", styles["Heading2"]))

    elements.append(Paragraph("<br/>", styles["BodyText"]))

    elements.append(
        Paragraph(f"<b>File Name:</b> {filename}", styles["BodyText"])
    )

    elements.append(
        Paragraph(f"<b>Status:</b> {status}", styles["BodyText"])
    )

    elements.append(
        Paragraph(f"<b>SHA-256:</b> {sha256}", styles["BodyText"])
    )

    elements.append(
        Paragraph(
            f"<b>Generated:</b> {datetime.now()}",
            styles["BodyText"],
        )
    )

    doc.build(elements)