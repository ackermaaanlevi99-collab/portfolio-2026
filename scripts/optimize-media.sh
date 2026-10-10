#!/usr/bin/env bash
# Uso: ./scripts/optimize-media.sh entrada.mov salida-base   (requiere ffmpeg)
set -e
in="$1"; out="$2"
ffmpeg -i "$in" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart -an "$out.mp4"
ffmpeg -i "$in" -vf "scale='min(1280,iw)':-2" -c:v libvpx-vp9 -crf 34 -b:v 0 -an "$out.webm"
ffmpeg -i "$in" -frames:v 1 -vf "scale='min(1280,iw)':-2" "$out-poster.jpg"
