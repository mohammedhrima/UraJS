import { createApp, createElement, createFragment } from "../lib.js";
import { makeInitialState, markReducer } from "./game.js";

function View(state, emit) {
  return createFragment([Header(state), Board(state, emit)]);
}

function Header(state) {
  if (state.winner) {
    return createElement("h3", { class: "win-title" }, [
      `Player ${state.winner} wins!`,
    ]);
  }

  if (state.draw) {
    return createElement("h3", { class: "draw-title" }, [`It's a draw!`]);
  }

  return createElement("h3", {}, [`It's ${state.player}'s turn!`]);
}

function Board(state, emit) {
  const freezeBoard = state.winner || state.draw;

  return createElement("table", { class: freezeBoard ? "frozen" : "" }, [
    createElement(
      "tbody",
      {},
      state.board.map((row, i) => Row({ row, i }, emit))
    ),
  ]);
}

function Row({ row, i }, emit) {
  return createElement(
    "tr",
    {},
    row.map((cell, j) => Cell({ cell, i, j }, emit))
  );
}

function Cell({ cell, i, j }, emit) {
  const mark = cell
    ? createElement("span", { class: "cell-text" }, [cell])
    : createElement(
        "div",
        {
          class: "cell",
          on: { click: () => emit("mark", { row: i, col: j }) },
        },
        []
      );

  return createElement("td", {}, [mark]);
}

createApp({
  state: makeInitialState(),
  reducers: {
    mark: markReducer,
  },
  view: View,
}).mount(document.body);
