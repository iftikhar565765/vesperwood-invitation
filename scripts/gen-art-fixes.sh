#!/bin/bash
# VESPERWOOD art fixes: spire (isolated), lilies (no white-on-white),
# swag (coloured), corner (no frame square)
set -u
RAW=/home/z/my-project/vesperwood-invitation/_raw-art
mkdir -p "$RAW"

gen () {
  local name="$1" size="$2" prompt="$3"
  for attempt in 1 2 3 4 5 6 7 8; do
    [ -s "$RAW/$name.png" ] && { echo "have $name"; return 0; }
    echo "== vesperwood/$name attempt $attempt"
    if timeout 150 z-ai image -p "$prompt" -o "$RAW/$name.png" -s "$size" 2>&1 | grep -q 'completed'; then
      echo "ok vesperwood/$name"; sleep 8; return 0
    fi
    rm -f "$RAW/$name.png"
    sleep $((18 + attempt * 8))
  done
  echo "FAILED vesperwood/$name"
}

# 1 — spire: ONE isolated spire, pure white bg, no forest scene
gen spire-vesperwood 768x1344 "one single slender pale stone gothic chapel spire tower with a small matte antique gold cross finial at its very top, one tall pointed lancet window glowing warm gold near the top of the tower, the tower drawn entirely alone and complete from its cross finial down to a simple stone base, crisp clean silhouette of the tower only, absolutely no trees, no forest, no landscape, no ground scenery, no sky, everything around the tower pure white empty background, flat painted illustration in the manner of a medieval illuminated manuscript with delicate gold leaf, luxury wedding stationery artwork, muted matte antique gold and soft ivory stone, no photorealism, no 3D rendering, uniform matte finish, high detail, no text, no watermark"

# 2 — lilies: NO pure white petals — blush and cream tones with dense foliage
gen lilies-vesperwood 1024x1024 "one tight lush cluster of blush pink roses and warm cream roses with honey gold centres and deep pine green leaves and tiny gold buds, petals in soft pink and warm ivory tones never pure white, flowers overlapping densely with rich green foliage filling every gap between blooms, soft painterly matte illustration, muted jewel tones, crisp clean edges, isolated on pure white background, high detail, no text, no watermark"

# 3 — swag: coloured garland
gen swag-vesperwood 1344x768 "one elegant hanging garland swag curving in a gentle arc across the canvas, made of small blush pink roses and warm cream rosebuds with rich matte gold ivy and olive leaves and thin gold ribbon tied at both upper corners, dense colourful flowers and foliage with no empty white gaps inside the garland, soft painterly matte illustration, muted jewel tones, crisp clean edges, isolated on pure white background, high detail, no text, no watermark"

# 4 — corner: branch arrangement only, no frame
gen corner-vesperwood 1024x1024 "one top-left corner arrangement of slender matte antique gold olive and myrtle branches with tiny blush pink blossoms and fine deep green leaves, the branches hug the top-left corner of the canvas and curve gently inward toward the centre like an open garland, absolutely no frame, no border, no square panel, no rectangle, only the free-flowing branches and leaves themselves, thin delicate lines, generous pure white empty space on the right and bottom, flat painted illustration in the manner of a medieval illuminated manuscript, luxury wedding stationery artwork, no photorealism, crisp clean silhouette, high detail, no text, no watermark"

echo FIXES-DONE
