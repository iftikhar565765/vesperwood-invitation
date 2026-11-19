#!/usr/bin/env python3
"""VESPERWOOD divider — deterministic hairline rule with a small cross:
double gold hairline, centre cross fleury between two diamonds."""
import numpy as np
from PIL import Image, ImageDraw

S = 2  # supersample
W, H = 1344 * S, 768 * S
im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(im)

GOLD = (201, 162, 75, 255)
GOLD_DIM = (170, 134, 52, 235)
INK = (138, 107, 42, 255)

cy = H // 2
x0, x1 = 90 * S, (W - 90 * S)

# ── double hairline with soft end fades ──────────────────────────────
for dy in (-7 * S, 7 * S):
    line = Image.new("RGBA", (W, 3 * S), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line)
    ld.line([(0, 1.5 * S), (W, 1.5 * S)], fill=GOLD_DIM, width=3 * S)
    # alpha fades at both ends
    fade = np.linspace(0, 1, 150 * S)
    a = np.asarray(line).astype(np.float32)
    a[:, :150 * S, 3] *= fade
    a[:, -150 * S:, 3] *= fade[::-1]
    im.alpha_composite(Image.fromarray(a.astype(np.uint8)), (0, cy + dy - 1 * S))

# ── centre medallion: ring + cross fleury ────────────────────────────
cx = W // 2
r_ring = 52 * S
d.ellipse([cx - r_ring, cy - r_ring, cx + r_ring, cy + r_ring], outline=INK, width=2 * S)
d.ellipse([cx - r_ring + 3 * S, cy - r_ring + 3 * S, cx + r_ring - 3 * S, cy + r_ring - 3 * S], outline=GOLD, width=2 * S)

# cross: vertical + horizontal arm with flared tips
arm_l, arm_w = 30 * S, 4 * S
d.line([(cx, cy - arm_l), (cx, cy + arm_l)], fill=GOLD, width=arm_w * 2)
d.line([(cx - arm_l * 0.72, cy - arm_l * 0.28), (cx + arm_l * 0.72, cy - arm_l * 0.28)], fill=GOLD, width=arm_w * 2)
# fleury tips: small diamonds at the three ends
def diamond(px_, py_, r_):
    d.polygon([(px_, py_ - r_), (px_ + r_ * 0.72, py_), (px_, py_ + r_), (px_ - r_ * 0.72, py_)], fill=GOLD)
diamond(cx, cy - arm_l, 7 * S)
diamond(cx - arm_l * 0.72, cy - arm_l * 0.28, 6 * S)
diamond(cx + arm_l * 0.72, cy - arm_l * 0.28, 6 * S)

# ── diamonds on the rule, flanking the medallion ─────────────────────
for sx in (-1, 1):
    dx = cx + sx * r_ring * 2.1
    diamond(dx, cy, 9 * S)

# ── crop to content, downscale, quantize ─────────────────────────────
bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
im = im.crop(bbox)
w, h = im.size
im = im.resize((w // S, h // S), Image.LANCZOS)
q = im.quantize(colors=128, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
out = "/home/z/my-project/vesperwood-invitation/assets/art/divider-vesperwood.png"
q.save(out, "PNG", optimize=True)
import os
print(f"divider: {im.size} -> {os.path.getsize(out)//1024}KB")
