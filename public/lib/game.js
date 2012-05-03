(function() {
  var Game;

  Game = (function() {

    function Game(selector) {
      var num,
        _this = this;
      this.initCanvas(selector);
      this.body = document.getElementsByTagName('body')[0];
      this.initKeyboard();
      this.points = new Array(0, 0, 0, 0);
      this.protagonists = (function() {
        var _results;
        _results = [];
        for (num = 1; num <= 4; num++) {
          _results.push(new Protagonist(num));
        }
        return _results;
      })();
      setInterval(function() {
        return _this.update();
      }, 16);
    }

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

    Game.prototype.initCanvas = function(selector) {
      this.canvas = document.getElementById(selector);
      return this.ctx = this.canvas.getContext("2d");
    };

    Game.prototype.update = function() {
      var i, p, _len, _ref;
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
        return this.draw();
      } else {
        return this.reset();
      }
    };

    Game.prototype.draw = function() {
      var protagonist, _i, _len, _ref, _results;
      this.clear();
      _ref = this.protagonists;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        protagonist = _ref[_i];
        _results.push(protagonist.draw(this.ctx));
      }
      return _results;
    };

    Game.prototype.reset = function() {
      var num;
      this.points[this.winner.id - 1]++;
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
