document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid")
  let squares = Array.from(document.querySelectorAll(".grid div"))
  const scoreDisplay = document.querySelector("#score")
  const startBtn = document.querySelector("#start-button")
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = ["orange", "red", "purple", "green", "blue"]

  // Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width + 2, width * 2 + 1],
    [width, 1, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetrimino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetrimino]

  let currentPosition = 4;
  let currentRotation = 0;

  console.log(theTetrominoes[0][0]);

  // Randomly select a tetromino and its first rotation.
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][0]

  // Draw the Tetromino.
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino")
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // Undraw the Tetromino.
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino")
      squares[currentPosition + index].style.backgroundColor = ""
    })
  }

  // This makes the tetromino move down every second.
  // timerId = setInterval(moveDown, 1000)

  // Assign functions to the keyCodes and the buttons.
  function control(e) {
    if (e.keyCode === 37 || e.target.id === "left-button") { 
      moveLeft() 
    } else if (e.keyCode === 38 ) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener("keyup", control);

  // This function moves the tetromino down.
  function moveDown() {
    undraw()
    currentPosition += width;
    draw()
    freeze()
  }

  // This function freezes the tetromino.
  function freeze() {
    if (current.some((index) => squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach((index) => squares[currentPosition + index].classList.add("taken"));
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      // Start a new tetromino falling.
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4

      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // This function moves the tetromino left, unless it is at the edge or there is a blockage.
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition += 1;
    }

    draw();
  }

  // This function moves the tetromino right, unless it is at the edge or there is a blockage.
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= 1
    }

    draw();
  }

  // This function rotates the tetromino.
  function rotate() {
    undraw()
    currentRotation++;
    // If the current rotation gets to 4, make it go back to 0.
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    
    draw()
  }
    
  // Show up-next tetromino in mini-grid display.
  const displaySquares = document.querySelectorAll(".mini-grid div")
  const displayWidth = 4
  const displayIndex = 0


  // The Tetrominoes without rotations.
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetrimino
  ]

  // Display the shape in the mini-grid display.
  function displayShape() {
    // Remove the tetromino from the entire grid.
    displaySquares.forEach(square => {
      square.classList.remove("tetromino")
      square.style.backgroundColor = ""
      })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add("tetromino")
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
  }

// Add functionality to the button.
startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    displayShape()
  }
})

// Add score.
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6,i + 7, i + 8, i + 9]

    if (row.every(index => squares[index].classList.contains("taken"))) {
      score += 10
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove("taken")
        squares[index].classList.remove("tetromino")
        squares[index].style.backgroundColor = ""
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

// Game over.
function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
    scoreDisplay.innerHTML = "end"
    clearInterval(timerId)
  }
}

})
