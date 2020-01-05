/**
 * Algorith A*
 *
 * F = G + H
 * g = é o ponto de início (pai) até o ponto em que se está atualmente
 * h = é a heutírisca ou seja um calculo da distancia para se chegar
 * até o ponto B que foi definido inicialmente.
 */

const state = {
  grid_size: 50,
  /**
   * w = wall
   * g = goal
   * p = player
   * s = sand
   */
  map_def: [
    ["w", "w", "w", "w", "s", "w", "s", "w", "w", "s", "s", "g"],
    ["w", "w", "w", "w", "s", "w", "w", "w", "w", "w", "w", "s"],
    ["w", "w", "w", "w", "w", "w", "s", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "s", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "s", "w", "w", "w", "w", "s", "s", "w"],
    ["w", "s", "w", "w", "s", "s", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "s", "w", "s", "s"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "p", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
  ],
  player: [],
  goal: [],
  open_set: [],
  closed_set: [],
  map: [],
  debug: {
    text: true
  }
};

class Block {
  constructor(x, y, s, type) {
    this.x = x;
    this.y = y;
    this.size = s;
    this.type = type;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.selected = false;
  }

  addNeighbors(map) {
    const { x, y } = this;

    if (y < map.length - 1) this.neighbors.push(map[y + 1][x]);
    if (y > 0) this.neighbors.push(map[y - 1][x]);
    if (x < map[0].length - 1) this.neighbors.push(map[y][x + 1]);
    if (x > 0) this.neighbors.push(map[y][x - 1]);

    // diagonal
    if (y > 0 && x > 0) this.neighbors.push(map[y - 1][x - 1]);
    if (y < map.length - 1 && x > 0) this.neighbors.push(map[y + 1][x - 1]);
    if (y > 0 && x < map[0].length - 1) this.neighbors.push(map[y - 1][x + 1]);
    if (y < map.length - 1 && x < map[0].length - 1)
      this.neighbors.push(map[y + 1][x + 1]);
  }

  draw() {
    let color;
    if (this.selected) color = [0, 255, 255];
    else if (this.type === "w") color = [255, 255, 255];
    else if (this.type === "p") color = [0, 255, 0];
    else if (this.type === "g") color = [0, 0, 255];
    else if (this.type === "s") color = [255, 255, 0];
    fill(...color);
    rect(this.x * this.size, this.y * this.size, this.size, this.size);

    if (state.debug.text) {
      // position text
      fill(0, 0, 0);
      const middle_x = this.x * this.size + this.size / 2;
      const middle_y = this.y * this.size + this.size / 2;
      text(`[${this.x}, ${this.y}]`, middle_x, middle_y);
      textSize(9);
      textAlign(CENTER, CENTER);
      // position g
      fill(0, 0, 0);
      text(
        `g: ${this.g}`,
        this.x * this.size + 10,
        this.y * this.size + this.size * 0.85
      );
      textSize(9);

      // position f
      fill(0, 0, 0);
      text(`f: ${this.f}`, this.x * this.size + 10, this.y * this.size + 10);
      textSize(9);

      // position h
      fill(0, 0, 0);
      text(
        `h: ${this.h}`,
        this.x * this.size + this.size * 0.8,
        this.y * this.size + 10
      );
      textSize(9);
    }
  }
}

function createMap() {
  return state.map_def.map((row, c_index) => {
    return row.map((type, r_index) => {
      const { grid_size } = state;
      const x = r_index;
      const y = c_index;
      const block = new Block(x, y, grid_size, type);

      if (type === "p") state.player = block;
      if (type === "g") state.goal = block;

      return block;
    });
  });
}

function initNeighbors() {
  return state.map.map(row => {
    return row.map(block => {
      block.addNeighbors(state.map);
      return block;
    });
  });
}

function setup() {
  state.map = createMap();
  state.map = initNeighbors();

  createCanvas(
    state.map[0].length * state.grid_size,
    state.map.length * state.grid_size
  );

  state.open_set.push(state.player);
}

function heuristic(neighbor, end) {
  return dist(neighbor.x, neighbor.y, end.x, end.y);
}

function drawWay(block) {
  if (!block.previous) return;

  if (block.type !== "g") {
    block.selected = true;
  }

  drawWay(block.previous);
}

function draw() {
  if (state.map)
    state.map.forEach(rows => {
      rows.forEach(block => {
        block.draw();
      });
    });

  if (state.open_set.length) {
    let winner = 0;
    state.open_set.forEach((block, index) => {
      if (block.f < state.open_set[winner].f) {
        winner = index;
      }
    });

    if (state.open_set[winner] === state.goal) {
      drawWay(state.goal);
    }

    let current = state.open_set[winner];
    state.open_set = state.open_set.filter(a => a !== current);
    state.closed_set.push(current);

    current.neighbors.forEach(block => {
      if (!state.closed_set.includes(block) && block.type !== "s") {
        let tempG = current.g + 1;

        if (state.open_set.includes(block)) {
          if (tempG < block.g) {
            block.g = tempG;
          }
        } else {
          block.g = tempG;
          state.open_set.push(block);
        }
        const heuristic_value = parseFloat(heuristic(block, state.goal));
        const f_value = parseFloat(block.g + block.h);

        block.h = heuristic_value.toFixed(2);
        block.f = f_value.toFixed(2);
        block.previous = current;
      }
    });
  }
}
