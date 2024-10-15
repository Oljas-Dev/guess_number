// Confetti animation

//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
  { front: "red", back: "darkred" },
  { front: "green", back: "darkgreen" },
  { front: "blue", back: "darkblue" },
  { front: "yellow", back: "darkyellow" },
  { front: "orange", back: "darkorange" },
  { front: "pink", back: "darkpink" },
  { front: "purple", back: "darkpurple" },
  { front: "turquoise", back: "darkturquoise" },
];

//-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

let initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30),
      },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1,
      },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50),
      },
    });
  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(
      confetto.velocity.y + gravity,
      terminalVelocity
    );
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle =
      confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // Fire off another round of confetti
  if (confetti.length <= 10) initConfetti();

  window.requestAnimationFrame(render);
};

// //---------Execution--------
// initConfetti();
// render();

// //----------Resize----------
// window.addEventListener('resize', function () {
//   resizeCanvas();
// });

// //------------Click------------
// window.addEventListener('click', function () {
//   initConfetti();
// });

// ------------ Main Javascript presprition ------------

document.querySelector(".heading1").textContent =
  "guess my number".toUpperCase();

// ----- Levels -----

let secNum;
let score = 20;
let level = 1;

const secretNumber = function (num) {
  secNum = Math.trunc(Math.random() * num) + 1;

  return secNum;
};

const scoreDisplay = function (score) {
  document.querySelector(".score").textContent = score;
};

const levelConditions = function (condition) {
  document.querySelector(".between_numbers").textContent = condition;
};

const levelDisplay = function (lev) {
  document.querySelector(".level").textContent = lev;
};

scoreDisplay(score);
secretNumber(10);

document.querySelector(".l_down").addEventListener("click", function () {
  if (level > 1) {
    level--;
  }
  levelDisplay(level);

  if (level === 1) {
    secretNumber(10);
    score = 20;
    levelConditions("between 1 and 10");
  } else if (level === 2) {
    secretNumber(20);
    score = 25;
    levelConditions("between 1 and 20");
  }
  scoreDisplay(score);
});

document.querySelector(".l_up").addEventListener("click", function () {
  if (level < 3) {
    level++;
  }
  levelDisplay(level);

  if (level === 2) {
    secretNumber(20);
    score = 25;
    levelConditions("between 1 and 20");
  } else if (level === 3) {
    secretNumber(30);
    score = 30;
    levelConditions("between 1 and 30");
  }

  scoreDisplay(score);
});

// ----- Game logic -----

const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  // When there is no input
  if (!guess) {
    displayMessage("⛔ No Number!");
  }

  // When player wins
  else if (guess === secNum) {
    document.querySelector(".answer").textContent = secNum;
    displayMessage("🎉 Correct Number!");
    document.querySelector(".hint").textContent =
      "Do you want more confetti just click😍 Or start again";
    initConfetti();
    render();

    window.addEventListener("click", function () {
      initConfetti();
    });

    if (Number(localStorage.getItem("highscore")) > score) {
      return;
    } else if (Number(localStorage.getItem("highscore")) < score) {
      localStorage.setItem("highscore", score);
    }
  }

  // When guess is to high
  else if (guess !== secNum) {
    if (score > 1) {
      displayMessage(guess > secNum ? "📈 Too high!" : "📈 Too low!");
      score--;
      scoreDisplay(score);
    } else {
      displayMessage("😒 Game Over");
      score--;
      scoreDisplay(0);
    }
  }
});

// Handling Highscore in localStorage

if (!localStorage.getItem("highscore")) {
  document.querySelector(".highscore").textContent = "0";
} else if (localStorage.getItem("highscore")) {
  document.querySelector(".highscore").textContent =
    localStorage.getItem("highscore");
}

// Restarting the game

document.querySelector(".again").addEventListener("click", function () {
  location.reload();
});
