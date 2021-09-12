/**
 * A Point holds (x,y) coordinates.
 * @typedef {{x:number, y: number}} Point
 */

/**
 * A Boundary is an enclosed rectangular area.
 * @typedef {{topLeft: Point, bottomRight: Point}} Boundary
 */

/**
 * @typedef {{r: number, g: number, b: number}} Color
 */

/**
 * A region Quadtree with a color and detail value
 *
 * @typedef {{
 *  boundary: Boundary,
 *  children?: ImageQuadtree[],
 *  color?: Color,
 *  detail?: number
 * }} ImageQuadtree
 */

/**
 * Returns a quadtree representing the pixel values compressed within maxDetail
 *
 * @param {Color[][]} pixels
 * @param {number} w
 * @param {number} h
 * @param {ImageQuadtree} node
 * @param {number} maxDetail
 * @returns
 */
function compress(pixels, w, h, node, maxDetail) {
  const avg = average(pixels, w, h);
  const det = detail(pixels, w, h, avg);

  // If the amount of detail in this node is less than the maximum
  //  detail, store the color and detail values in the node
  if (det < maxDetail) {
    node.color = avg;
    node.detail = det;
    return;
  }

  // If the node has more than the maximum allowed amount
  // of detail, split the node into child nodes

  const { topLeft, bottomRight } = node.boundary;
  const midPoint = {
    x: Math.floor((topLeft.x + bottomRight.x) / 2),
    y: Math.floor((topLeft.y + bottomRight.y) / 2),
  };

  node.children = [
    createNode({ x: topLeft.x, y: topLeft.y }, { x: midPoint.x, y: midPoint.y }), // Top-left
    createNode({ x: topLeft.x, y: midPoint.y + 1 }, { x: midPoint.x, y: bottomRight.y }), // Bottom-left
    createNode({ x: midPoint.x + 1, y: topLeft.y }, { x: bottomRight.x, y: midPoint.y }), // Top-right
    createNode({ x: midPoint.x + 1, y: midPoint.y + 1 }, { x: bottomRight.x, y: bottomRight.y }), // Bottom-right
  ];

  // ...then compress each of the child nodes
  node.children.forEach((child) => {
    const startx = child.boundary.topLeft.x - topLeft.x;
    const endx = child.boundary.bottomRight.x - topLeft.x;
    const starty = child.boundary.topLeft.y - topLeft.y;
    const endy = child.boundary.bottomRight.y - topLeft.y;
    const childPixels = slice2d(pixels, startx, endx, starty, endy);

    const childW = midPoint.x - topLeft.x;
    const childH = midPoint.y - topLeft.y;

    compress(childPixels, childW, childH, child, maxDetail);
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
 * Returns the amount of detail in pixels.
 * The detail is the average difference between each pixel's color
 * and the average color in pixels.
 *
 * @param {Color[][]} pixels
 * @param {number} w
 * @param {number} h
 * @param {Color} avg
 * @returns
 */
function detail(pixels, w, h, avg) {
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
 * @param {Point} topLeft
 * @param {Point} bottomRight
 * @returns {ImageQuadtree}
 */
function createNode(topLeft, bottomRight) {
  return { boundary: { topLeft, bottomRight }, children: null, color: null, detail: null };
}

module.exports = { compress };
