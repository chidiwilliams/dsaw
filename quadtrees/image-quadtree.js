/**
 * A Point holds (x,y) coordinates.
 * @typedef {{x:number, y: number}} Point
 */

/**
 * A Boundary is an enclosed rectangular area.
 * @typedef {{x1:number, x2: number, y1: number, y2: number}} Boundary
 */

/**
 * @typedef {{r: number, g: number, b: number}} Color
 */

/**
 * A region Quadtree with a color and error value
 *
 * @typedef {{
 *  boundary: Boundary,
 *  children?: ImageQuadtree[],
 *  color?: Color,
 *  error?: number
 * }} ImageQuadtree
 */

/**
 * Returns a quadtree representing the pixel values compressed within maxError
 *
 * @param {Color[][]} pixels
 * @param {number} w
 * @param {number} h
 * @param {ImageQuadtree} node
 * @param {number} maxError
 * @returns
 */
function compress(pixels, w, h, node, maxError) {
  const avg = average(pixels, w, h);
  const err = error(pixels, w, h, avg);

  // If the amount of error in this node is less than the maximum
  //  error, store the color and error values in the node
  if (err < maxError) {
    node.color = avg;
    node.error = err;
    return;
  }

  // If the node has more than the maximum allowed amount
  // of error, split the node into child nodes

  const { x1, x2, y1, y2 } = node.boundary;
  const midX = Math.floor((x1 + x2) / 2);
  const midY = Math.floor((y1 + y2) / 2);

  node.children = [
    createNode({ x1: x1, y1: y1, x2: midX, y2: midY }), // Top-left
    createNode({ x1: x1, y1: midY + 1, x2: midX, y2: y2 }), // Bottom-left
    createNode({ x1: midX + 1, y1: y1, x2: x2, y2: midY }), // Top-right
    createNode({ x1: midX + 1, y1: midY + 1, x2: x2, y2: y2 }), // Bottom-right
  ];

  // ...then compress each of the child nodes
  node.children.forEach((child) => {
    const startx = child.boundary.x1 - x1;
    const endx = child.boundary.x2 - x1;
    const starty = child.boundary.y1 - y1;
    const endy = child.boundary.y2 - y1;
    const childPixels = slice2d(pixels, startx, endx, starty, endy);

    const childW = midX - x1;
    const childH = midY - y1;

    compress(childPixels, childW, childH, child, maxError);
  });
}

/**
 * Returns the average color in pixels
 *
 * @param {Color[][]} pixels
 * @param {number} w
 * @param {number} h
 * @returns {Color}
 */
function average(pixels, w, h) {
  let r = 0;
  let g = 0;
  let b = 0;

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const pixel = pixels[row][col];
      r += pixel.r;
      g += pixel.g;
      b += pixel.b;
    }
  }

  const n = h * w;
  return {
    r: Math.round(r / n),
    g: Math.round(g / n),
    b: Math.round(b / n),
  };
}

/**
 * Returns the amount of error in pixels.
 * The error is the average difference between each pixel's color
 * and the average color in pixels.
 *
 * @param {Color[][]} pixels
 * @param {number} w
 * @param {number} h
 * @param {Color} avg
 * @returns
 */
function error(pixels, w, h, avg) {
  let dr = 0;
  let dg = 0;
  let db = 0;

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const pixel = pixels[row][col];
      dr += Math.abs(pixel.r - avg.r);
      dg += Math.abs(pixel.g - avg.g);
      db += Math.abs(pixel.b - avg.b);
    }
  }

  return (dr + dg + db) / (h * w);
}

/**
 * Slices a 2-dimensional array.
 *
 * @template T
 * @param {T[][]} arr
 * @param {number} startx
 * @param {number} endx
 * @param {number} starty
 * @param {number} endy
 * @returns
 */
function slice2d(arr, startx, endx, starty, endy) {
  return arr.slice(starty, endy + 1).map((row) => row.slice(startx, endx + 1));
}

/**
 * Returns a new ImageQuadtree node
 *
 * @param {Boundary} boundary
 * @returns {ImageQuadtree}
 */
function createNode(boundary) {
  return { boundary, children: null, color: null, error: null };
}

module.exports = { compress };
