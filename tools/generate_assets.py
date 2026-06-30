#!/usr/bin/env python3
"""HD cute-style asset generator for Bubble Puppy.

Outputs 128x128 (or scaled) PNGs into client/assets/.
Run from repo root: python tools/generate_assets.py
"""
import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).resolve().parent.parent / "client" / "assets"

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def save(img, rel_path):
    path = OUT_DIR / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(f"  {path}")


def new_image(size, color=(0, 0, 0, 0)):
    return Image.new("RGBA", size, color)


def draw_circle(draw, xy, radius, fill, outline=None, width=2):
    x, y = xy
    draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=fill, outline=outline, width=width)


def radial_gradient(size, center_color, edge_color):
    """Return a radial gradient image."""
    img = Image.new("RGBA", size, edge_color)
    cx, cy = size[0] // 2, size[1] // 2
    max_r = math.hypot(cx, cy)
    for y in range(size[1]):
        for x in range(size[0]):
            r = math.hypot(x - cx, y - cy) / max_r
            r = min(1.0, r)
            pix = tuple(int(center_color[i] + (edge_color[i] - center_color[i]) * r) for i in range(4))
            img.putpixel((x, y), pix)
    return img


def overlay_gradient_circle(base, xy, radius, center, edge):
    """Overlay a soft radial gradient circle onto base image."""
    grad = radial_gradient((radius * 2, radius * 2), center, edge)
    mask = Image.new("L", (radius * 2, radius * 2), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, radius * 2, radius * 2], fill=255)
    base.paste(grad, (xy[0] - radius, xy[1] - radius), mask)


