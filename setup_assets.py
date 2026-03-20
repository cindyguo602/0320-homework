import shutil
import os

assets = [
    (r"C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\player_sprite_1773974791034.png", "player.png"),
    (r"C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\game_tileset_1773974806268.png", "tileset.png"),
    (r"C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\game_background_1773974822116.png", "background.png")
]

for src, dst in assets:
    try:
        shutil.copyfile(src, dst)
        print(f"Copied {src} to {dst}")
    except Exception as e:
        print(f"Error copying {src}: {e}")

with open("setup_log.txt", "w") as f:
    f.write("Setup complete\n")
