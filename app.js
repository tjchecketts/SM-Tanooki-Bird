var myGamePiece
var myObstacles = []
var myScore

function startGame() {
  myGameArea.start()
  myScore = new component("30px", "Consolas", "black", 280, 40, "text")
  myGamePiece = new component(40, 40, "./images/SM-tanooki-flying.png", 10, 120, "image")
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480
    this.canvas.height = 270
    this.context = this.canvas.getContext("2d")
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    this.frameNo = 0
    this.interval = setInterval(updateGameArea, 20)
    window.addEventListener('keydown', function (e) {
      myGameArea.key = e.keyCode
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.key = false
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  stop : function() {
    clearInterval(this.interval)
  }
}

function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true}
  return false
}

function component(width, height, color, x, y, type) {
  this.type = type
  if (type == "image") {
    this.image = new Image()
    this.image.src = color
  }
  this.width = width
  this.height = height
  this.x = x
  this.y = y
  this.gravity = 0.05
  this.gravitySpeed = 0
  this.update = function() {
    ctx = myGameArea.context
    if (this.type == "text") {
      ctx.font = this.width + "" + this.height
      ctx.fillStyle = color
      ctx.fillText(this.text, this.x, this.y)
    } else if (this.type == "image") {
      ctx.drawImage(this.image, 
        this.x, 
        this.y,
        this.width, this.height)
    } else {
      ctx.fillStyle = color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  this.newPos = function() {
    this.gravitySpeed += this.gravity
    this.x += this.speedX
    this.y += this.speedY + this.gravitySpeed
    this.hitsBottom()
  }
  this.hitsBottom = function() {
    var rockBottom = myGameArea.canvas.height - this.height
    if (this.y > rockBottom) {
      this.y = rockBottom
    }
  }
  // stops game if objects collide
  this.crashWith = function(otherObj) {
    var myLeft = this.x
    var myRight = this.x + (this.width)
    var myTop = this.y
    var myBottom = this.y + (this.height)
    var otherLeft = otherObj.x
    var otherRight = otherObj.x + (otherObj.width)
    var otherTop = otherObj.y
    var otherBottom = otherObj.y + (otherObj.height)
    var crash = true
    if (
      (myBottom < otherTop) ||
      (myTop > otherBottom) ||
      (myRight < otherLeft) ||
      (myLeft > otherRight)
    ) {
      crash = false
    }
    return crash
  }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap

  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop()
      return
    }
  }
  myGameArea.clear()
  myGameArea.frameNo += 1
  // creates 
  if (myGameArea.frameNo == 1 || everyInterval(150)) {
    x = myGameArea.canvas.width
    minHeight = 20
    maxHeight = 200
    height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight)
    minGap = 75
    maxGap = 150
    gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap)
    myObstacles.push(new component(35, height, "./images/mario-pipe-down.png", x, 0, "image"))
    myObstacles.push(new component(35, x - height - gap, "./images/mario-pipe-up.png", x, height + gap, "image"))
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x -= 1
    myObstacles[i].update()
  }

  myGamePiece.speedX = 0
  myGamePiece.speedY = 0
  // x controls temporary
  myGamePiece.newPos()
  myGamePiece.update()
  myScore.text="Score: " + myGameArea.frameNo
  myScore.update()
}

function accelerate(n) {
  myGamePiece.gravity = n
}