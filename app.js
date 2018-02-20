var myGamePiece
var myObstacles = []

function startGame() {
  myGameArea.start()
  myGamePiece = new component(30, 30, "red", 10, 120)
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

function component(width, height, color, x, y) {
  this.width = width
  this.height = height
  this.x = x
  this.y = y
  this.update = function() {
    ctx = myGameArea.context
    ctx.fillStyle = color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  this.newPos = function() {
    this.x += this.speedX
    this.y += this.speedY 
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
    minGap = 50
    maxGap = 200
    gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap)
    myObstacles.push(new component(10, height, "green", x, 0))
    myObstacles.push(new component(10, x - height - gap, "green", x, height + gap))
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x -= 1
    myObstacles[i].update()
  }

  myGamePiece.speedX = 0
  myGamePiece.speedY = 0
  // x controls temporary
  if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1 }
  if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1 }
  if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1 }
  if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1 }
  myGamePiece.newPos()
  myGamePiece.update()
}