def cute_eye(draw, xy, size=10, pupil_size=4):
    x, y = xy
    draw.ellipse([x - size, y - size, x + size, y + size], fill=(255, 255, 255, 240), outline=(40, 40, 40, 200), width=2)
    draw.ellipse([x - pupil_size, y - pupil_size + 1, x + pupil_size, y + pupil_size + 1], fill=(40, 40, 40, 255))
    draw.ellipse([x - pupil_size // 2 - 1, y - pupil_size // 2 - 2, x + 1, y + 2], fill=(255, 255, 255, 220))


def cute_blush(draw, xy, radius=8):
    draw.ellipse([xy[0] - radius, xy[1] - radius // 2, xy[0] + radius, xy[1] + radius // 2], fill=(255, 160, 180, 140))


def rounded_rect(draw, xyxy, radius, fill, outline=None, width=2):
    draw.rounded_rectangle(xyxy, radius=radius, fill=fill, outline=outline, width=width)


# -----------------------------------------------------------------------------
# Characters (4-frame spritesheets: idle, run, jump, blow)
# -----------------------------------------------------------------------------
def draw_puppy_frame(draw, size, body_color, accessory_color, accessory_type, ear_type, frame_idx):
    """Draw a single 128x128 puppy frame.

    accessory_type: 'collar' | 'bow'
    ear_type: 'flop_left' | 'upright' | 'flop_both'
    frame_idx: 0=idle, 1=run, 2=jump, 3=blow
    """
    w, h = size
    cx, cy = w // 2, h // 2 + 8

    # body bounce offsets
    bounce = {0: 0, 1: (frame_idx % 2) * 4 - 2, 2: -6, 3: 0}[frame_idx]
    body_y = cy + bounce

    # shadow
    draw.ellipse([cx - 36, h - 18, cx + 36, h - 6], fill=(0, 0, 0, 40))

    # ears
    ear_col = tuple(max(0, c - 15) for c in body_color[:3]) + (255,)
    if ear_type in ('flop_left', 'flop_both'):
        # left ear floppy
        draw.polygon([(cx - 32, body_y - 28), (cx - 46, body_y - 4), (cx - 24, body_y - 8)], fill=ear_col, outline=(50, 50, 50, 180), width=2)
    if ear_type in ('upright', 'flop_both'):
        # right ear upright
        draw.polygon([(cx + 28, body_y - 32), (cx + 44, body_y - 4), (cx + 18, body_y - 8)], fill=ear_col, outline=(50, 50, 50, 180), width=2)

    # body (fluffy cloud shape) - lighter shading
    for r in range(40, 0, -2):
        ratio = r / 40
        # slight shading toward edges, but keep base color bright
        shade = int(12 * ratio)
        col = tuple(max(0, body_color[i] - shade) for i in range(3)) + (255,)
        draw.ellipse([cx - r, body_y - r, cx + r, body_y + r], fill=col)
    # outline
    draw.ellipse([cx - 40, body_y - 40, cx + 40, body_y + 40], outline=(60, 60, 60, 180), width=2)

    # legs
    leg_col = tuple(max(0, c - 20) for c in body_color[:3]) + (255,)
    leg_offset = {0: 0, 1: (frame_idx % 2) * 8 - 4, 2: -3, 3: 0}[frame_idx]
    draw.ellipse([cx - 22 + leg_offset, body_y + 28, cx - 8 + leg_offset, body_y + 48], fill=leg_col, outline=(60, 60, 60, 180), width=2)
    draw.ellipse([cx + 8 - leg_offset, body_y + 28, cx + 22 - leg_offset, body_y + 48], fill=leg_col, outline=(60, 60, 60, 180), width=2)

    # face
    cute_eye(draw, (cx - 14, body_y - 8), size=11, pupil_size=5)
    cute_eye(draw, (cx + 14, body_y - 8), size=11, pupil_size=5)
    cute_blush(draw, (cx - 24, body_y + 4))
    cute_blush(draw, (cx + 24, body_y + 4))
    # nose
    draw.ellipse([cx - 4, body_y + 2, cx + 4, body_y + 10], fill=(255, 120, 150, 255), outline=(60, 60, 60, 180), width=1)
    # mouth
    draw.arc([cx - 8, body_y + 6, cx + 8, body_y + 18], 0, 180, fill=(60, 60, 60, 200), width=2)

    # accessory
    if accessory_type == 'collar':
        draw.arc([cx - 28, body_y + 12, cx + 28, body_y + 40], 0, 180, fill=accessory_color, width=6)
        draw.ellipse([cx - 5, body_y + 28, cx + 5, body_y + 38], fill=(255, 200, 0, 255), outline=(60, 60, 60, 180), width=1)
    elif accessory_type == 'bow':
        # bow on right ear
        bx, by = cx + 34, body_y - 32
        draw.ellipse([bx - 10, by - 6, bx, by + 6], fill=accessory_color, outline=(60, 60, 60, 180), width=2)
        draw.ellipse([bx, by - 6, bx + 10, by + 6], fill=accessory_color, outline=(60, 60, 60, 180), width=2)
        draw.ellipse([bx - 3, by - 3, bx + 3, by + 3], fill=(255, 255, 255, 200), outline=(60, 60, 60, 180), width=1)


def make_puppy_spritesheet(name, body_color, accessory_color, accessory_type, ear_type):
    """Create a 512x128 spritesheet with 4 frames."""
    img = new_image((512, 128))
    draw = ImageDraw.Draw(img)
    for i in range(4):
        frame = new_image((128, 128))
        draw_puppy_frame(ImageDraw.Draw(frame), (128, 128), body_color, accessory_color, accessory_type, ear_type, i)
        img.paste(frame, (i * 128, 0))
    save(img, f"sprites/{name}.png")


# -----------------------------------------------------------------------------
# Enemies (single 128x128 frames)
# -----------------------------------------------------------------------------
def make_enemy_cat():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 70
    # body
    for r in range(48, 0, -2):
        ratio = r / 48
        col = (int(180 + 20 * ratio), int(180 + 20 * ratio), int(180 + 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 8, cx + r, cy + r + 8], fill=col)
    d.ellipse([cx - 48, cy - 40, cx + 48, cy + 56], outline=(60, 60, 60, 200), width=3)
    # ears
    d.polygon([(cx - 38, cy - 24), (cx - 52, cy - 56), (cx - 16, cy - 36)], fill=(160, 160, 160, 255), outline=(60, 60, 60, 200), width=2)
    d.polygon([(cx + 38, cy - 24), (cx + 52, cy - 56), (cx + 16, cy - 36)], fill=(160, 160, 160, 255), outline=(60, 60, 60, 200), width=2)
    cute_eye(d, (cx - 18, cy - 8), size=13, pupil_size=5)
    cute_eye(d, (cx + 18, cy - 8), size=13, pupil_size=5)
    d.ellipse([cx - 5, cy + 4, cx + 5, cy + 14], fill=(255, 120, 150, 255), outline=(60, 60, 60, 180), width=1)
    # whiskers
    d.line([(cx - 30, cy + 6), (cx - 52, cy + 2)], fill=(80, 80, 80, 200), width=2)
    d.line([(cx - 30, cy + 12), (cx - 52, cy + 16)], fill=(80, 80, 80, 200), width=2)
    d.line([(cx + 30, cy + 6), (cx + 52, cy + 2)], fill=(80, 80, 80, 200), width=2)
    d.line([(cx + 30, cy + 12), (cx + 52, cy + 16)], fill=(80, 80, 80, 200), width=2)
    # paws
    d.ellipse([cx - 28, cy + 44, cx - 10, cy + 64], fill=(150, 150, 150, 255), outline=(60, 60, 60, 180), width=2)
    d.ellipse([cx + 10, cy + 44, cx + 28, cy + 64], fill=(150, 150, 150, 255), outline=(60, 60, 60, 180), width=2)
    # tail
    d.ellipse([cx + 42, cy + 20, cx + 64, cy + 40], fill=(170, 170, 170, 255), outline=(60, 60, 60, 180), width=2)
    save(img, "sprites/enemy_cat.png")


def make_enemy_squirrel():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 56, 72
    # tail
    for r in range(36, 0, -2):
        ratio = r / 36
        col = (int(190 - 20 * ratio), int(160 - 20 * ratio), int(140 - 20 * ratio), 255)
        d.ellipse([cx + 28, cy - 44 + int(ratio * 10), cx + 68, cy + 16 + int(ratio * 10)], fill=col)
    d.ellipse([cx + 28, cy - 40, cx + 70, cy + 20], outline=(80, 60, 50, 200), width=3)
    # body
    for r in range(38, 0, -2):
        ratio = r / 38
        col = (int(200 - 20 * ratio), int(170 - 20 * ratio), int(150 - 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 38, cy - 32, cx + 38, cy + 44], outline=(80, 60, 50, 200), width=3)
    # head
    d.ellipse([cx - 22, cy - 44, cx + 22, cy - 8], fill=(210, 180, 160, 255), outline=(80, 60, 50, 200), width=2)
    # ears
    d.polygon([(cx - 16, cy - 40), (cx - 24, cy - 60), (cx - 4, cy - 48)], fill=(190, 160, 140, 255), outline=(80, 60, 50, 200), width=2)
    d.polygon([(cx + 16, cy - 40), (cx + 24, cy - 60), (cx + 4, cy - 48)], fill=(190, 160, 140, 255), outline=(80, 60, 50, 200), width=2)
    cute_eye(d, (cx - 10, cy - 28), size=10, pupil_size=4)
    cute_eye(d, (cx + 10, cy - 28), size=10, pupil_size=4)
    d.ellipse([cx - 4, cy - 16, cx + 4, cy - 8], fill=(120, 80, 70, 255), outline=(80, 60, 50, 200), width=1)
    # paws
    d.ellipse([cx - 22, cy + 36, cx - 6, cy + 54], fill=(180, 150, 130, 255), outline=(80, 60, 50, 180), width=2)
    d.ellipse([cx + 6, cy + 36, cx + 22, cy + 54], fill=(180, 150, 130, 255), outline=(80, 60, 50, 180), width=2)
    save(img, "sprites/enemy_squirrel.png")


def make_enemy_owl():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 68
    # body
    for r in range(46, 0, -2):
        ratio = r / 46
        col = (int(220 - 30 * ratio), int(180 - 30 * ratio), int(230 - 30 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 46, cy - 40, cx + 46, cy + 52], outline=(80, 60, 90, 200), width=3)
    # ears
    d.polygon([(cx - 30, cy - 28), (cx - 44, cy - 56), (cx - 12, cy - 36)], fill=(200, 160, 210, 255), outline=(80, 60, 90, 200), width=2)
    d.polygon([(cx + 30, cy - 28), (cx + 44, cy - 56), (cx + 12, cy - 36)], fill=(200, 160, 210, 255), outline=(80, 60, 90, 200), width=2)
    # big eyes
    cute_eye(d, (cx - 18, cy - 8), size=18, pupil_size=8)
    cute_eye(d, (cx + 18, cy - 8), size=18, pupil_size=8)
    # beak
    d.polygon([(cx - 8, cy + 8), (cx + 8, cy + 8), (cx, cy + 24)], fill=(255, 160, 0, 255), outline=(80, 60, 90, 200), width=2)
    # belly
    d.ellipse([cx - 22, cy + 14, cx + 22, cy + 46], fill=(240, 210, 245, 200), outline=(80, 60, 90, 180), width=2)
    # wings
    d.ellipse([cx - 54, cy + 4, cx - 34, cy + 36], fill=(190, 150, 200, 255), outline=(80, 60, 90, 180), width=2)
    d.ellipse([cx + 34, cy + 4, cx + 54, cy + 36], fill=(190, 150, 200, 255), outline=(80, 60, 90, 180), width=2)
    save(img, "sprites/enemy_owl.png")


def make_enemy_hamster():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 70
    # body
    for r in range(44, 0, -2):
        ratio = r / 44
        col = (int(250 - 20 * ratio), int(230 - 20 * ratio), int(200 - 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 44, cy - 38, cx + 44, cy + 50], outline=(140, 120, 100, 200), width=3)
    # ears
    d.ellipse([cx - 34, cy - 36, cx - 14, cy - 16], fill=(245, 220, 190, 255), outline=(140, 120, 100, 200), width=2)
    d.ellipse([cx + 14, cy - 36, cx + 34, cy - 16], fill=(245, 220, 190, 255), outline=(140, 120, 100, 200), width=2)
    cute_eye(d, (cx - 16, cy - 10), size=11, pupil_size=5)
    cute_eye(d, (cx + 16, cy - 10), size=11, pupil_size=5)
    # cheeks
    d.ellipse([cx - 30, cy + 2, cx - 10, cy + 14], fill=(255, 160, 170, 160))
    d.ellipse([cx + 10, cy + 2, cx + 30, cy + 14], fill=(255, 160, 170, 160))
    # nose/mouth
    d.ellipse([cx - 5, cy + 2, cx + 5, cy + 12], fill=(255, 130, 150, 255), outline=(140, 120, 100, 180), width=1)
    d.arc([cx - 8, cy + 8, cx + 8, cy + 20], 0, 180, fill=(140, 120, 100, 200), width=2)
    # paws
    d.ellipse([cx - 22, cy + 34, cx - 6, cy + 52], fill=(235, 210, 180, 255), outline=(140, 120, 100, 180), width=2)
    d.ellipse([cx + 6, cy + 34, cx + 22, cy + 52], fill=(235, 210, 180, 255), outline=(140, 120, 100, 180), width=2)
    # tail
    d.ellipse([cx + 40, cy + 20, cx + 54, cy + 34], fill=(235, 210, 180, 255), outline=(140, 120, 100, 180), width=2)
    save(img, "sprites/enemy_hamster.png")


def make_enemy_raccoon():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 70
    # tail
    for r in range(24, 0, -2):
        ratio = r / 24
        col = (int(140 - 20 * ratio), int(150 - 20 * ratio), int(150 - 20 * ratio), 255)
        d.ellipse([cx + 38, cy - 12 + int(ratio * 8), cx + 72, cy + 22 + int(ratio * 8)], fill=col)
    d.ellipse([cx + 38, cy - 8, cx + 74, cy + 26], outline=(60, 70, 70, 200), width=3)
    d.line([(cx + 44, cy - 4), (cx + 68, cy + 20)], fill=(80, 90, 90, 200), width=3)
    # body
    for r in range(42, 0, -2):
        ratio = r / 42
        col = (int(160 - 20 * ratio), int(170 - 20 * ratio), int(170 - 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 42, cy - 36, cx + 42, cy + 48], outline=(60, 70, 70, 200), width=3)
    # mask
    d.ellipse([cx - 28, cy - 22, cx + 28, cy + 8], fill=(80, 90, 90, 220))
    cute_eye(d, (cx - 14, cy - 10), size=12, pupil_size=5)
    cute_eye(d, (cx + 14, cy - 10), size=12, pupil_size=5)
    # nose
    d.ellipse([cx - 5, cy + 4, cx + 5, cy + 14], fill=(60, 60, 60, 255), outline=(40, 40, 40, 200), width=1)
    # paws
    d.ellipse([cx - 24, cy + 36, cx - 8, cy + 54], fill=(140, 150, 150, 255), outline=(60, 70, 70, 180), width=2)
    d.ellipse([cx + 8, cy + 36, cx + 24, cy + 54], fill=(140, 150, 150, 255), outline=(60, 70, 70, 180), width=2)
    save(img, "sprites/enemy_raccoon.png")


def make_enemy_bee():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 64
    # wings
    d.ellipse([cx - 48, cy - 8, cx - 8, cy + 24], fill=(220, 240, 255, 180), outline=(120, 160, 200, 180), width=2)
    d.ellipse([cx + 8, cy - 8, cx + 48, cy + 24], fill=(220, 240, 255, 180), outline=(120, 160, 200, 180), width=2)
    # body
    for r in range(34, 0, -2):
        ratio = r / 34
        col = (int(255 - 30 * ratio), int(220 - 20 * ratio), int(40 + 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 4, cx + r, cy + r + 4], fill=col)
    d.ellipse([cx - 34, cy - 30, cx + 34, cy + 38], outline=(80, 80, 60, 200), width=3)
    # stripes
    d.arc([cx - 30, cy - 20, cx + 30, cy + 30], 30, 150, fill=(60, 60, 60, 200), width=3)
    d.arc([cx - 30, cy - 8, cx + 30, cy + 42], 30, 150, fill=(60, 60, 60, 200), width=3)
    d.arc([cx - 30, cy + 4, cx + 30, cy + 54], 30, 150, fill=(60, 60, 60, 200), width=3)
    cute_eye(d, (cx - 12, cy - 8), size=10, pupil_size=4)
    cute_eye(d, (cx + 12, cy - 8), size=10, pupil_size=4)
    # stinger
    d.polygon([(cx - 4, cy + 32), (cx + 4, cy + 32), (cx, cy + 48)], fill=(120, 120, 120, 255), outline=(60, 60, 60, 200), width=2)
    save(img, "sprites/enemy_bee.png")


def make_skull_cat():
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 66
    # body
    for r in range(48, 0, -2):
        ratio = r / 48
        col = (int(50 - 10 * ratio), int(50 - 10 * ratio), int(50 - 10 * ratio), 255)
        d.ellipse([cx - r, cy - r + 4, cx + r, cy + r + 4], fill=col)
    d.ellipse([cx - 48, cy - 44, cx + 48, cy + 52], outline=(20, 20, 20, 220), width=3)
    # ears
    d.polygon([(cx - 34, cy - 28), (cx - 50, cy - 56), (cx - 14, cy - 40)], fill=(50, 50, 50, 255), outline=(20, 20, 20, 220), width=2)
    d.polygon([(cx + 34, cy - 28), (cx + 50, cy - 56), (cx + 14, cy - 40)], fill=(50, 50, 50, 255), outline=(20, 20, 20, 220), width=2)
    # red eyes
    d.ellipse([cx - 24, cy - 10, cx - 6, cy + 10], fill=(255, 40, 40, 255), outline=(120, 0, 0, 220), width=2)
    d.ellipse([cx + 6, cy - 10, cx + 24, cy + 10], fill=(255, 40, 40, 255), outline=(120, 0, 0, 220), width=2)
    # mouth/teeth
    d.arc([cx - 24, cy + 6, cx + 24, cy + 38], 0, 180, fill=(200, 200, 200, 220), width=3)
    d.line([(cx - 16, cy + 16), (cx - 16, cy + 30)], fill=(240, 240, 240, 255), width=3)
    d.line([(cx, cy + 18), (cx, cy + 32)], fill=(240, 240, 240, 255), width=3)
    d.line([(cx + 16, cy + 16), (cx + 16, cy + 30)], fill=(240, 240, 240, 255), width=3)
    save(img, "sprites/skull_cat.png")


def make_new_enemies():
    """Additional cute enemies: hedgehog, frog."""
    # Hedgehog
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 72
    # spiky back
    for angle in range(-60, 61, 12):
        rad = math.radians(angle - 90)
        x1 = cx + int(24 * math.cos(rad))
        y1 = cy + int(18 * math.sin(rad))
        x2 = cx + int(48 * math.cos(rad))
        y2 = cy + int(38 * math.sin(rad))
        d.line([(x1, y1), (x2, y2)], fill=(140, 110, 90, 255), width=4)
    # body
    for r in range(38, 0, -2):
        ratio = r / 38
        col = (int(180 - 20 * ratio), int(150 - 20 * ratio), int(120 - 20 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 38, cy - 32, cx + 38, cy + 44], outline=(100, 80, 60, 200), width=3)
    cute_eye(d, (cx - 14, cy - 6), size=10, pupil_size=4)
    cute_eye(d, (cx + 14, cy - 6), size=10, pupil_size=4)
    d.ellipse([cx - 5, cy + 6, cx + 5, cy + 14], fill=(80, 60, 50, 255), outline=(60, 50, 40, 200), width=1)
    d.ellipse([cx - 20, cy + 34, cx - 6, cy + 50], fill=(160, 130, 100, 255), outline=(100, 80, 60, 180), width=2)
    d.ellipse([cx + 6, cy + 34, cx + 20, cy + 50], fill=(160, 130, 100, 255), outline=(100, 80, 60, 180), width=2)
    save(img, "sprites/enemy_hedgehog.png")

    # Frog
    img = new_image((128, 128))
    d = ImageDraw.Draw(img)
    cx, cy = 64, 70
    for r in range(42, 0, -2):
        ratio = r / 42
        col = (int(100 - 15 * ratio), int(200 - 20 * ratio), int(100 - 15 * ratio), 255)
        d.ellipse([cx - r, cy - r + 6, cx + r, cy + r + 6], fill=col)
    d.ellipse([cx - 42, cy - 36, cx + 42, cy + 48], outline=(50, 120, 50, 200), width=3)
    # eyes bumps
    d.ellipse([cx - 24, cy - 34, cx - 4, cy - 14], fill=(120, 220, 120, 255), outline=(50, 120, 50, 200), width=2)
    d.ellipse([cx + 4, cy - 34, cx + 24, cy - 14], fill=(120, 220, 120, 255), outline=(50, 120, 50, 200), width=2)
    cute_eye(d, (cx - 14, cy - 24), size=9, pupil_size=4)
    cute_eye(d, (cx + 14, cy - 24), size=9, pupil_size=4)
    # mouth
    d.arc([cx - 16, cy - 4, cx + 16, cy + 16], 0, 180, fill=(50, 120, 50, 200), width=3)
    # blush
    d.ellipse([cx - 30, cy + 2, cx - 14, cy + 12], fill=(255, 160, 180, 140))
    d.ellipse([cx + 14, cy + 2, cx + 30, cy + 12], fill=(255, 160, 180, 140))
    # legs
    d.ellipse([cx - 30, cy + 30, cx - 10, cy + 54], fill=(90, 180, 90, 255), outline=(50, 120, 50, 180), width=2)
    d.ellipse([cx + 10, cy + 30, cx + 30, cy + 54], fill=(90, 180, 90, 255), outline=(50, 120, 50, 180), width=2)
    save(img, "sprites/enemy_frog.png")


# -----------------------------------------------------------------------------
# Tiles (128x128)
# -----------------------------------------------------------------------------
def make_tile_grass():
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    # soil
    d.rectangle([0, 16, 63, 63], fill=(139, 90, 43, 255))
    # grass top
    for i in range(0, 64, 4):
        h = 4 + (i % 8) // 4 * 3
        d.polygon([(i, 16), (i + 2, 16 - h), (i + 4, 16)], fill=(124, 179, 66, 255))
    d.rectangle([0, 16, 63, 20], fill=(124, 179, 66, 255))
    # grass layer detail
    d.rectangle([0, 20, 63, 26], fill=(139, 195, 74, 255))
    # soil specks
    for x, y in [(10, 35), (30, 45), (50, 30), (20, 55), (45, 50)]:
        d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(160, 120, 80, 255))
    save(img, "tiles/tile_grass.png")


def make_tile_wood():
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 63, 63], fill=(188, 141, 90, 255))
    # planks
    for y in range(0, 64, 16):
        d.line([(0, y), (63, y)], fill=(140, 100, 60, 220), width=1)
    # wood grain
    for x in range(6, 64, 14):
        d.line([(x, 0), (x, 63)], fill=(160, 120, 70, 180), width=2)
    # nails
    for y in range(4, 64, 16):
        d.ellipse([3, y - 2, 6, y + 2], fill=(120, 90, 50, 255))
        d.ellipse([58, y - 2, 61, y + 2], fill=(120, 90, 50, 255))
    save(img, "tiles/tile_wood.png")


def make_tile_kitchen():
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    # white tile
    d.rectangle([0, 0, 63, 63], fill=(245, 245, 245, 255))
    # checker pattern
    for y in range(0, 64, 16):
        for x in range(0, 64, 16):
            if ((x // 16) + (y // 16)) % 2 == 1:
                d.rectangle([x, y, x + 15, y + 15], fill=(220, 220, 220, 255))
    # grout
    for i in range(0, 65, 16):
        d.line([(i, 0), (i, 63)], fill=(180, 180, 180, 255), width=1)
        d.line([(0, i), (63, i)], fill=(180, 180, 180, 255), width=1)
    save(img, "tiles/tile_kitchen.png")


def make_tile_mud():
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 63, 63], fill=(121, 85, 72, 255))
    # mud texture
    for x, y in [(10, 15), (25, 35), (45, 20), (15, 50), (50, 50), (35, 10)]:
        d.ellipse([x - 5, y - 3, x + 5, y + 3], fill=(141, 105, 92, 255))
    # puddle highlight
    d.ellipse([15, 40, 35, 50], fill=(160, 130, 120, 200))
    save(img, "tiles/tile_mud.png")


# -----------------------------------------------------------------------------
# Backgrounds
# -----------------------------------------------------------------------------
def make_bg_sky():
    img = new_image((800, 600))
    d = ImageDraw.Draw(img)
    for y in range(600):
        ratio = y / 600
        r = int(135 + (224 - 135) * ratio)
        g = int(206 + (246 - 206) * ratio)
        b = int(235 + (255 - 235) * ratio)
        d.line([(0, y), (799, y)], fill=(r, g, b, 255))
    save(img, "background/bg_sky.png")


def make_bg_grass():
    img = new_image((800, 120))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 799, 119], fill=(124, 179, 66, 255))
    # grass blades
    for x in range(0, 800, 12):
        h = 16 + (x % 24) // 12 * 10
        d.polygon([(x, 0), (x + 6, -h), (x + 12, 0)], fill=(100, 160, 50, 255))
    save(img, "background/bg_grass.png")


