class Fragment
  constructor: (pos,angle,force,i)->
    @pos = {}
    @pos.x = pos.x + Math.cos(angle)*force
    @pos.y = pos.y + Math.sin(angle)*force
    @angle =  angle - Math.PI + (if i > 2 then -1 else 1)*(Math.PI/(4+12*(i%2)))
    @size = 2
    @opacity = 50+force

  update: ->
    @pos.x += Math.cos(@angle)*8
    @pos.y += Math.sin(@angle)*8
    @opacity = @opacity-5 if @opacity > 5

  draw: (ctx) ->
    @update()
    g.drawCircle(@pos.x, @pos.y, @size,"rgba(0,0,0,0."+(@opacity)+")")

this.Fragment = Fragment