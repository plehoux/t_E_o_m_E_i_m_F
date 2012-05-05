(function() {
  var Protagonist;

  Protagonist = (function() {

    function Protagonist(id) {
      this.id = id;
      this.life = 1000;
      this.state = 0;
      this.produce = false;
      this.bullets = [];
      switch (this.id) {
        case 1:
        case 4:
          this.x = parseInt(window.innerWidth / 4);
          break;
        case 2:
        case 3:
          this.x = parseInt(window.innerWidth / 4 * 3);
      }
      switch (this.id) {
        case 1:
        case 2:
          this.y = parseInt(window.innerHeight / 4);
          break;
        case 3:
        case 4:
          this.y = parseInt(window.innerHeight / 4 * 3);
      }
      this.anchorX = this.x;
      this.anchorY = this.y;
    }

    Protagonist.prototype.perceiveLife = function() {
      return this.life / 10;
    };

    Protagonist.prototype.attack = function(antagonist) {
      this.bullets.push(new Bullet(this, antagonist, this.state, "bullet"));
      this.backFire(antagonist);
      this.flash = true;
      return this.resetState();
    };

    Protagonist.prototype.defend = function() {
      if (this.state < 100) {
        return this.state++;
      } else {
        return this.resetState();
      }
    };

    Protagonist.prototype.supply = function(ally) {
      this.bullets.push(new Bullet(this, ally, this.state, "supply"));
      this.backFire(ally);
      this.flash = true;
      return this.resetState();
    };

    Protagonist.prototype.resetState = function() {
      return this.state = 0;
    };

    Protagonist.prototype.flicker = function() {
      return (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * this.state / 10) + 1;
    };

    Protagonist.prototype.backFire = function(from) {
      var angle;
      angle = Math.atan2(from.y - this.y, from.x - this.x) + Math.PI;
      this.x += Math.cos(angle) * this.state / 2;
      return this.y += Math.sin(angle) * this.state / 2;
    };

    Protagonist.prototype.perceivedX = function() {
      return this.flicker() + this.x;
    };

    Protagonist.prototype.perceivedY = function() {
      return this.flicker() + this.y;
    };

    Protagonist.prototype.touched = function(x, y) {
      var x2, y2;
      x2 = Math.abs(this.x - x);
      y2 = Math.abs(this.y - y);
      if (Math.sqrt(x2 * x2 + y2 * y2) < (this.perceiveLife() < 100 ? 100 : this.perceiveLife())) {
        return true;
      }
    };

    Protagonist.prototype.update = function() {
      var angle, bullet, i, _len, _ref, _results;
      if (this.x !== this.anchorX || this.y !== this.anchorY) {
        angle = Math.atan2(this.anchorY - this.y, this.anchorX - this.x);
        if (angle != null) this.x += Math.cos(angle) * 1;
        if (angle != null) this.y += Math.sin(angle) * 1;
      }
      _ref = this.bullets;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        bullet = _ref[i];
        if ((bullet != null) && bullet.destroyed) {
          _results.push(this.bullets.splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Protagonist.prototype.draw = function(ctx) {
      var bullet, x, y, _i, _len, _ref;
      this.update();
      x = this.perceivedX();
      y = this.perceivedY();
      _ref = this.bullets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bullet = _ref[_i];
        bullet.draw(ctx);
      }
      if (this.flash) {
        if (this.perceiveLife() + 10 > 0) {
          g.drawCircle(x, y, this.perceiveLife() + 35, "rgb(235,235,235)");
        }
        this.flash = false;
      }
      if (this.perceiveLife() > 0) {
        g.drawCricleStroke(x, y, this.perceiveLife(), 10);
      }
      if (this.perceiveLife() - 5 > 0) {
        g.drawCircle(x, y, this.perceiveLife() - 5, "#fff");
      }
      if (this.state > 0 && this.perceiveLife() / 100 * this.state > 0) {
        return g.drawCircle(x, y, this.perceiveLife() / 100 * this.state);
      }
    };

    return Protagonist;

  })();

  this.Protagonist = Protagonist;

}).call(this);
