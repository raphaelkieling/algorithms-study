const state = {
  w: 400,
  h: 200,
  player: null,
  fruits: [],
  games: [],
  timerFruits: null,
  timer: null,
  timerSeconds: 0,
  gravityForce: 1
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.lifes = 3;
    this.w = 100;
    this.h = 20;
  }

  draw() {
    noStroke();
    fill("black");
    text(this.score, 20, 20);

    noStroke();
    fill("red");
    text(this.lifes, 20, 40);

    fill("black");
    rect(this.x, this.y, this.w, this.h);
  }

  onHitFruit() {
    this.score += 1;
  }

  loseLife() {
    this.lifes -= 1;
    if (this.lifes < 0) {
      newGame();
      state.games.push(this.score);
    }
  }
}

class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 10;
  }

  draw() {
    fill("black");
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

function newGame() {
  state.player = new Player(state.w / 2 - 50, state.h - 40);
  if (state.timerFruits) {
    clearInterval(state.timerFruits);
  }

  if (state.timer) {
    clearInterval(state.timer);
  }

  state.fruits = [];
  state.timerSeconds = 0;
  state.gravityForce = 1;
  state.timer = setInterval(() => {
    state.timerSeconds += 1;
    state.gravityForce += 0.1;
  }, 1000);
  state.timerFruits = setInterval(() => {
    const fruit = new Fruit(random(0, state.w), -10);
    state.fruits.push(fruit);
  }, 1000);
}

function setup() {
  newGame();
}

function draw() {
  const { w, h } = state;
  createCanvas(w, h);
  stroke(1);
  rect(0, 0, w, h);

  noStroke();
  fill("black");
  text(state.timerSeconds, 20, 60);

  // player
  if (keyIsDown(LEFT_ARROW)) {
    state.player.x -= 5;
  } else if (keyIsDown(RIGHT_ARROW)) {
    state.player.x += 5;
  }
  state.player.draw();

  //fruits
  const { player } = state;
  for (let i = 0; i < state.fruits.length; i++) {
    const element = state.fruits[i];
    if (element) {
      if (
        player.x < element.x &&
        player.x + player.w > element.x &&
        player.y < element.y + element.h &&
        player.y + player.h > element.y
      ) {
        player.onHitFruit();
        delete state.fruits[i];
      }

      if (element.y > state.h) {
        delete state.fruits[i];
        player.loseLife();
      }
      element.y += state.gravityForce;
      element.draw();
    }
  }
}
