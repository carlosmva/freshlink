const fs = require('fs');

const files = fs.readdirSync('.').filter((f) => f.endsWith('.html') && f.includes('Mockup'));
if (!files.length) {
  console.error('no mockup html');
  process.exit(1);
}
const file = files[0];
let s = fs.readFileSync(file, 'utf8');
const before = s;

s = s.replace(
  /--green:#2F7D4E;\s*--green-deep:#1F5A38;\s*--green-tint:#E8F2EB;/,
  '--brand-forest:#116722;\n    --brand-leaf:#4F9E23;\n    --green:var(--brand-leaf);\n    --green-deep:var(--brand-forest);\n    --green-tint:#E8F3E0;',
);

s = s.replace(
  ".brand-name{font-family:'Satoshi';font-weight:900;font-size:20px;letter-spacing:-.02em;}",
  ".brand-logo{display:block;height:96px;width:auto;max-width:min(300px,72vw);object-fit:contain;}\n  .brand-name{font-family:'Satoshi';font-weight:900;font-size:20px;letter-spacing:-.02em;color:var(--green-deep);}",
);

s = s.replace(
  ".app-header .who .fn{font-family:'Satoshi';font-weight:900;font-size:16px;letter-spacing:-.01em;}",
  ".app-header .who .fn{font-family:'Satoshi';font-weight:900;font-size:16px;letter-spacing:-.01em;color:var(--green-deep);}",
);

s = s.replace(/color:#9FD3B4/g, 'color:var(--green)');
s = s.replace(
  '.btn{display:block;width:100%;text-align:center;background:var(--green);',
  '.btn{display:block;width:100%;text-align:center;background:var(--green-deep);',
);
s = s.replace('.btn-sm.solid{background:var(--green);', '.btn-sm.solid{background:var(--green-deep);');
s = s.replace('.side-logo b span{color:#7FC79A;}', '.side-logo b span{color:var(--green);}');
s = s.replace('.side-item.active svg{opacity:1;color:#7FC79A;}', '.side-item.active svg{opacity:1;color:var(--green);}');
s = s.replace('.btn-primary{background:var(--green);', '.btn-primary{background:var(--green-deep);');
s = s.replace(
  '.ai-insight .ic{width:30px;height:30px;border-radius:8px;background:var(--green);',
  '.ai-insight .ic{width:30px;height:30px;border-radius:8px;background:var(--green-deep);',
);
s = s.replace('.btn-accept{background:var(--green);', '.btn-accept{background:var(--green-deep);');
s = s.replace(/#2F7D4E/g, '#4F9E23');
s = s.replace(/#E8F2EB/g, '#E8F3E0');

const pin24 =
  '<svg width="24" height="24" viewBox="0 0 32 32" fill="none"><path d="M16 2.5C10.2 2.5 5.8 7.2 5.8 12.8C5.8 20.8 16 29.5 16 29.5C16 29.5 26.2 20.8 26.2 12.8C26.2 7.2 21.8 2.5 16 2.5Z" stroke="#7FC79A" stroke-width="2.4" fill="#16324F"/><path d="M16 9.5C12.6 11.2 12.2 16.4 16 18.9C19.8 16.4 19.4 11.2 16 9.5Z" fill="#7FC79A"/></svg>';
s = s.split(pin24).join('<img src="public/leaf-mark.svg" width="24" height="24" alt="">');

const pin30 =
  '<svg width="30" height="30" viewBox="0 0 32 32" fill="none"><path d="M16 2.5C10.2 2.5 5.8 7.2 5.8 12.8C5.8 20.8 16 29.5 16 29.5C16 29.5 26.2 20.8 26.2 12.8C26.2 7.2 21.8 2.5 16 2.5Z" stroke="#16324F" stroke-width="2.4" fill="#E8F3E0"/><path d="M16 9.5C12.6 11.2 12.2 16.4 16 18.9C19.8 16.4 19.4 11.2 16 9.5Z" fill="#4F9E23"/></svg>';
s = s.split(pin30).join('<img src="public/leaf-mark.svg" width="30" height="30" alt="">');

const topPin = `      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-label="FreshLink logo">
        <path d="M16 2.5C10.2 2.5 5.8 7.2 5.8 12.8C5.8 20.8 16 29.5 16 29.5C16 29.5 26.2 20.8 26.2 12.8C26.2 7.2 21.8 2.5 16 2.5Z" stroke="#16324F" stroke-width="2.4" fill="#E8F3E0"/>
        <path d="M16 9.5C12.6 11.2 12.2 16.4 16 18.9C19.8 16.4 19.4 11.2 16 9.5Z" fill="#4F9E23"/>
        <path d="M16 11V17.5" stroke="#E8F3E0" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <div class="brand-name">Fresh<span>Link</span> Detroit</div>`;
const topLockup =
  '      <img class="brand-logo" src="public/logo-full.png" srcset="public/logo-full.png 1x, public/logo-full@2x.png 2x" width="200" height="192" alt="FreshLink Detroit">';

if (!s.includes(topPin)) {
  console.error('top pin block not found');
  const idx = s.indexOf('aria-label="FreshLink logo"');
  console.log('idx', idx);
  console.log(JSON.stringify(s.slice(Math.max(0, idx - 80), idx + 520)));
  process.exit(1);
}
s = s.replace(topPin, topLockup);

if (s === before) {
  console.error('no changes');
  process.exit(1);
}
fs.writeFileSync(file, s);
console.log('updated', file);
console.log('remaining old greens', (s.match(/#2F7D4E|#7FC79A|#1F5A38|#9FD3B4|#E8F2EB/g) || []).length);
console.log('remaining pin svg', (s.match(/M16 2\.5C10\.2/g) || []).length);
