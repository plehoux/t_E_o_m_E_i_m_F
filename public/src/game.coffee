class Game
  constructor:(selector) ->
    @initCanvas(selector)
    @body = document.getElementsByTagName('body')[0]
    @initKeyboard()
    @points = new Array(0,0,0,0)
    @protagonists = (new Protagonist(num) for num in [1..4])
    setInterval(=>
        @update()
      ,16)

  initKeyboard: ->
    @body.addEventListener('keydown',(event)=>
        switch event.keyCode
          when 81 then @protagonists[0].produce = true
          when 80 then @protagonists[1].produce = true
          when 77 then @protagonists[2].produce = true
          when 90 then @protagonists[3].produce = true
      )
    @body.addEventListener('keyup',(event)=>
        switch event.keyCode
          when 81 then @protagonists[0].produce = false
          when 80 then @protagonists[1].produce = false
          when 77 then @protagonists[2].produce = false
          when 90 then @protagonists[3].produce = false
      )

  initCanvas: (selector)->
    @canvas = document.getElementById(selector)
    @ctx = @canvas.getContext("2d")

  update: ->
    @canvas.width =  window.innerWidth
    @canvas.height =  window.innerHeight
    #Protagonists
    unless @winner
      for p,i in @protagonists
        if p.life < 0
          @winner = @findWinner(@protagonists[i])
          @protagonists.slice(i,1)
        else
          if p.produce and p.state < 100
            p.defend()
          else if p.state == 100
            p.supply(@findAlly(p))
          else if p.produce == false and p.state > 0
            p.attack(@findAntagonist(p))
      @draw()
    else
      @reset()
    
  draw: ->
    @clear()
    for protagonist in @protagonists
      protagonist.draw(@ctx)
  
  reset: ->
    @points[@winner.id-1]++
    @protagonists = (new Protagonist(num) for num in [1..4])
    @winner = false
    @clear()

  clear: ->
    @ctx.clearRect(0,0,@canvas.width,@canvas.height)

  findWinner: (p)->
    if p.id == 1
      indexOf = 4-1 
    else
      indexOf = p.id-2
    @protagonists[indexOf]

  findAntagonist: (p)->
    if p.id == 4
      indexOf = 0 
    else
      indexOf = p.id
    while not founded?
      if @protagonists[indexOf]?
        founded = @protagonists[indexOf]
      else
        indexOf++
    @protagonists[indexOf]

  findAlly: (p)->
    @findAntagonist(@findAntagonist(p))

  drawCircle: (x,y,radius,color = "#000")->
    @ctx.beginPath()
    @ctx.fillStyle = color
    @ctx.arc(x, y, radius, 0, Math.PI*2, true)
    @ctx.closePath()
    @ctx.fill()


  drawCricleStroke: (x,y,radius,width,color = "#000")->
    @ctx.beginPath()
    @ctx.fillStyle = "#000"
    @ctx.lineWidth = width
    @ctx.arc(x, y,radius,0,Math.PI*2,true)
    @ctx.stroke()



this.g = new Game('teomeime')