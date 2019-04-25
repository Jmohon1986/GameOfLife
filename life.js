let previous;

const nextGeneration = (generation = [[1, 1, 1],[1, 0, 0],[1, 1, 0]]) => {
  const height = generation.length - 1;
  const depth = generation[0].length - 1;
  const nextGen = generation.map(row => row.slice());

// check existing cells around current cell if current cell is not a corner
    const checkSurrounding = ([x, y], aliveCellCount = 0) => {
      const surroundingCells = {
        upLDiag: [x - 1, y - 1],
        upRDiag: [x + 1, y - 1],
        downLDiag: [x - 1, y + 1],
        downRDiag:[x + 1, y + 1], 
        up: [x, y - 1],
        down: [x, y + 1],
        left: [x - 1, y],
        right: [x + 1, y],
      };

      for (const cell in surroundingCells) {
        const [x, y] = surroundingCells[cell]
        if (x > -1 && y > -1 && x <= depth && y <= height) {
          if (generation[y][x]) {
            aliveCellCount++;
            if (aliveCellCount > 3) {
              return aliveCellCount;
            }
          }
        }
      }
      return aliveCellCount;
    };

// check existing cells around corner cells
    const checkCorners = ([x, y]) => {
      const surroundingCells = {
        upLDiag: [x - 1, y - 1],
        upRDiag: [x + 1, y - 1],
        downLDiag: [x - 1, y + 1],
        downRDiag:[x + 1, y + 1], 
        up: [x, y - 1],
        down: [x, y + 1],
        left: [x - 1, y],
        right: [x + 1, y],
      };
      
      const cornerSurrounds = {
        topLeft: [surroundingCells.down, surroundingCells.downRDiag, surroundingCells.right],
        topRight: [surroundingCells.down, surroundingCells.left, surroundingCells.downLDiag],
        bottomRight: [surroundingCells.up, surroundingCells.left, surroundingCells.upLDiag],
        bottomLeft: [surroundingCells.up, surroundingCells.right, surroundingCells.upRDiag],
      };

      const countAlive = (positionArray) => 
      positionArray.reduce((current, [x, y]) => current + generation[y][x], 0);

      if (x === 0) {
        if (y === 0) {
          return countAlive(cornerSurrounds.topLeft);
        } else {
          return countAlive(cornerSurrounds.bottomLeft);
        }
      } else {
        if (y === 0) {
          return countAlive(cornerSurrounds.topRight);
        } else {
          return countAlive(cornerSurrounds.bottomRight);
        }
      }
    };

 // returns a boolean stating whether the cell is or is not a corner
    const isCorner = ([x, y]) => {
      if (x > 0 && x < depth) {
        return false;
      } else if (y > 0 && y < height) {
        return false;
      }
      return true;
    };

 // decides the fate of each cell in this generation
    const fate = (cell) => {
      const [x, y] = cell
      let population, status = generation[y][x];

      if (isCorner(cell)) {
        population = checkCorners(cell);
      } else {
        population = checkSurrounding(cell);
      };

      if (status && (population < 2 || population > 3)) {
        nextGen[y][x] = 0;
      } else if (!status && population === 3) {
        nextGen[y][x] = 1;
      };
    };

    generation.forEach((row, i) => {
        row.forEach((cell, j) => fate([j, i]));
      });

      $('ul').empty();
      nextGen.map((row, i) => {
        $('#generation').append(`<li id=${i} style="display: flex">`)
        row.map((cell) => {
          if (!cell) {
            $(`#${i}`).append(`<div><img style="height: 40px" src="https://cdn1.iconfinder.com/data/icons/faces-and-emotions/32/emotion_face_avatar_emoji_dead_or_alive-512.png" /></div>`)
          } else {
            $(`#${i}`).append(`<div><img style="height: 40px" src="https://cdn2.iconfinder.com/data/icons/faces-and-emotions/32/happy_smile_face-512.png" /></div>`)

          }
        });
          
      });
 // return the next generation
      previous = nextGen;
      return nextGen;
    };
    
    nextGeneration();

    $('<input id="matrix" style="width: 200px" placeholder="Paste or type your matrix here!"/>').insertAfter('#generation');
    $('<br /> <button id="new">Click to see your custom next generation!</button>').insertAfter('#matrix');
    $('#new').click(() => {
      if ($('#matrix').val().length) {
        return nextGeneration(JSON.parse($('#matrix').val()));
      } else {
        return nextGeneration();
      }
    });
    $('<br /> <button id="next">Click to see the next generation for the current matrix!</button>').insertAfter('#new');
    $('#next').click(() => nextGeneration(previous));