def make_cloud():
    img = new_image((128, 64))
    d = ImageDraw.Draw(img)
    # soft cloud
    d.ellipse([10, 20, 50, 56], fill=(255, 255, 255, 220), outline=(255, 255, 255, 180), width=2)
    d.ellipse([34, 10, 78, 54], fill=(255, 255, 255, 230), outline=(255, 255, 255, 180), width=2)
    d.ellipse([62, 18, 110, 56], fill=(255, 255, 255, 220), outline=(255, 255, 255, 180), width=2)
    save(img, "background/cloud.png")


# -----------------------------------------------------------------------------
# Effects
# -----------------------------------------------------------------------------
def make_bubble(color, trapped=False):
    img = new_image((96, 96))
    d = ImageDraw.Draw(img)
    cx, cy = 48, 48
    # main bubble
    for r in range(44, 0, -1):
        ratio = r / 44
        alpha = int(40 + 80 * (1 - ratio))
        c = (*color[:3], alpha)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    d.ellipse([cx - 44, cy - 44, cx + 44, cy + 44], outline=(255, 255, 255, 180), width=3)
    # shine
    d.ellipse([cx - 28, cy - 28, cx - 10, cy - 10], fill=(255, 255, 255, 180))
    if trapped:
        # angry red mark inside
        d.ellipse([cx - 16, cy - 8, cx + 16, cy + 16], fill=(255, 80, 80, 200))
        d.line([(cx - 12, cy + 18), (cx, cy + 10), (cx + 12, cy + 18)], fill=(120, 0, 0, 220), width=4)
    save(img, "effects/bubble.png" if not trapped else "effects/bubble_trapped.png")


