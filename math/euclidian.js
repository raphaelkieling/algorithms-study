const state = {
  screen: {
    w: 600,
    h: 600
  },
  points: [],
  first: {}
};

function getRandom(v) {
  return parseInt(random(0, v));
}

function createPoint() {
  for (let index = 0; index < 20; index++) {
    const { w, h } = state.screen;
    if (index == 0) {
      state.first = createVector(getRandom(w), getRandom(h));
      state.points.push(state.first);
    } else state.points.push(createVector(getRandom(w), getRandom(h)));
  }
}

function calc() {
  const { first, points } = state;
  points.forEach(({ x, y }, i) => {
    const result = Math.sqrt(
      Math.pow(first.x - x, 2) + Math.pow(first.y - y, 2)
    );
    if (i === 0) {
      fill("blue");
    } else if (result < mouseX) {
      fill("red");
    } else {
      fill("black");
    }

    line(first.x, first.y, x, y);
    circle(x, y, 10);
    text(`(${x}, ${y}) - (${result})`, x, y - 10);
  });
}

function setup() {
  createPoint();
}

function draw() {
  const { w, h } = state.screen;
  createCanvas(w, h);
  calc();

  text(mouseX, 10, 20);
}
