@echo off
echo Current Dir: %cd% > diag.txt
dir >> diag.txt
copy "C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\player_sprite_1773974791034.png" "player.png" >> diag.txt 2>&1
copy "C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\game_tileset_1773974806268.png" "tileset.png" >> diag.txt 2>&1
copy "C:\Users\cindy\.gemini\antigravity\brain\930b8279-7045-4805-a98b-638ca4c022fd\game_background_1773974822116.png" "background.png" >> diag.txt 2>&1
echo Done >> diag.txt
