// Builds dist-wavedash/ for Wavedash: three.js r128 served locally (the host is cross-origin isolated)
// and tools/wavedash-hooks.js appended. index.html itself is not modified.
import fs from 'node:fs';

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const out = 'dist-wavedash';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes(CDN)) throw new Error('three.js CDN tag not found');
html = html.replace(CDN, './three.min.js');
const hooks = fs.readFileSync('tools/wavedash-hooks.js', 'utf8');
html = html.replace(/<\/body>\s*<\/html>\s*$/, `<script>\n${hooks}</script>\n</body>\n</html>\n`);
fs.writeFileSync(`${out}/index.html`, html);

const res = await fetch(CDN);
if (!res.ok) throw new Error(`three.js download failed: ${res.status}`);
fs.writeFileSync(`${out}/three.min.js`, Buffer.from(await res.arrayBuffer()));
console.log('built', out);
