/* exported buildScene */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// getRandomInt function obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function buildScene() {
  let scene = {};
  scene.background = 'gray'
  scene.panels = [];
  scene.texts = [];
  for(var i = 2; i < 33 ; i++){
    scene.panels.push({ x: getRandomInt(-90), y: getRandomInt(-90), w: 20 , h: 90, color: "black", z: getRandomInt(-90) * i});
    scene.panels.push({ x: 20 * i, y: 30 * i, w: -i , h: i * -150, color: "black", z:9});
  }
  for( var j = 1; j < 101; j++ ){
    scene.panels.push({ x: getRandomInt(-10) * i, y: 7, w: -4000 , h: getRandomInt(1) * j, color: "white", z: getRandomInt(-10) * i});
  }
  scene.panels.push({ x:-200, y: -35, w: 50 , h: 50, color: "white", z:40});
  scene.texts.push({ text: "The Beggining of the end?", color: "white", x: 90 , y: -80, z: -20});
  scene.texts.push({ text: "Or the End of the Beggining?", color: "black", x: -375 , y: -75, z: -50});

  return scene;
}