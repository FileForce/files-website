# Favicon, app icons and social preview images from src/app/icon.svg.
# Needs `resvg` (cargo install resvg) and Pillow.  Run:  python3 scripts/social-icons.py
import os, re, subprocess, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, 'src', 'app')
PUBLIC = os.path.join(ROOT, 'public')
icon = open(os.path.join(APP, 'icon.svg')).read()
tmp = tempfile.mkdtemp()

def render(svg, width, height=None):
    src = os.path.join(tmp, 'in.svg'); out = os.path.join(tmp, 'out.png')
    open(src, 'w').write(svg)
    args = ['resvg', '-w', str(width)] + (['-h', str(height)] if height else []) + [src, out]
    subprocess.run(args, check=True)
    return Image.open(out).convert('RGBA')

# Small sizes: the tile alone (no empty margin), corners stay transparent.
tile = re.sub(r'viewBox="[^"]*"', 'viewBox="100 100 824 824"', icon)
# Apple and Android masks round the corners themselves: a full square tile.
square = tile.replace('rx="185"', 'rx="0"')

sizes = [render(tile, s) for s in (16, 32, 48)]
sizes[2].save(os.path.join(APP, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)], append_images=sizes[:2])
render(square, 180).convert('RGB').save(os.path.join(APP, 'apple-icon.png'))
render(square, 192).save(os.path.join(PUBLIC, 'icon-192.png'))
render(square, 512).save(os.path.join(PUBLIC, 'icon-512.png'))

# Social preview (Open Graph / X / Telegram / LinkedIn…): 1200×630.
inner = icon.split('<defs>', 1)[1].split('</defs>', 1)
defs, body = inner[0], inner[1].replace('</svg>', '')
og = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>{defs}
<radialGradient id="glow" cx="0.22" cy="0.5" r="0.6"><stop offset="0" stop-color="#4338ca" stop-opacity="0.55"/><stop offset="1" stop-color="#0b0b14" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="#0b0b14"/>
<rect width="1200" height="630" fill="url(#glow)"/>
<g transform="translate(70 125) scale(0.37)">{body}</g>
<text x="500" y="250" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="88" font-weight="300" fill="#ffffff">file <tspan font-weight="800">FORCE</tspan></text>
<text x="502" y="320" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#c7d2fe">The free, fast file manager</text>
<text x="502" y="364" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#c7d2fe">for macOS, Windows and Linux</text>
<text x="502" y="440" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="24" fill="#8b8fb8">Git · SSH · Quick Look · Quick Actions · Mail · Music</text>
<text x="502" y="530" font-family="Menlo, monospace" font-size="22" fill="#6366f1">fileforce.vercel.app</text>
</svg>'''
preview = render(og, 1200, 630).convert('RGB')
for name in ('opengraph-image.png', 'twitter-image.png'):
    preview.save(os.path.join(APP, name), optimize=True)
alt = 'file FORCE — the free, fast file manager for macOS, Windows and Linux'
for name in ('opengraph-image.alt.txt', 'twitter-image.alt.txt'):
    open(os.path.join(APP, name), 'w').write(alt)
# Blog covers as PNG: X, Facebook, Telegram and LinkedIn show no SVG previews.
covers = os.path.join(PUBLIC, 'blog', 'covers')
for name in sorted(os.listdir(covers)):
    if name.endswith('.svg'):
        render(open(os.path.join(covers, name)).read(), 1200, 630).convert('RGB').save(os.path.join(covers, name[:-4] + '.png'), optimize=True)
print('favicon.ico, apple-icon.png, icon-192/512.png, opengraph-image.png, twitter-image.png, blog cover PNGs')
