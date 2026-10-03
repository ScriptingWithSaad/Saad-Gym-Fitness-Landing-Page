"""Check deployed asset paths, local anchors, unique IDs and accessible fields."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.labels, self.fields = [], [], [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        for key in ('src', 'href'):
            if attrs.get(key): self.refs.append(attrs[key])
        if attrs.get('srcset'):
            self.refs.extend(part.strip().split()[0] for part in attrs['srcset'].split(','))
        if tag == 'label': self.labels.append(attrs.get('for'))
        if tag in ('input', 'select', 'textarea'): self.fields.append(attrs.get('id'))
        if tag == 'img': assert 'alt' in attrs, 'Image missing alt text'
        if tag == 'a' and attrs.get('target') == '_blank':
            assert 'noopener' in attrs.get('rel', ''), 'External link missing noopener'
page = Page()
page.feed((ROOT / 'index.html').read_text(encoding='utf-8-sig'))
assert len(page.ids) == len(set(page.ids)), 'Duplicate IDs'
assert all(field in page.labels for field in page.fields), 'Unlabelled form field'
assets = set()
for ref in page.refs:
    if ref.startswith('#'):
        assert ref[1:] in page.ids, f'Broken anchor: {ref}'
    elif not urlsplit(ref).scheme:
        path = ROOT / unquote(urlsplit(ref).path)
        assert path.is_file(), f'Missing asset: {ref}'
        assets.add(path)
for css in [ROOT / 'stylesheet/style.css', *list((ROOT / 'assets/site').glob('*.css'))]:
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text(encoding='utf-8-sig')):
        assert (css.parent / ref).is_file(), f'Missing CSS asset: {ref}'
assert 'noaction.php' not in (ROOT / 'index.html').read_text(encoding='utf-8')
print(f'PASS: {len(assets)} local assets, unique IDs, anchors and labelled form controls')
