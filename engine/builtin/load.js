// Init script
game.scripts.init = (cb) => {
  game.local = {
    loaded: false,
    poweredByFont: 10,
    engineAlpha: 0,
    engineFont: 10,
    huskyLoaded: false,
    loadedFrame: 0,
    huskyAlpha: 0,
    huskySize: 10,
    poweredByAlpha: 0,
    fadeAway: 1,
    loadMain: false,
    current: 0,
    total: 0
  };

  cb();
};

// Button Listeners
game.scripts.onTouch = (button) => {

};

game.scripts.onTap = (button) => {

};

game.scripts.onHold = (button) => {

};

game.scripts.onUntouch = (button) => {

};


// Keyboard listeners
game.scripts.onKeyTouch = (key) => {

};

game.scripts.onKeyTap = (key) => {

};

game.scripts.onKeyHold = (key) => {

};

game.scripts.onKeyUntouch = (key) => {

};


// Button layout
game.scripts.layout = {

};

// Game logic loop
game.scripts.logic = (frame) => {
  // Load assets and update progress
  if (frame === 1) {
    let filesList = [];

    // Load image assets
    async.series([

      // Load files list
      cb => {
        $.get('/assets.manifest', (files) => {
          filesList = files;
          game.local.total = files.length;
          cb();
        });
      },

      // images
      cb => game.helpers.loadImg("huskyengine", "huskyengine.svg", () => {
        game.local.huskyLoaded = true;
        game.local.loadedFrame = game.renderFrame;
        cb();
      }),

      // Load all files and update progress
      cb => {
        async.eachLimit(filesList, 10, (file, loaded) => {
          game.helpers.loadImg(file, file, () => {
            game.local.fileName = file;
            game.local.current++;
            loaded();
          });
        }, cb);
      },

    // Finish init
    ], () => {
      game.helpers.setTimeout(() => {
        game.local.fileName = "";
      }, 1000);
      game.local.loaded = true;
    });
  }
};


// Game render loop
game.scripts.render = (frame) => {
  if (!game.local.huskyLoaded) return;
  game.animations.clear();

  if (!game.local.loadMain && game.local.loaded && game.renderFrame > game.local.loadedFrame + 300) {
    game.local.fadeAway -= .01;
    if (game.local.fadeAway < 0) {
      game.local.fadeAway = 0;
      game.local.loadMain = true;
    }
    alpha(game.local.fadeAway);
  }

  text(game.local.fileName, "16pt Arial", "center", 950);

  let prev = game.canvas.ctx.fillStyle;
  game.canvas.ctx.fillStyle = "#00F";
  game.canvas.ctx.fillRect(game.canvas.rwidth*.2, 960, (game.local.current/game.local.total)*(game.canvas.rwidth*.8-game.canvas.rwidth*.2), 50);
  game.canvas.ctx.fillStyle = prev;

  if (game.local.current/game.local.total > .5) {
    game.canvas.ctx.fillStyle = "#FFF";
  }
  text(((game.local.current/game.local.total)*100).toFixed(2) + "%", "20pt Arial", "center", 995);
  game.canvas.ctx.fillStyle = prev;

  text(game.local.current + " / " + game.local.total, "16pt Arial", "center", 1050);

  if (game.local.loadMain) {
    game.helpers.load('main');
  }

  // Powered By
  alpha(game.local.poweredByAlpha);
  if (game.renderFrame < game.local.loadedFrame + 210) {
    if (game.local.poweredByFont < 10) game.local.poweredByFont += .5;
    else if (game.local.poweredByFont < 20) game.local.poweredByFont += .4;
    else if (game.local.poweredByFont < 30) game.local.poweredByFont += .3;
    else if (game.local.poweredByFont < 40) game.local.poweredByFont += .2;
    else if (game.local.poweredByFont < 50) game.local.poweredByFont += .1;
  }

  text("Powered By", game.local.poweredByFont + "pt Arial", "center", 300);

  if (game.renderFrame < game.local.loadedFrame + 210) {
    game.local.poweredByAlpha += .01;
    alpha(1);
  }

  if (game.renderFrame > game.local.loadedFrame + 10) {
    alpha(game.local.huskyAlpha);
    drawImage('huskyengine', game.canvas.rwidth/2-(game.local.huskySize/2), game.canvas.rheight/2-(game.local.huskySize/2)-175+(game.local.huskySize/4), game.local.huskySize, game.local.huskySize);

    if (game.renderFrame < game.local.loadedFrame + 210) {
      game.local.huskyAlpha += .01;
      game.local.huskySize += 2;
      alpha(1);
    }
  }

  if (game.renderFrame > game.local.loadedFrame + 40) {
    alpha(game.local.engineAlpha);
    if (game.renderFrame < game.local.loadedFrame + 210) {
      if (game.local.engineFont < 10) game.local.engineFont += .5;
      else if (game.local.engineFont < 20) game.local.engineFont += .4;
      else if (game.local.engineFont < 30) game.local.engineFont += .3;
      else if (game.local.engineFont < 40) game.local.engineFont += .2;
      else if (game.local.engineFont < 50) game.local.engineFont += .1;
    }

    text("Husky Engine", game.local.engineFont + "pt Arial", "center", 750);

    if (game.renderFrame < game.local.loadedFrame + 210) {
      game.local.engineAlpha += .01;
      alpha(1);
    }
  }
};