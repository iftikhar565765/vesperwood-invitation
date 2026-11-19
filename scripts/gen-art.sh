#!/bin/bash
# VESPERWOOD — candlelit vespers in the wood · Christian redesign.
# Illuminated-manuscript / stained-glass luxury stationery suite.
# Raw on pure white for the flood-fill cutout pipeline.
set -u
RAW=/home/z/my-project/vesperwood-invitation/_raw-art
mkdir -p "$RAW"

gen () {
  local name="$1" size="$2" prompt="$3"
  for attempt in 1 2 3 4 5 6 7 8 9 10; do
    [ -s "$RAW/$name.png" ] && { echo "have $name"; return 0; }
    echo "== vesperwood/$name attempt $attempt"
    if timeout 150 z-ai image -p "$prompt" -o "$RAW/$name.png" -s "$size" 2>&1 | grep -q 'completed'; then
      echo "ok vesperwood/$name"; sleep 8; return 0
    fi
    rm -f "$RAW/$name.png"
    sleep $((20 + attempt * 8))
  done
  echo "FAILED vesperwood/$name"
}

STYLE="flat painted illustration in the manner of a medieval illuminated manuscript with delicate gold leaf illumination, luxury wedding stationery artwork, deep sapphire blue and pine green stained glass tones with muted matte antique gold and soft ivory, absolutely no photorealism, no photograph, no 3D rendering, no glossy metallic bevel, no ceramic plate, uniform matte finish, crisp clean silhouette, isolated on pure white background, high detail, no text, no letters, no watermark"

# 1 — hero window: pointed gothic chapel window with stone tracery & stained glass
gen window-vesperwood-tall 1152x864 "one single grand pointed gothic chapel window frame perfectly centred filling most of the frame, slender stone tracery of matte antique gold with deep sapphire blue and emerald green stained glass panes arranged in fine lancet tracery, slim side colonnettes with small quatrefoil glass panels, a small delicate gold cross finial at the crown apex, the inside of the window filled with a soft warm candlelight glow gradient pale gold fading gently upward, everything outside the window pure white empty, $STYLE"

# 2 — sanctuary candle lantern
gen lantern-vesperwood 768x1344 "one slender hanging sanctuary candle lantern, matte antique gold brass frame with fine pierced openwork, soft amber glass panels glowing with a small warm flame inside, small ornate chain rising to a ring at the top, small gold cap at base and crown, $STYLE"

# 3 — rose window medallion
gen rosette-vesperwood 1024x1024 "one round stained glass rose window medallion of fine sapphire blue and emerald green glass rosette line art radiating into a delicate stone tracery lattice with matte gold outlines, tiny gold details at the tracery points, perfectly symmetric, centred, generous white margin around it, $STYLE"

# 4 — corner ornament (true corner, anchored top-left)
gen corner-vesperwood 1024x1024 "one top-left corner ornament of slender matte antique gold olive and myrtle branches hugging the top-left corner of the canvas with tiny ivory white blossoms and fine deep green leaves curving gently inward toward the centre, thin delicate lines, generous white space on the right and bottom, $STYLE"

# 5 — divider: ultra-thin horizontal rule
gen divider-vesperwood 1344x768 "an extremely thin horizontal gold divider rule running across the full width at the vertical centre of the canvas, a single fine hairline double rule with one tiny delicate matte gold cross fleury at the exact centre and two small symmetric olive branch scrolls curling outward at the ends, the ornament occupies only the middle eight percent of the canvas height, everything above and below the rule pure white empty, $STYLE"

# 6 — dove
gen dove-vesperwood 1024x1024 "one elegant white dove in gentle flight carrying a small green olive branch in its beak, fine matte gold outline on soft ivory feathers, small gold halo ring behind its head, wings spread gracefully upward, centred with generous white margin, $STYLE"

# 7 — lilies (tight cluster, no white pockets)
gen lilies-vesperwood 1024x1024 "one tight lush cluster of white Madonna lilies and soft blush roses with deep pine green leaves and tiny gold buds, flowers overlapping densely with no gaps between them, soft painterly matte illustration, muted jewel tones, crisp clean edges, isolated on pure white background, high detail, no text"

# 8 — wax seal
gen seal-vesperwood 1024x1024 "one round deep burgundy wine red wax seal stamped with an embossed matte antique gold cross fleury wreathed in a small laurel of olive leaves at its centre, fine beaded pressed edge, slightly imperfect hand-poured wax rim, matte finish, centred, generous white margin, $STYLE"

# 9 — swag garland (wide)
gen swag-vesperwood 1344x768 "one elegant hanging garland swag curving in a gentle arc across the canvas, made of small white roses and ivory lily buds with fine matte gold ivy and olive leaves and thin gold ribbon tied at both upper corners, soft painterly matte illustration, muted jewel tones, crisp clean edges, isolated on pure white background, high detail, no text"

# 10 — spire (closing plate)
gen spire-vesperwood 1152x864 "one graceful stone chapel spire with a slender matte gold cross finial at its crown, pale stone gothic tower with tall pointed lancet windows warmly lit from within, gentle deep green forest boughs flanking the tower, quiet twilight grandeur, painted matte illustration, no photorealism, no photograph, crisp clean edges, isolated on pure white background, high detail, no text"

echo VESPERWOOD-DONE
