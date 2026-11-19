#!/usr/bin/env python3
"""VESPERWOOD window finisher:
1. flood-fill outside -> transparent (no interior key)
2. segment the window opening (flood from centre, bounded box), fill holes
3. paint the opening with a smooth candlelight gradient (opaque)
4. trace the opening's per-row silhouette -> clip-path polygon for the letter
   in .arch-card__inner coordinate space
"""
import numpy as np
from PIL import Image
from scipy import ndimage
import os

RAW = "/home/z/my-project/vesperwood-invitation/_raw-art/window-vesperwood-tall.png"
OUT = "/home/z/my-project/vesperwood-invitation/assets/art/window-vesperwood-tall.png"

img = Image.open(RAW).convert("RGB")
rgb = np.asarray(img).astype(np.float32) / 255.0
H, W = rgb.shape[:2]
d = np.sqrt(((1.0 - rgb) ** 2).sum(axis=2)) / np.sqrt(3)

# ── 1. outside = border flood-fill of near-white ─────────────────────
bg_candidate = d < 0.030
seed = np.zeros_like(bg_candidate)
seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
outside = bg_candidate & ndimage.binary_propagation(seed, mask=bg_candidate)
solid = ~outside

# ── 2. opening = light-pixel region connected to the centre, bounded ─
x0, x1 = int(W * 0.14), int(W * 0.86)
y0, y1 = int(H * 0.10), int(H * 0.97)
light = d < 0.20
box = np.zeros((H, W), bool)
box[y0:y1, x0:x1] = True
cand = light & box
lab, n = ndimage.label(cand)
centre_lab = lab[H // 2, W // 2]
opening = lab == centre_lab
opening = ndimage.binary_fill_holes(opening)          # swallow tracery bits
opening = ndimage.binary_opening(opening, np.ones((5, 5)))  # smooth speckle
opening = ndimage.binary_fill_holes(opening)

print("opening px:", opening.sum(), f"({opening.sum() / (W * H):.1%} of canvas)")

# ── 3. paint the candlelight gradient into the opening ───────────────
ys = np.where(opening.any(axis=1))[0]
oy_top, oy_bot = ys.min(), ys.max()
grad_t = np.linspace(0, 1, oy_bot - oy_top + 1)[:, None]
top = np.array([1.00, 0.972, 0.905])   # #FFF8E7
mid = np.array([0.996, 0.953, 0.843])  # #FEF3D7
bot = np.array([0.965, 0.898, 0.745])  # #F6E5BE
t = np.where(grad_t < 0.55, grad_t / 0.55, 1.0)
botw = np.where(grad_t >= 0.55, (grad_t - 0.55) / 0.45, 0.0)
col = top[None, :] * (1 - t) * (1 - botw) + mid[None, :] * t * (1 - botw) + bot[None, :] * botw
col = np.repeat(col, W, axis=1).reshape(oy_bot - oy_top + 1, W, 3)

rgb_out = rgb.copy()
rgb_out[oy_top:oy_bot + 1][opening[oy_top:oy_bot + 1]] = \
    col[opening[oy_top:oy_bot + 1]]
alpha = solid.astype(np.float32)          # opening is opaque painted glow
alpha[outside] = 0.0

a = ndimage.gaussian_filter(alpha, 1.0)
a = np.clip(a, 0, 1)
af = np.maximum(a, 1e-4)[..., None]
rgb_final = np.clip((rgb_out - (1.0 - a[..., None]) * 1.0) / af, 0, 1)
rgba = np.dstack([(rgb_final * 255).astype(np.uint8), (a * 255).astype(np.uint8)])
im = Image.fromarray(rgba)
bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
im = im.crop(bbox)
w, h = im.size
if max(w, h) > 1400:
    s = 1400 / max(w, h)
    im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
q = im.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
q.save(OUT, "PNG", optimize=True)
print(f"window: {im.size[0]}x{im.size[1]} -> {os.path.getsize(OUT)//1024}KB")

# ── 4. trace the opening silhouette for the letter clip ──────────────
# recompute in CROPPED coordinates
ox = int(bbox[0]); oy = int(bbox[1])
op = np.zeros_like(opening)
op[oy:oy + h, ox:ox + w] = opening[oy:oy + h, ox:ox + w][:h, :w] if False else opening[oy:oy+h, ox:ox+w]
op = opening[oy:oy + h, ox:ox + w]
CH, CW = op.shape
pxm = op

def row_edges(y):
    xs = np.where(pxm[y])[0]
    if len(xs) == 0: return None
    return xs.min() / CW, xs.max() / CW

tip_y = next(y for y in range(CH) if pxm[y].sum() > 0)
sill_y = CH - 1 - next(y for y in range(CH) if pxm[CH - 1 - y].sum() > 0)
plateau = row_edges(int(CH * 0.62))
print(f"cropped {CW}x{CH}  tip={tip_y/CH:.4f} sill={sill_y/CH:.4f} plateau L={plateau[0]:.4f} R={plateau[1]:.4f}")

# letter box (fractions of the cropped window image), matching bukhara insets
BX0, BX1 = plateau[0] + 0.013, plateau[1] - 0.015
BY0, BY1 = tip_y / CH + 0.004, sill_y / CH - 0.008
BW, BH = BX1 - BX0, BY1 - BY0
print(f"letter box: left={BX0:.4f} right={(1-BX1):.4f} top={BY0:.4f} bottom={(1-BY1):.4f} (as CSS %)")

GL, GR = BX0 - plateau[0], plateau[1] - BX1
tip = None
for y in range(tip_y, tip_y + int(CH * 0.08)):
    e = row_edges(y)
    if not e: continue
    wl, wr = e[0] + GL, e[1] - GR
    if wr - wl >= 0.010:
        tip = ((wl + wr) / 2, y / CH)
        break
print(f"paper tip: x={tip[0]:.4f} y={tip[1]:.4f}")

def to_inner(xf, yf):
    return (xf - BX0) / BW * 100.0, (yf - BY0) / BH * 100.0

pts = [to_inner(tip[0], tip[1])]
last_l = last_r = None
y = int(tip[1] * CH)
while y < int(0.62 * CH):
    e = row_edges(y)
    if e:
        wl, wr = e[0] + GL, e[1] - GR
        wl = max(wl, BX0); wr = min(wr, BX1)
        moved = (last_l is None or abs(wl - last_l) > 0.004 or abs(wr - last_r) > 0.004)
        if moved and wr > wl + 0.004:
            pts.append(to_inner(wl, y / CH))
            pts.append(to_inner(wr, y / CH))
            last_l, last_r = wl, wr
        if wl <= BX0 + 1e-6 and wr >= BX1 - 1e-6:
            break
    y += 2

left = pts[1::2]; right = pts[2::2]
poly = [pts[0]] + left + [(0.0, 100.0), (100.0, 100.0)] + list(reversed(right))
poly_str = ', '.join(f'{x:.2f}% {y:.2f}%' for x, y in poly)
print(f'\n{len(poly)} points')
print('CLIP-PATH:', poly_str)
print('CSS BOX:', f'left: {BX0*100:.1f}%; right: {(1-BX1)*100:.1f}%; top: {BY0*100:.1f}%; bottom: {(1-BY1)*100:.1f}%;')