def make_bubble_variants():
    make_bubble((128, 222, 234, 255))          # water bubble
    make_bubble((206, 147, 216, 255), True)    # trapped bubble
    # water power bubble
    img = new_image((96, 96))
    d = ImageDraw.Draw(img)
    cx, cy = 48, 48
    for r in range(44, 0, -1):
        ratio = r / 44
        alpha = int(40 + 80 * (1 - ratio))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(66, 165, 245, alpha))
    d.ellipse([cx - 44, cy - 44, cx + 44, cy + 44], outline=(255, 255, 255, 180), width=3)
    d.ellipse([cx - 28, cy - 28, cx - 10, cy - 10], fill=(255, 255, 255, 180))
    # water drop icon
    d.polygon([(cx, cy + 18), (cx - 10, cy + 4), (cx, cy - 10), (cx + 10, cy + 4)], fill=(255, 255, 255, 220), outline=(30, 120, 200, 200), width=2)
    save(img, "effects/bubble_water.png")
    # fire power bubble
    img = new_image((96, 96))
    d = ImageDraw.Draw(img)
    for r in range(44, 0, -1):
        ratio = r / 44
        alpha = int(40 + 80 * (1 - ratio))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 112, 67, alpha))
    d.ellipse([cx - 44, cy - 44, cx + 44, cy + 44], outline=(255, 255, 255, 180), width=3)
    d.ellipse([cx - 28, cy - 28, cx - 10, cy - 10], fill=(255, 255, 255, 180))
    # flame icon
    d.polygon([(cx, cy - 18), (cx - 12, cy + 10), (cx, cy + 6), (cx + 12, cy + 10)], fill=(255, 230, 100, 220), outline=(180, 60, 20, 200), width=2)
    save(img, "effects/bubble_fire.png")
    # lightning power bubble
    img = new_image((96, 96))
    d = ImageDraw.Draw(img)
    for r in range(44, 0, -1):
        ratio = r / 44
        alpha = int(40 + 80 * (1 - ratio))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 213, 79, alpha))
    d.ellipse([cx - 44, cy - 44, cx + 44, cy + 44], outline=(255, 255, 255, 180), width=3)
    d.ellipse([cx - 28, cy - 28, cx - 10, cy - 10], fill=(255, 255, 255, 180))
    # lightning bolt
    d.polygon([(cx - 4, cy - 18), (cx + 10, cy - 2), (cx + 2, cy - 2), (cx + 8, cy + 18), (cx - 8, cy + 2), (cx, cy + 2)], fill=(255, 255, 220, 230), outline=(180, 160, 30, 200), width=2)
    save(img, "effects/bubble_lightning.png")


