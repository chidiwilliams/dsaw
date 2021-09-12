const getPixels = require('get-pixels');
const { compress } = require('./image-quadtree');

const images = (function () {
  function parse(path) {
    return new Promise((resolve, reject) => {
      getPixels(path, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const [w, h] = data.shape;

        const pixels = [];
        for (let y = 0; y < h; y++) {
          const row = [];
          for (let x = 0; x < w; x++) {
            const r = data.get(x, y, 0);
            const g = data.get(x, y, 1);
            const b = data.get(x, y, 2);
            row.push({ r, g, b });
          }
          pixels.push(row);
        }

        resolve({ pixels, w, h });
      });
    });
  }

  return { parse };
})();

const graphics = (function () {
  let image;

  function drawTree(tree, width, height) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 1;

    canvas.width = width * scale;
    canvas.height = height * scale;

    drawNode(tree, ctx);
  }

  function drawNode(node, ctx) {
    if (!node.children) {
      const { r, g, b } = node.color;
      ctx.fillStyle = `rgba(${r},${g},${b})`;
      const { topLeft, bottomRight } = node.boundary;
      ctx.fillRect(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x + 1,
        bottomRight.y - topLeft.y + 1
      );
      return;
    }

    node.children.forEach((child) => {
      drawNode(child, ctx);
    });
  }

  async function init() {
    image = await images.parse(
      'https://pbs.twimg.com/profile_images/666068102673596421/kvffdCnC_400x400.jpg'
    );
    draw(50);
  }

  function draw(maxDetail) {
    const { pixels, w, h } = image;
    const node = {
      boundary: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: w - 1, y: h - 1 },
      },
    };
    compress(pixels, w, h, node, maxDetail);
    drawTree(node, w, h);
  }

  return { init, draw };
})();

graphics.init();

document.querySelector('input#detail').addEventListener('change', (evt) => {
  const selected = evt.target.value;
  graphics.draw(selected);
});
