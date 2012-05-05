(function() {
  var Bullet;

  Bullet = (function() {

    Bullet.properties = {
      speed: 10
    };

    function Bullet(sender, receiver, force, type) {
      this.sender = sender;
      this.receiver = receiver;
      this.pos = {
        'x': sender.x,
        'y': sender.y
      };
      this.dest = {
        'x': receiver.x,
        'y': receiver.y
      };
      this.force = force;
      this.type = type;
      this.destroy = false;
      this.destroyed = false;
      this.fragments = [];
    }

    Bullet.prototype.update = function() {
      var angle, force, i,
        _this = this;
      if (!this.destroy && this.fragments.length === 0) {
        switch (this.type) {
          case "bullet":
            force = this.force;
            break;
          case "supply":
            force = 0;
        }
        if (Math.abs(this.pos.x - this.dest.x) - force > this.receiver.perceiveLife() || Math.abs(this.pos.y - this.dest.y) - force > (this.receiver.life / 10)) {
          angle = this.getAngle();
          this.pos.x += Math.cos(angle) * Bullet.properties.speed;
          return this.pos.y += Math.sin(angle) * Bullet.properties.speed;
        } else {
          switch (this.type) {
            case "bullet":
              this.receiver.life -= this.force * 2;
              break;
            case "supply":
              this.receiver.life += 300;
              if (this.receiver.life > 1000) this.receiver.life = 1000;
          }
          return this.destroy = true;
        }
      } else if (this.fragments.length === 0) {
        if (this.type === "bullet") {
          for (i = 1; i <= 4; i++) {
            this.fragments.push(new Fragment({
              x: this.pos.x,
              y: this.pos.y
            }, this.getAngle(), this.force, i));
          }
        }
        return setTimeout(function() {
          return _this.destroyed = true;
        }, 250);
      }
    };

    Bullet.prototype.getAngle = function() {
      return Math.atan2(this.dest.y - this.pos.y, this.dest.x - this.pos.x);
    };

    Bullet.prototype.draw = function(ctx) {
      var fragment, _i, _len, _ref, _results;
      this.update();
      ctx.beginPath();
      if (!this.destroy && this.fragments.length === 0) {
        g.drawCircle(this.pos.x, this.pos.y, this.type === "bullet" ? this.force / 2 : 30);
      }
      _ref = this.fragments;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fragment = _ref[_i];
        _results.push(fragment.draw(ctx));
      }
      return _results;
    };

    return Bullet;

  })();

  this.Bullet = Bullet;

}).call(this);
