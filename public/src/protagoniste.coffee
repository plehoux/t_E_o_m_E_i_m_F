class Protagonist
  constructor: (id)->
    @id = id
    @life = 1000
    @state = 0
    @produce = false
    @bullets = []
    switch @id 
      when 1,4 then @x = parseInt(window.innerWidth/4)
      when 2,3 then @x = parseInt(window.innerWidth/4*3)
    switch @id
      when 1,2 then @y = parseInt(window.innerHeight/4)
      when 3,4 then @y = parseInt(window.innerHeight/4*3)
    @anchorX = @x
    @anchorY = @y

  perceiveLife: ->
    @life/10
  
  attack: (antagonist)->
    @bullets.push(new Bullet(@,antagonist,@state,"bullet"))
    @backFire(antagonist)
    @flash = true
    @resetState()

  defend: ->
    if @state < 100
      @state++
    else
      @resetState()

  supply: (ally)->
    @bullets.push(new Bullet(@,ally,@state,"supply"))
    @backFire(ally)
    @flash = true
    @resetState()

  resetState: ->
    @state = 0

  flicker: ->
    (if Math.random() > 0.5 then 1 else -1)*Math.floor(Math.random() * @state/10) + 1

  backFire: (from)->
    angle = Math.atan2(from.y - @y, from.x - @x) + Math.PI
    @x += Math.cos(angle)*@state/2
    @y += Math.sin(angle)*@state/2

  perceivedX: ->
    @flicker() + @x

  perceivedY: ->
    @flicker() + @y

  touched: (x,y)->
    x2 = Math.abs(@x-x)
    y2 = Math.abs(@y-y)
    true if Math.sqrt(x2*x2+y2*y2) < (if @perceiveLife() < 100 then 100 else @perceiveLife())

  update: ->
    if @x != @anchorX or @y != @anchorY
      angle = Math.atan2(@anchorY - @y, @anchorX - @x)
      @x += Math.cos(angle)*1 if angle?
      @y += Math.sin(angle)*1 if angle?
    for bullet, i in @bullets
      if bullet? and bullet.destroyed
          @bullets.splice(i, 1)
  
  draw: (ctx)->
    @update()
    #Bullets
    x = @perceivedX()
    y = @perceivedY()
    for bullet in @bullets
      bullet.draw(ctx)
    #Flash attack circle
    if @flash
      g.drawCircle(x,y,@perceiveLife()+35,"rgb(235,235,235)") if @perceiveLife()+10 > 0
      @flash = false
    #Black border
    g.drawCricleStroke(x,y,@perceiveLife(),10) if @perceiveLife() > 0
    #white circle
    g.drawCircle(x,y,@perceiveLife()-5,"#fff") if @perceiveLife()-5 > 0
    #Loader circle
    g.drawCircle(x,y,@perceiveLife()/100*@state) if @state > 0 and @perceiveLife()/100*@state > 0

this.Protagonist = Protagonist