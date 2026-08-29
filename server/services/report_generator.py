import xml.sax.saxutils as saxutils
from datetime import datetime, timezone
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


def generate_report(filename: str, sha256: str, status: str, output_path: str, storage_provider: str = "local"):
    """
    Generates a cryptographic verification report in PDF format with XML escaping.
    """
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()

    # Create custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=12,
    )
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=18,
    )
    body_style = styles['BodyText']

    elements = []

    safe_filename = saxutils.escape(str(filename))
    safe_sha256 = saxutils.escape(str(sha256))
    safe_status = saxutils.escape(str(status))
    safe_provider = saxutils.escape(str(storage_provider).upper())
    gen_time = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    elements.append(Paragraph("<b>SecureSentinel Security Operations</b>", title_style))
    elements.append(Paragraph("Cryptographic File Integrity Verification Report", subtitle_style))
    elements.append(Spacer(1, 10))

    status_color = colors.HexColor('#16a34a') if status == "Verified" else colors.HexColor('#dc2626')

    data = [
        [Paragraph("<b>Parameter</b>", body_style), Paragraph("<b>Value</b>", body_style)],
        [Paragraph("<b>File Name:</b>", body_style), Paragraph(safe_filename, body_style)],
        [Paragraph("<b>Integrity Status:</b>", body_style), Paragraph(f"<font color='{status_color.hexval()}'><b>{safe_status}</b></font>", body_style)],
        [Paragraph("<b>Storage Driver:</b>", body_style), Paragraph(safe_provider, body_style)],
        [Paragraph("<b>SHA-256 Checksum:</b>", body_style), Paragraph(f"<code>{safe_sha256}</code>", body_style)],
        [Paragraph("<b>Generated At:</b>", body_style), Paragraph(gen_time, body_style)],
    ]

    table = Table(data, colWidths=[140, 360])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(
        "<i>This automated report certifies the state of cryptographic hashing at the time of evaluation. Any alteration in bits produces an avalanche change in the SHA-256 fingerprint.</i>",
        styles['Italic']
    ))

    doc.build(elements)
