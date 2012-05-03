(function() {
  var Fragment;

  Fragment = (function() {

    function Fragment(pos, angle, force, i) {
      this.pos = {};
      this.pos.x = pos.x + Math.cos(angle) * force;
      this.pos.y = pos.y + Math.sin(angle) * force;
      this.angle = angle - Math.PI + (i > 2 ? -1 : 1) * (Math.PI / (4 + 12 * (i % 2)));
      this.size = 2;
      this.opacity = 50 + force;
    }

    Fragment.prototype.update = function() {
      this.pos.x += Math.cos(this.angle) * 8;
      this.pos.y += Math.sin(this.angle) * 8;
      if (this.opacity > 5) return this.opacity = this.opacity - 5;
    };

    Fragment.prototype.draw = function(ctx) {
      this.update();
      return g.drawCircle(this.pos.x, this.pos.y, this.size, "rgba(0,0,0,0." + this.opacity + ")");
    };

    return Fragment;

  })();

  this.Fragment = Fragment;

}).call(this);
