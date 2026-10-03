"""Publish assets with content hashes so Pages never serves stale CSS/JS."""
import hashlib
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/site'
OUT.mkdir(parents=True, exist_ok=True)
html = (ROOT / 'index.html').read_text(encoding='utf-8-sig')
for source, label, extension in [('stylesheet/style.css', 'style', 'css'), ('script/app.js', 'app', 'js')]:
    text = (ROOT / source).read_text(encoding='utf-8-sig')
    if extension == 'css':
        text = text.replace('../assets/fonts/', '../fonts/')
    data = text.encode('utf-8')
    name = f'{label}.{hashlib.sha256(data).hexdigest()[:12]}.{extension}'
    (OUT / name).write_bytes(data)
    html = re.sub(rf'(?:{re.escape(source)}|assets/site/{label}\.[a-f0-9]+\.{extension})', f'assets/site/{name}', html)
    print(name)
(ROOT / 'index.html').write_bytes(html.encode('utf-8'))
