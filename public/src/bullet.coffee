class Bullet
  @properties =
    speed : 10
  
  constructor: (sender,receiver,force, type)->
    @sender = sender
    @receiver = receiver
    @pos = {'x':sender.x,'y':sender.y}
    @dest = {'x':receiver.x,'y':receiver.y}
    @force = force
    @type = type
    @destroy = false
    @destroyed = false
    @fragments = []

  update: ->
    if !@destroy and @fragments.length == 0
      switch @type
        when "bullet"
          force = @force
        when "supply"
          force = 0
      if Math.abs(@pos.x-@dest.x)-force > @receiver.perceiveLife() or Math.abs(@pos.y-@dest.y)-force > (@receiver.life/10)
        angle = @getAngle()
        @pos.x += Math.cos(angle)*Bullet.properties.speed
        @pos.y += Math.sin(angle)*Bullet.properties.speed
      else
        switch @type
          when "bullet"
            @receiver.life -= @force*2
          when "supply" 
            @receiver.life += 200
        @destroy = true
    else if @fragments.length == 0
      @fragments.push(new Fragment({x:@pos.x,y:@pos.y},@getAngle(),@force,i)) for i in [1..4] if @type == "bullet"
      setTimeout(=>
          @destroyed = true
        ,250)

  getAngle: ->
    Math.atan2(@dest.y - @pos.y, @dest.x - @pos.x)

  draw: (ctx)->
    @update()
    ctx.beginPath()
    if !@destroy and @fragments.length == 0
      g.drawCircle(@pos.x, @pos.y, if @type == "bullet" then @force/2 else 30)
    fragment.draw(ctx) for fragment in @fragments

this.Bullet = Bullet

    