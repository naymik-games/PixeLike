class CaveAlt {
  constructor(cols, rows) {
    this.rows = rows
    this.cols = cols
    var total = rows * cols
    this.min = total * .2
  }
  initBoard() {
    var board = new Array(this.rows);
    for (var y = 0; y < this.rows; y++) {
      board[y] = new Array(this.cols);
      for (var x = 0; x < this.cols; x++) {
        //value 0.45 - is good for cave 'shape'
        board[y][x] = Math.random() < 0.45 ? 1 : 0;
      }
    }
    //console.log(board)
    return board;
  }

  //in here we reassign our board array with the rules:
  //look at the 8 neighbours: the neighbour with value 1 or 2 - is alive else - is dead
  // - if the cell is alive and has < 4 alive neighbours  - the cell dies.
  // - if the cell is dead and has > 3 alive neighbours - the cell becomes alive.
  getNextGeneration(board) {
    //in here we store next generation board
    var nextBoard = [];
    for (var i = 0; i < board.length; i++)
      nextBoard.push(board[i].slice(0));

    for (var i = 0; i < nextBoard.length; i++) {
      for (var j = 0; j < nextBoard[i].length; j++) {

        var count = this.countAliveNeighbours(board, i, j);

        //the cell is alive        
        if (board[i][j]) {
          if (count < 4)
            //the cell dies
            nextBoard[i][j] = 0;
          else
            //the cell alive
            nextBoard[i][j] = 1;
        }
        //dead cell       
        else {
          if (count > 3)
            //now it's alive
            nextBoard[i][j] = 1;
          else
            //dead cell
            nextBoard[i][j] = 0;
        }
      }
    }
    return nextBoard;
  }

  //analize neighbour cells
  countAliveNeighbours(board, i, j) {
    var count = 0;

    for (var m = i - 1; m <= i + 1; m++) {
      for (var n = j - 1; n <= j + 1; n++) {
        if (m === i && n === j) {
          continue;
        }

        var row = m;
        var col = n;
        //we looking out of the array's bounds
        if (m >= board.length || m < 0)
          continue;
        //we looking out of the array's bounds
        else if (n >= board[0].length || n < 0)
          continue;

        else if (board[row][col] > 0) {
          count++;
        }
      }
    }
    return count;
  }

  //flooding the array and remove all isolated areas
  floodFill(boardParam, x, y) {
    var board = new Array(this.rows);
    // console.log(board)
    for (var i = 0; i < this.rows; i++) {
      board[i] = boardParam[i].slice(0);
    }
    //console.log(board)
    var width = this.cols;
    var height = this.rows;
    var stack = [[x, y]];
    var cell;
    var point = 0;
    //this is to measure volume of the cave
    var counter = 0;
    while (stack.length > 0) {
      cell = stack.pop();
      var x = cell[0];
      var y = cell[1];
      //index out of bound
      if (x < 0 || x >= height)
        continue;
      if (y < 0 || y >= width)
        continue;
      var value = board[x][y];

      if (value === 0 || value == 3)
        continue;
      else {
        counter++;
        // painting
        board[x][y] = 3;

        // putting the neighbours in the stack to check them
        stack.push([
          x - 1,
          y
        ]);
        stack.push([
          x + 1,
          y
        ]);
        stack.push([
          x,
          y - 1
        ]);
        stack.push([
          x,
          y + 1
        ]);
      }
    }
    //console.log(counter)
    return {
      board: board,
      //counter is a 'volume of a cave'
      volume: counter
    };
  }

  fixBoard(board) {

    for (var x = 0; x < this.rows; x++) {
      for (var y = 0; y < this.cols; y++) {
        var result = this.floodFill(board, x, y);
        //we want cave with at least 2000 cells volume
        //deep enough to make the game more interesting
        if (result.volume > this.min) {
          board = result.board;
          return board;
        } else if (result.volume > this.min - .05) {
          board = result.board;
          return board;
        }
      }
    }
    //this board doesn't have any cave with enough volume	
    return null;
  }

  //generate game board
  generateBoard() {
    var board = this.initBoard();
    for (var i = 0; i < 2; i++)
      board = this.getNextGeneration(board);
    //console.log(board)
    board = this.fixBoard(board);
    //console.log(board)
    for (var x = 0; x < this.rows; x++) {
      for (var y = 0; y < this.cols; y++) {
        if (board[x][y] != 3) {
          board[x][y] = 0;
          //ctx.fillStyle = "#000";    	
        }
        else if (board[x][y] == 3) {
          board[x][y] = 2;
          // ctx.fillStyle = "#eee";    	
        }
        // ctx.fillRect (x*10, y*10, 10, 10);       			
      }
    }

    return board;
  }
}



function placeTreasure(board, color, treasureHiddenLimit) {
  ctx.fillStyle = color;
  for (var x = 0; x < this.cols; x++) {
    for (var y = 0; y < this.rows; y++) {
      if (board[x][y]) {
        var nbs = countAliveNeighbours(board, x, y);
        if (nbs == 1) {
          ctx.fillRect(x * 10, y * 10, 10, 10);
          treasureHiddenLimit--;
          if (treasureHiddenLimit === 0)
            return;
        }
      }
    }
  }
}






