let compiledScene;
let statsEnabled = false;

/* exported setup */
function setup() {
  if (typeof window.buildScene != "function") {
    console.error("buildScene should be a defined function");
  } else {
    compiledScene = compileScene(window.buildScene());
    createCanvas(400, 200);
  }
}

/* exported keyPressed */
function keyPressed() {
  if (keyCode == 83) {
    statsEnabled = !statsEnabled;
    // 's'
  } else if (keyCode == 71) {
    // 'g'
    renderGif();
  }
}

/* exported draw */
function draw() {
  background(100);
  renderScene(compiledScene);
}

function compileScene(scene) {
  const compiledScene = {
    background: 50,
    items: []
  };

  if (scene.panels === undefined) {
    console.error("Scene has no panels?");
  } else {
    const defaultPanel = {
      x: 0,
      y: 0,
      z: 0,
      w: 10,
      h: 10,
      color: "#facade"
    };
    scene.panels.forEach(panel => {
      compiledScene.items.push(Object.assign({}, defaultPanel, panel));
    });
  }

  if (scene.texts === undefined) {
    console.error("Scene has no texts?");
  } else {
    const defaultText = {
      x: 0,
      y: 0,
      z: 0,
      size: 12,
      text: "?text?",
      color: "#facade"
    };

    scene.texts.forEach(panel => {
      compiledScene.items.push(Object.assign({}, defaultText, panel));
    });
  }

  if (scene.background === undefined) {
    console.error("Scene has no background?");
  } else {
    compiledScene.background = scene.background;
  }

  compiledScene.items.sort((a, b) => b.z - a.z);
  return compiledScene;
}

function renderScene(compiledScene) {
  background(compiledScene.background);

  let camZ = 20 * noise(millis() / 13000.0) - width;
  let camX = constrain(mouseX, 0, width) + 20 * noise(millis() / 18000.0);
  let camY = height / 2 + 20 * noise(millis() / 15000.0);

  rectMode(CENTER);
  noStroke();

  compiledScene.items.forEach(e => {
    const z = (-camZ + e.z) / width;
    stroke(e.color);
    fill(e.color);
    if (e.text) {
      textSize(e.size / z);
      text(
        e.text,
        (e.x + camX - width / 2) / z + width / 2,
        (e.y + camY - height / 2) / z + height / 2
      );
    } else {
      rect(
        (e.x + camX - width / 2) / z + width / 2,
        (e.y + camY - height / 2) / z + height / 2,
        e.w / z,
        e.h / z
      );
    }
  });

  if (statsEnabled) {
    textSize(20);
    stroke(0);
    fill(255);
    let msg = `${compiledScene.items.length} items, ${frameRate().toFixed(0)} fps`;
    text(msg, 0, 20);
  }
}

function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

let renderingInProgress = false;

async function renderGif() {
  if (renderingInProgress) {
    return;
  }

  renderingInProgress = true;

  /* global GIF */
  let gif = new GIF({
    workerScript: "/.data/gif.worker.js"
  });
  let canvas = document.getElementsByTagName("canvas")[0];

  const steps = 60;
  for (let i = 0; i < steps; i++) {
    mouseX = (i * width) / steps;
    gif.addFrame(canvas, { delay: 1, copy: true });
    await delay(1);
  }
  gif.on("finished", function(blob) {
    renderingInProgress = false;
    window.location = URL.createObjectURL(blob);
  });

  gif.render();
}
