import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" fill="white"/>
  <text x="96" y="96" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="32" font-weight="600" fill="#000000">
    Ollvy
  </text>
</svg>`

async function main() {
  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/favicon-square.png')

  console.log('Generated public/favicon-square.png')
}

main().catch(console.error)
