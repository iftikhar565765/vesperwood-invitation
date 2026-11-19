#!/bin/bash
# roll N window candidates and score them for a clean near-white interior
set -u
RAW=/home/z/my-project/vesperwood-invitation/_raw-art
mkdir -p "$RAW/cands"
P="one single grand pointed gothic chapel window frame perfectly centred filling most of the frame, the frame band of warm ivory stone with matte antique gold gothic tracery mouldings and slim side colonnettes, a small delicate gold cross finial at the crown apex, THE OPENING INSIDE THE WINDOW IS COMPLETELY EMPTY PURE WHITE BLANK SPACE IDENTICAL TO THE PLAIN WHITE BACKGROUND, absolutely no glow no stained glass no coloured panes no tracery inside the opening, the window is just an empty white hole framed by ivory stone and gold, everything outside the window frame pure white empty too, flat painted illustration in the manner of a medieval illuminated manuscript with delicate gold leaf illumination, luxury wedding stationery artwork, muted matte antique gold and ivory stone tones, absolutely no photorealism, no photograph, no 3D rendering, no glossy metallic bevel, uniform matte finish, crisp clean silhouette, isolated on pure white background, high detail, no text, no letters, no watermark"

for i in 1 2 3 4 5 6; do
  f="$RAW/cands/window-$i.png"
  [ -s "$f" ] && continue
  echo "== roll $i"
  if timeout 150 z-ai image -p "$P" -o "$f" -s 1152x864 2>&1 | grep -q 'completed'; then
    echo "ok roll $i"; sleep 6
  else
    echo "fail roll $i"; rm -f "$f"; sleep $((15 + i * 5))
  fi
done
echo ROLLS-DONE
