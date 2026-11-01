from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).parent / "assets"
ROOT.mkdir(parents=True, exist_ok=True)

NAVY = "#15263C"
BLUE = "#2563EB"
CYAN = "#22D3EE"
PALE = "#EFF6FF"
WHITE = "#FFFFFF"
SLATE = "#475569"
RED = "#DC2626"
AMBER = "#D97706"


def font(size, bold=False):
    name = "Arial Bold.ttf" if bold else "Arial.ttf"
    try:
        return ImageFont.truetype(name, size)
    except OSError:
        return ImageFont.load_default()


def icon():
    image = Image.new("RGB", (180, 180), WHITE)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((18, 18, 162, 162), radius=34, fill=NAVY)
    draw.line((50, 54, 50, 128), fill=CYAN, width=10)
    draw.line((50, 128, 130, 128), fill=CYAN, width=10)
    draw.line((64, 109, 87, 83, 106, 96, 134, 55), fill=WHITE, width=11, joint="curve")
    image.save(ROOT / "icon-180.png")


def thumbnail():
    image = Image.new("RGB", (740, 340), PALE)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((32, 32, 708, 308), radius=28, fill=NAVY)
    draw.text((72, 76), "PIPELINE", font=font(30, True), fill=CYAN)
    draw.text((72, 115), "HYGIENE", font=font(58, True), fill=WHITE)
    draw.text((74, 190), "Daily evidence for neglected deals", font=font(25), fill=WHITE)
    draw.rounded_rectangle((74, 242, 314, 282), radius=20, fill=BLUE)
    draw.text((98, 251), "Disabled until tested", font=font(18, True), fill=WHITE)
    draw.line((490, 100, 490, 245), fill=CYAN, width=12)
    draw.line((490, 245, 650, 245), fill=CYAN, width=12)
    draw.line((515, 210, 555, 166, 595, 187, 650, 112), fill=WHITE, width=15, joint="curve")
    image.save(ROOT / "thumbnail-740x340.png")


def screenshot():
    image = Image.new("RGB", (1440, 900), "#E2E8F0")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((100, 75, 1340, 825), radius=24, fill=WHITE)
    draw.rectangle((100, 75, 1340, 165), fill=NAVY)
    draw.text((145, 105), "Pipeline hygiene digest", font=font(34, True), fill=WHITE)
    draw.text((145, 205), "Sample digest with synthetic data", font=font(22, True), fill=BLUE)
    draw.text((145, 246), "Three open deals need attention.", font=font(22), fill=SLATE)
    columns = [145, 530, 760, 975]
    headers = ["Deal", "Stage", "Closing date", "Reasons"]
    draw.rounded_rectangle((135, 305, 1305, 365), radius=10, fill=PALE)
    for x, label in zip(columns, headers):
        draw.text((x, 322), label, font=font(20, True), fill=NAVY)
    rows = [
        ("Synthetic North", "Negotiation", "2026-10-20", "Closing date is overdue", RED),
        ("Synthetic South", "Proposal", "2026-11-14", "Next step is missing", AMBER),
        ("Synthetic West", "Qualification", "2026-11-30", "No open activity", BLUE),
    ]
    y = 390
    for deal, stage, close, reason, color in rows:
        draw.line((135, y + 65, 1305, y + 65), fill="#CBD5E1", width=2)
        draw.text((columns[0], y + 18), deal, font=font(20, True), fill=NAVY)
        draw.text((columns[1], y + 18), stage, font=font(20), fill=SLATE)
        draw.text((columns[2], y + 18), close, font=font(20), fill=SLATE)
        draw.text((columns[3], y + 18), reason, font=font(18, True), fill=color)
        y += 105
    draw.rounded_rectangle((145, 730, 510, 780), radius=24, fill=BLUE)
    draw.text((178, 742), "Open the Deal in Zoho CRM", font=font(19, True), fill=WHITE)
    image.save(ROOT / "screenshot-1-digest.png")


icon()
thumbnail()
screenshot()