def make_particles():
    img = new_image((32, 32))
    d = ImageDraw.Draw(img)
    for r in range(14, 0, -1):
        ratio = r / 14
        d.ellipse([16 - r, 16 - r, 16 + r, 16 + r], fill=(255, int(215 + 40 * ratio), int(40 + 100 * ratio), int(255 * (1 - ratio * 0.3))))
    d.ellipse([16 - 14, 16 - 14, 16 + 14, 16 + 14], outline=(255, 230, 150, 200), width=1)
    d.ellipse([10, 10, 16, 16], fill=(255, 255, 255, 220))
    save(img, "effects/particle_gold.png")

    img = new_image((48, 48))
    d = ImageDraw.Draw(img)
    cx, cy = 24, 24
    points = []
    for i in range(10):
        angle = math.pi / 2 + i * math.pi / 5
        r = 20 if i % 2 == 0 else 10
        points.append((cx + r * math.cos(angle), cy - r * math.sin(angle)))
    d.polygon(points, fill=(255, 215, 0, 230), outline=(255, 180, 0, 220), width=2)
    save(img, "effects/star.png")


# -----------------------------------------------------------------------------
# Items (64x64)
# -----------------------------------------------------------------------------
def make_bone():
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    # shaft
    d.rounded_rectangle([12, 26, 52, 38], radius=4, fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    # ends
    d.ellipse([6, 20, 20, 32], fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    d.ellipse([6, 32, 20, 44], fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    d.ellipse([44, 20, 58, 32], fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    d.ellipse([44, 32, 58, 44], fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    save(img, "items/bone.png")


def make_food_item(name, color, icon_fn):
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    # plate/base
    d.ellipse([8, 44, 56, 58], fill=(230, 230, 230, 255), outline=(180, 180, 180, 200), width=2)
    icon_fn(d)
    save(img, f"items/{name}.png")


def make_items():
    make_bone()
    make_food_item("dogbowl", (200, 100, 100, 255), lambda d: d.ellipse([18, 28, 46, 48], fill=(200, 80, 80, 255), outline=(150, 50, 50, 200), width=2))
    make_food_item("steak", (180, 80, 80, 255), lambda d: d.rounded_rectangle([14, 28, 50, 44], radius=8, fill=(160, 60, 60, 255), outline=(120, 40, 40, 200), width=2))
    make_food_item("drumstick", (220, 160, 100, 255), lambda d: [
        d.ellipse([28, 24, 50, 46], fill=(210, 140, 70, 255), outline=(160, 100, 50, 200), width=2),
        d.rounded_rectangle([14, 30, 30, 38], radius=3, fill=(255, 248, 225, 255), outline=(200, 180, 140, 200), width=2)
    ])
    make_food_item("cake", (255, 180, 200, 255), lambda d: [
        d.rectangle([16, 24, 48, 44], fill=(255, 200, 220, 255), outline=(220, 140, 170, 200), width=2),
        d.ellipse([22, 18, 28, 24], fill=(255, 80, 120, 255)),
        d.ellipse([36, 20, 42, 26], fill=(255, 80, 120, 255))
    ])
    make_food_item("shampoo", (100, 180, 220, 255), lambda d: [
        d.rectangle([24, 12, 40, 46], fill=(120, 200, 240, 255), outline=(70, 140, 180, 200), width=2),
        d.rectangle([24, 8, 40, 14], fill=(80, 160, 200, 255), outline=(70, 140, 180, 200), width=2)
    ])
    make_food_item("frisbee", (100, 200, 150, 255), lambda d: d.ellipse([14, 28, 50, 44], fill=(100, 220, 160, 255), outline=(60, 160, 110, 200), width=2))
    make_food_item("dogclock", (255, 200, 100, 255), lambda d: [
        d.ellipse([16, 16, 48, 48], fill=(255, 220, 120, 255), outline=(200, 160, 60, 200), width=2),
        d.line([(32, 28), (32, 36)], fill=(80, 60, 30, 255), width=2),
        d.line([(32, 36), (38, 36)], fill=(80, 60, 30, 255), width=2)
    ])
    make_food_item("dog_heart", (255, 100, 120, 255), lambda d: [
        d.polygon([(32, 44), (18, 30), (18, 20), (32, 28), (46, 20), (46, 30)], fill=(255, 100, 120, 255), outline=(200, 50, 70, 200), width=2)
    ])
    make_food_item("staff", (180, 140, 220, 255), lambda d: [
        d.rectangle([28, 8, 36, 50], fill=(160, 120, 80, 255), outline=(120, 90, 60, 200), width=2),
        d.ellipse([22, 6, 42, 22], fill=(220, 200, 255, 255), outline=(160, 120, 200, 200), width=2)
    ])
    make_food_item("diamond_collar", (100, 200, 255, 255), lambda d: [
        d.arc([14, 28, 50, 52], 0, 180, fill=(80, 160, 220, 255), width=5),
        d.polygon([(28, 36), (36, 32), (44, 36), (36, 46)], fill=(180, 240, 255, 255), outline=(80, 160, 200, 200), width=2)
    ])
    make_food_item("tennis_ball", (180, 220, 80, 255), lambda d: [
        d.ellipse([16, 20, 48, 52], fill=(200, 240, 100, 255), outline=(140, 190, 50, 200), width=2),
        d.arc([16, 20, 48, 52], 30, 210, fill=(255, 255, 255, 220), width=3)
    ])
    make_food_item("doghouse", (200, 100, 80, 255), lambda d: [
        d.rectangle([20, 28, 44, 52], fill=(200, 100, 80, 255), outline=(150, 70, 60, 200), width=2),
        d.polygon([(14, 28), (32, 12), (50, 28)], fill=(160, 60, 60, 255), outline=(120, 40, 40, 200), width=2),
        d.ellipse([28, 36, 36, 48], fill=(80, 60, 40, 255))
    ])
    make_food_item("dog_cookie", (210, 160, 100, 255), lambda d: [
        d.ellipse([14, 22, 50, 50], fill=(230, 180, 120, 255), outline=(180, 130, 80, 200), width=2),
        d.ellipse([22, 28, 26, 32], fill=(160, 100, 60, 255)),
        d.ellipse([34, 34, 38, 38], fill=(160, 100, 60, 255)),
        d.ellipse([28, 40, 32, 44], fill=(160, 100, 60, 255))
    ])
    make_food_item("paw_pad", (255, 160, 140, 255), lambda d: [
        d.ellipse([20, 28, 32, 40], fill=(255, 160, 140, 255), outline=(210, 110, 90, 200), width=2),
        d.ellipse([34, 28, 46, 40], fill=(255, 160, 140, 255), outline=(210, 110, 90, 200), width=2),
        d.ellipse([16, 42, 28, 54], fill=(255, 160, 140, 255), outline=(210, 110, 90, 200), width=2),
        d.ellipse([36, 42, 48, 54], fill=(255, 160, 140, 255), outline=(210, 110, 90, 200), width=2),
        d.ellipse([24, 36, 40, 52], fill=(255, 140, 120, 255), outline=(200, 90, 70, 200), width=2)
    ])
    make_food_item("dog_tag", (180, 180, 180, 255), lambda d: [
        d.arc([14, 24, 50, 48], 0, 180, fill=(160, 160, 160, 255), width=4),
        d.ellipse([22, 30, 42, 50], fill=(200, 200, 200, 255), outline=(140, 140, 140, 200), width=2),
        d.ellipse([28, 24, 36, 32], fill=(200, 200, 200, 255), outline=(140, 140, 140, 200), width=2)
    ])


# -----------------------------------------------------------------------------
# UI
# -----------------------------------------------------------------------------
def make_heart():
    img = new_image((48, 48))
    d = ImageDraw.Draw(img)
    # heart shape approximated with polygons/ellipses
    d.ellipse([4, 8, 24, 28], fill=(255, 80, 100, 255), outline=(180, 40, 60, 200), width=2)
    d.ellipse([24, 8, 44, 28], fill=(255, 80, 100, 255), outline=(180, 40, 60, 200), width=2)
    d.polygon([(4, 18), (44, 18), (24, 46)], fill=(255, 80, 100, 255), outline=(180, 40, 60, 200), width=2)
    # shine
    d.ellipse([10, 12, 16, 18], fill=(255, 200, 200, 200))
    save(img, "ui/heart.png")


def make_button(color, name):
    img = new_image((200, 80))
    d = ImageDraw.Draw(img)
    # gradient body
    for y in range(80):
        ratio = y / 80
        c = tuple(int(color[i] + (max(0, color[i] - 40) - color[i]) * ratio) for i in range(3)) + (255,)
        d.line([(0, y), (199, y)], fill=c)
    # rounded outline
    d.rounded_rectangle([4, 4, 195, 75], radius=20, outline=(255, 255, 255, 180), width=3)
    # highlight
    d.arc([10, 8, 190, 40], 0, 180, fill=(255, 255, 255, 120), width=3)
    save(img, f"ui/{name}.png")


def make_ui():
    make_heart()
    make_button((255, 107, 107), "button_red")
    make_button((78, 205, 196), "button_green")
    make_button((79, 172, 254), "button_blue")
    # panel
    img = new_image((400, 300))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, 399, 299], radius=20, fill=(255, 255, 255, 230), outline=(200, 200, 200, 200), width=3)
    save(img, "ui/panel.png")
    # arrow
    img = new_image((64, 64))
    d = ImageDraw.Draw(img)
    d.polygon([(48, 12), (48, 52), (16, 32)], fill=(255, 230, 100, 255), outline=(200, 170, 50, 200), width=2)
    save(img, "ui/arrow.png")
    # logo placeholder
    img = new_image((400, 120))
    d = ImageDraw.Draw(img)
    d.text((20, 30), "泡泡狗", fill=(255, 107, 107, 255), font=None)
    save(img, "ui/logo.png")


# -----------------------------------------------------------------------------
# Letters
# -----------------------------------------------------------------------------
def make_letters():
    colors = {
        'G': (255, 215, 0), 'O': (255, 140, 0), 'L': (50, 205, 50),
        'D': (30, 144, 255), 'E': (147, 112, 219), 'N': (255, 20, 147)
    }
    for letter, col in colors.items():
        img = new_image((96, 96))
        d = ImageDraw.Draw(img)
        cx, cy = 48, 48
        # bubble background
        for r in range(44, 0, -1):
            ratio = r / 44
            alpha = int(60 + 100 * (1 - ratio))
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*col, alpha))
        d.ellipse([cx - 44, cy - 44, cx + 44, cy + 44], outline=(255, 255, 255, 200), width=4)
        d.ellipse([cx - 28, cy - 28, cx - 10, cy - 10], fill=(255, 255, 255, 200))
        # letter text (simple vector-like via polygon approx)
        d.text((cx, cy), letter, fill=(255, 255, 255, 255), anchor="mm", font=None)
        save(img, f"effects/letter_{letter}.png")


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main():
    print("Generating HD cute assets...")
    print("\n-- Puppies --")
    make_puppy_spritesheet("cici", (255, 255, 255), (255, 130, 170), "collar", "flop_left")
    make_puppy_spritesheet("xiongxiong", (255, 255, 255), (100, 180, 255), "bow", "upright")
    make_puppy_spritesheet("pudding", (255, 230, 180), (255, 180, 80), "collar", "flop_both")
    make_puppy_spritesheet("mocha", (160, 120, 90), (150, 255, 150), "bow", "upright")

    print("\n-- Enemies --")
    make_enemy_cat()
    make_enemy_squirrel()
    make_enemy_owl()
    make_enemy_hamster()
    make_enemy_raccoon()
    make_enemy_bee()
    make_skull_cat()
    make_new_enemies()

    print("\n-- Tiles --")
    make_tile_grass()
    make_tile_wood()
    make_tile_kitchen()
    make_tile_mud()

    print("\n-- Backgrounds --")
    make_bg_sky()
    make_bg_grass()
    make_cloud()

    print("\n-- Effects --")
    make_bubble_variants()
    make_particles()

    print("\n-- Items --")
    make_items()

    print("\n-- UI --")
    make_ui()

    print("\n-- Letters --")
    make_letters()

    print("\nDone. Assets written to", OUT_DIR)


if __name__ == "__main__":
    main()
