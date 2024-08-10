export function makeInitialState() {
  return {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    player: "X",
    draw: false,
    winner: null,
  };
}

export function markReducer(state, { row, col }) {

  const newBoard = [
    [...state.board[0]],
    [...state.board[1]],
    [...state.board[2]],
  ];
  
  newBoard[row][col] = state.player;

  const newPlayer = state.player === "X" ? "O" : "X";
  const winner = checkWinner(newBoard, state.player);
  const draw = !winner && newBoard.every((row) => row.every((cell) => cell));

  return {
    board: newBoard,
    player: newPlayer,
    draw,
    winner,
  };
}

function checkWinner(board, player) {
  for (let i = 0; i < 3; i++) {
    const row = board[i];
    if (row.every((cell) => cell === player)) return player;

    const column = [board[0][i], board[1][i], board[2][i]];
    if (column.every((cell) => cell === player)) return player;
  }

  let diagonal = [board[0][0], board[1][1], board[2][2]];
  if (diagonal.every((cell) => cell === player)) return player;

  diagonal = [board[0][2], board[1][1], board[2][0]];
  if (diagonal.every((cell) => cell === player)) {
    return player;
  }

  return null;
}
