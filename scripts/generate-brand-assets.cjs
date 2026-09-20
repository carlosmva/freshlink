const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');
const leafMark = path.join(pub, 'leaf-mark.svg');
const fullSrc = path.join(pub, 'full-logo.svg');

async function leafSquare(size, background, padding = 0.1) {
  const inner = Math.max(1, Math.round(size * (1 - padding * 2)));
  const leaf = await sharp(leafMark)
    .resize(inner, inner, { fit: 'contain', background })
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: leaf, gravity: 'center' }])
    .png();
}

async function writeLeaf(size, file, opts = {}) {
  const background = opts.background ?? { r: 0, g: 0, b: 0, alpha: 0 };
  await (await leafSquare(size, background, opts.padding ?? 0.08)).toFile(path.join(pub, file));
  console.log('wrote', file);
}

async function main() {
  fs.copyFileSync(leafMark, path.join(pub, 'favicon.svg'));

  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const white = { r: 255, g: 255, b: 255, alpha: 255 };

  await writeLeaf(16, 'favicon-16.png', { background: clear, padding: 0.06 });
  await writeLeaf(32, 'favicon-32.png', { background: clear, padding: 0.06 });
  await writeLeaf(48, 'favicon-48.png', { background: clear, padding: 0.06 });
  await writeLeaf(180, 'apple-touch-icon.png', { background: white, padding: 0.14 });
  await writeLeaf(192, 'icon-192.png', { background: white, padding: 0.12 });
  await writeLeaf(512, 'icon-512.png', { background: white, padding: 0.12 });
  await writeLeaf(128, 'logo-leaf.png', { background: clear, padding: 0.04 });

  const raster = await sharp(fullSrc, { density: 144 }).ensureAlpha().png().toBuffer();
  const trimmed = await sharp(raster).trim({ threshold: 8 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  await sharp(trimmed)
    .resize({ width: 480, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'logo-full.png'));
  await sharp(trimmed)
    .resize({ width: 960, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'logo-full@2x.png'));
  console.log('wrote logo-full.png and logo-full@2x.png', meta.width, 'x', meta.height);

  execFileSync('magick', [
    path.join(pub, 'favicon-16.png'),
    path.join(pub, 'favicon-32.png'),
    path.join(pub, 'favicon-48.png'),
    path.join(pub, 'favicon.ico'),
  ]);
  console.log('wrote favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
