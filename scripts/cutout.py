#!/usr/bin/env python3
"""VESPERWOOD — cutout pipeline: border flood-fill background removal (keeps
interior highlights opaque), interior keying for the open window interior,
feather + white unmix, palette compression. Raw white-bg -> transparent art."""
import numpy as np
from PIL import Image
from scipy import ndimage
import os, sys

RAW = "/home/z/my-project/vesperwood-invitation/_raw-art"
OUT = "/home/z/my-project/vesperwood-invitation/assets/art"


def dist_from_white(rgb):
    return np.sqrt(((1.0 - rgb) ** 2).sum(axis=2)) / np.sqrt(3)


def cutout(name, t_bg=0.030, interior_key=False, t_int=0.10, feather=1.1,
           maxdim=1300, colors=256):
    img = Image.open(os.path.join(RAW, name + ".png")).convert("RGB")
    rgb = np.asarray(img).astype(np.float32) / 255.0
    d = dist_from_white(rgb)

    bg_candidate = d < t_bg
    seed = np.zeros_like(bg_candidate)
    seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
    outside = bg_candidate & ndimage.binary_propagation(seed, mask=bg_candidate)
    a = np.where(outside, 0.0, 1.0)

    # despeckle: drop isolated opaque specks (gold glitter noise)
    lab, n = ndimage.label(a > 0.15)
    if n:
        sizes = ndimage.sum(a > 0.15, lab, range(1, n + 1))
        kill = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < 220])
        a = np.where(kill, 0.0, a)

    if interior_key:
        # large ENCLOSED near-white regions inside the solid art (the open
        # window interior) key out to transparency; small highlights stay
        solid = a > 0.5
        candidate = (d < t_int) & solid
        lab, n = ndimage.label(candidate)
        if n:
            sizes = ndimage.sum(candidate, lab, range(1, n + 1))
            big = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 20000])
            ramp = np.clip((d - t_int) / (0.34 - t_int), 0, 1)
            a = np.where(big, ramp, a)

    a = ndimage.gaussian_filter(a, feather)
    a = np.clip(a, 0, 1)

    af = np.maximum(a, 1e-4)[..., None]
    rgb_out = np.clip((rgb - (1.0 - a[..., None]) * 1.0) / af, 0, 1)
    rgba = np.dstack([(rgb_out * 255).astype(np.uint8),
                      (a * 255).astype(np.uint8)])
    im = Image.fromarray(rgba)
    bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    w, h = im.size
    if max(w, h) > maxdim:
        s = maxdim / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    q = im.quantize(colors=colors, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
    path = os.path.join(OUT, name + ".png")
    q.save(path, "PNG", optimize=True)
    print(f"{name}: {im.size[0]}x{im.size[1]} -> {os.path.getsize(path)//1024}KB")


if __name__ == "__main__":
    names = sys.argv[1:] or [
        "window-vesperwood-tall", "lantern-vesperwood", "rosette-vesperwood",
        "corner-vesperwood", "lilies-vesperwood", "swag-vesperwood",
        "divider-vesperwood", "dove-vesperwood", "seal-vesperwood",
        "spire-vesperwood",
    ]
    for name in names:
        kwargs = {}
        if name in ("window-vesperwood-tall",):
            kwargs = dict(interior_key=True, t_int=0.10, feather=1.0, maxdim=1400)
        if name == "divider-vesperwood":
            kwargs = dict(colors=128, maxdim=1400)
        if name in ("rosette-vesperwood", "corner-vesperwood"):
            kwargs = dict(maxdim=1200)
        cutout(name, **kwargs)
