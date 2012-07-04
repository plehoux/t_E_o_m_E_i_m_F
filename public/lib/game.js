(function() {
  var Game;

  Game = (function() {

    function Game(selector) {
      var num, protagonist, _i, _len, _ref,
        _this = this;
      this.body = document.getElementsByTagName('body')[0];
      this.canvas = document.getElementById(selector);
      this.ids = {
        logo: document.getElementById('logo'),
        counter: document.getElementById('counter')
      };
      this.initCanvas(this.canvas);
      this.protagonists = (function() {
        var _results;
        _results = [];
        for (num = 1; num <= 4; num++) {
          _results.push(new Protagonist(num));
        }
        return _results;
      })();
      this.positions = [];
      _ref = this.protagonists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        protagonist = _ref[_i];
        this.positions.push({
          x: protagonist.anchorX,
          y: protagonist.anchorY,
          counter: 0
        });
      }
      this.bot = true;
      setInterval(function() {
        return _this.update();
      }, 16);
    }

    Game.prototype.play = function() {
      this.ids.logo.style.display = "none";
      this.points = new Array(0, 0, 0, 0);
      this.bot = false;
      this.reset();
      this.count = 3;
      return this.counter();
    };

    Game.prototype.counter = function() {
      var _this = this;
      console.debug(this.ids.counter);
      this.ids.counter.innerHTML = this.count;
      return setTimeout(function() {
        _this.count--;
        if (_this.count > 0) {
          return _this.counter();
        } else {
          _this.ids.counter.style.display = "none";
          return _this.start();
        }
      }, 1000);
    };

    Game.prototype.start = function() {
      this.initKeyboard();
      return this.initTouches();
    };

    Game.prototype.initTouches = function() {
      var _this = this;
      this.body.addEventListener('touchstart', function(event) {
        return _this.testTouches(event.touches);
      });
      return this.body.addEventListener('touchend', function(event) {
        var protagonist, _i, _len, _ref;
        _ref = _this.protagonists;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          protagonist = _ref[_i];
          protagonist.produce = false;
        }
        return _this.testTouches(event.touches);
      });
    };

    Game.prototype.testTouches = function(touches) {
      var i, touch, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = touches.length; _i < _len; _i++) {
        touch = touches[_i];
        _results.push((function() {
          var _ref, _results2;
          _results2 = [];
          for (i = 1, _ref = this.protagonists.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
            if (this.protagonists[i - 1].touched(touch.clientX, touch.clientY)) {
              _results2.push(this.protagonists[i - 1].produce = true);
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Game.prototype.initKeyboard = function() {
      var _this = this;
      this.body.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
          case 81:
            return _this.protagonists[0].produce = true;
          case 80:
            return _this.protagonists[1].produce = true;
          case 77:
            return _this.protagonists[2].produce = true;
          case 90:
            return _this.protagonists[3].produce = true;
        }
      });
      return this.body.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
          case 81:
            return _this.protagonists[0].produce = false;
          case 80:
            return _this.protagonists[1].produce = false;
          case 77:
            return _this.protagonists[2].produce = false;
          case 90:
            return _this.protagonists[3].produce = false;
        }
      });
    };

    Game.prototype.updateBot = function() {
      var i, _ref, _results;
      if (Math.random() > 0.5) {
        _results = [];
        for (i = 1, _ref = this.protagonists.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
          if (Math.random() > Math.random() && this.protagonists[i - 1].produce) {
            this.protagonists[i - 1].produce = false;
          }
          if (Math.random() > Math.random() && !this.protagonists[i - 1].produce) {
            _results.push(this.protagonists[i - 1].produce = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Game.prototype.initCanvas = function() {
      this.body.addEventListener("touchmove", function(event) {
        event.preventDefault();
        return false;
      });
      return this.ctx = this.canvas.getContext("2d");
    };

    Game.prototype.update = function() {
      var i, p, position, _i, _len, _len2, _ref, _ref2, _results;
      if (this.bot) this.updateBot();
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      if (!this.winner) {
        _ref = this.protagonists;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          p = _ref[i];
          if (p.life < 0) {
            this.winner = this.findWinner(this.protagonists[i]);
            this.protagonists.slice(i, 1);
          } else {
            if (p.produce && p.state < 100) {
              p.defend();
            } else if (p.state === 100) {
              p.supply(this.findAlly(p));
            } else if (p.produce === false && p.state > 0) {
              p.attack(this.findAntagonist(p));
            }
          }
        }
        this.draw();
      } else {
        if (!this.bot) this.points[this.winner.id - 1]++;
        this.reset();
      }
      _ref2 = this.positions;
      _results = [];
      for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
        position = _ref2[_i];
        if (position.counter > 0) {
          _results.push(position.counter--);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Game.prototype.draw = function() {
      var position, protagonist, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.clear();
      _ref = this.protagonists;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        protagonist = _ref[_i];
        protagonist.draw(this.ctx);
      }
      _ref2 = this.positions;
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        position = _ref2[_j];
        if (position.counter > 0) {
          _results.push(this.ctx.fillText("WIN", position.x, position.y));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Game.prototype.reset = function() {
      var num;
      this.protagonists = (function() {
        var _results;
        _results = [];
        for (num = 1; num <= 4; num++) {
          _results.push(new Protagonist(num));
        }
        return _results;
      })();
      this.winner = false;
      return this.clear();
    };

    Game.prototype.clear = function() {
      return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Game.prototype.findWinner = function(p) {
      var indexOf;
      if (p.id === 1) {
        indexOf = 4 - 1;
      } else {
        indexOf = p.id - 2;
      }
      return this.protagonists[indexOf];
    };

    Game.prototype.findAntagonist = function(p) {
      var founded, indexOf;
      if (p.id === 4) {
        indexOf = 0;
      } else {
        indexOf = p.id;
      }
      while (!(founded != null)) {
        if (this.protagonists[indexOf] != null) {
          founded = this.protagonists[indexOf];
        } else {
          indexOf++;
        }
      }
      return this.protagonists[indexOf];
    };

    Game.prototype.findAlly = function(p) {
      return this.findAntagonist(this.findAntagonist(p));
    };

    Game.prototype.drawCircle = function(x, y, radius, color) {
      if (color == null) color = "#000";
      this.ctx.beginPath();
      this.ctx.fillStyle = color;
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      this.ctx.closePath();
      return this.ctx.fill();
    };

    Game.prototype.drawCricleStroke = function(x, y, radius, width, color) {
      if (color == null) color = "#000";
      this.ctx.beginPath();
      this.ctx.fillStyle = "#000";
      this.ctx.lineWidth = width;
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      return this.ctx.stroke();
    };

    return Game;

  })();

  this.g = new Game('teomeime');

}).call(this);
