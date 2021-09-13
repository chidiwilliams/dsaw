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
  let tree;

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

  function getLeafCount() {
    let count = 0;
    visit(tree);

    function visit(node) {
      if (!node.children) {
        count++;
        return;
      }

      node.children.forEach((child) => {
        visit(child);
      });
    }

    return count;
  }

  async function init(imageUrl, maxError) {
    image = await images.parse(imageUrl);
    draw(maxError);
  }

  function draw(maxError) {
    const { pixels, w, h } = image;
    tree = {
      boundary: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: w - 1, y: h - 1 },
      },
    };
    compress(pixels, w, h, tree, maxError);
    drawTree(tree, w, h);
  }

  return { init, draw, getLeafCount };
})();

const canvasElement = document.querySelector('canvas');
const errorInputElement = document.querySelector('input#error');
const errorValueElement = document.querySelector('span.error-value');
const nodeCountValueElement = document.querySelector('span.node-count-value');
const imageSizeValueElement = document.querySelector('span.image-size-value');

function refreshView(value) {
  errorValueElement.textContent = `${value}`;
  nodeCountValueElement.textContent = `${graphics.getLeafCount()}`;
  canvasElement.toBlob((blob) => {
    imageSizeValueElement.textContent = `${Number(blob.size / 1000).toFixed(2)} Kbytes`;
  });
}

const defaultError = 50;
let currentError = defaultError;

graphics.init('https://picsum.photos/256', defaultError).then(() => {
  errorInputElement.value = defaultError;
  refreshView(defaultError);

  errorInputElement.addEventListener('change', (evt) => {
    currentError = evt.target.value;
    graphics.draw(currentError);
    refreshView(currentError);
  });
});

function randomizeView() {
  // Adding x=random() prevents browser caching
  graphics.init(`https://picsum.photos/256?x=${Math.random()}`, currentError).then(() => {
    errorInputElement.value = currentError;
    refreshView(currentError);
  });
}

canvasElement.addEventListener('click', () => {
  randomizeView();
});

canvasElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === 'Space') {
    event.preventDefault();
    randomizeView();
  }
});
