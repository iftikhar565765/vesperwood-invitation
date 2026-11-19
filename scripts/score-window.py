#!/usr/bin/env python3
"""Score window candidates for interior cleanliness: the central opening
band should be uniformly near-white (ready for alpha keying)."""
import numpy as np
from PIL import Image
from scipy import ndimage
import glob, os, shutil, sys

RAW = "/home/z/my-project/vesperwood-invitation/_raw-art"


def score(path):
    img = Image.open(path).convert("RGB")
    rgb = np.asarray(img).astype(np.float32) / 255.0
    H, W = rgb.shape[:2]
    d = np.sqrt(((1.0 - rgb) ** 2).sum(axis=2)) / np.sqrt(3)

    # outside flood
    bg = d < 0.030
    seed = np.zeros_like(bg)
    seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
    outside = bg & ndimage.binary_propagation(seed, mask=bg)
    # enclosed near-white regions (potential keyed interior)
    solid = ~outside
    cand = (d < 0.10) & solid
    lab, n = ndimage.label(cand)
    if not n:
        return 0.0, "no interior region"
    sizes = ndimage.sum(cand, lab, range(1, n + 1))
    big = int(np.argmax(sizes)) + 1
    region = lab == big
    if region.sum() < 15000:
        return region.sum() / (W * H), f"interior too small ({int(region.sum())}px)"
    # uniformity: p95 of d within the region's central core
    ys, xs = np.where(region)
    y0, y1 = int(ys.min() + (ys.max() - ys.min()) * .25), int(ys.min() + (ys.max() - ys.min()) * .75)
    x0, x1 = int(xs.min() + (xs.max() - xs.min()) * .25), int(xs.min() + (xs.max() - xs.min()) * .75)
    core = region[y0:y1, x0:x1]
    dd = d[y0:y1, x0:x1][core]
    p95 = float(np.percentile(dd, 95)) if dd.size else 1.0
    coverage = region.sum() / (W * H)
    return coverage - p95, f"coverage={coverage:.1%} p95d={p95:.3f} size={int(region.sum())}"


best, best_s, best_info = None, -9, ""
for f in sorted(glob.glob(os.path.join(RAW, "cands", "window-*.png"))):
    s, info = score(f)
    print(f"{os.path.basename(f)}: score={s:.3f}  ({info})")
    if s > best_s:
        best, best_s, best_info = f, s, info

if best and best_s > 0.15:
    shutil.copy(best, os.path.join(RAW, "window-vesperwood-tall.png"))
    print(f"\nPICKED {best} (score {best_s:.3f}) -> window-vesperwood-tall.png")
else:
    print("\nNO CLEAN CANDIDATE — best:", best, best_info)
    sys.exit(1)
