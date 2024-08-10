import { createApp, createElement, createFragment } from "../lib/lib.js";

const state = {
  currentTodo: "",
  edit: {
    idx: null,
    original: null,
    edited: null,
  },
  todos: ["Walk the dog", "Water the plants", "Sand the chairs"],
};

const reducers = {
  "update-current-todo": (state, currentTodo) => ({
    ...state,
    currentTodo,
  }),

  "add-todo": (state) => ({
    ...state,
    currentTodo: "",
    todos: [...state.todos, state.currentTodo],
  }),

  "start-editing-todo": (state, idx) => ({
    ...state,
    edit: {
      idx,
      original: state.todos[idx],
      edited: state.todos[idx],
    },
  }),

  "edit-todo": (state, edited) => ({
    ...state,
    edit: { ...state.edit, edited },
  }),

  "save-edited-todo": (state) => {
    const todos = [...state.todos];
    todos[state.edit.idx] = state.edit.edited;

    return {
      ...state,
      edit: { idx: null, original: null, edited: null },
      todos,
    };
  },

  "cancel-editing-todo": (state) => ({
    ...state,
    edit: { idx: null, original: null, edited: null },
  }),

  "remove-todo": (state, idx) => ({
    ...state,
    todos: state.todos.filter((_, i) => i !== idx),
  }),
};

function App(state, emit) {
  return createFragment([
    createElement("h1", {}, ["My TODOs"]),
    CreateTodo(state, emit),
    TodoList(state, emit),
  ]);
}

function CreateTodo({ currentTodo }, emit) {
  return createElement("div", {}, [
    createElement("label", { for: "todo-input" }, ["New TODO"]),
    createElement("input", {
      type: "text",
      id: "todo-input",
      value: currentTodo,
      on: {
        input: ({ target }) => emit("update-current-todo", target.value),
        keydown: ({ key }) => {
          if (key === "Enter" && currentTodo.length >= 3) {
            emit("add-todo");
          }
        },
      },
    }),
    createElement(
      "button",
      {
        disabled: currentTodo.length < 3,
        on: { click: () => emit("add-todo") },
      },
      ["Add"]
    ),
  ]);
}

function TodoList({ todos, edit }, emit) {
  return createElement(
    "ul",
    {},
    todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
  );
}

function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i;

  return isEditing
    ? createElement("li", {}, [
        createElement("input", {
          value: edit.edited,
          on: { input: ({ target }) => emit("edit-todo", target.value) },
        }),
        createElement(
          "button",
          { on: { click: () => emit("save-edited-todo", null) } },
          ["Save"]
        ),
        createElement(
          "button",
          { on: { click: () => emit("cancel-editing-todo", null) } },
          ["Cancel"]
        ),
      ])
    : createElement("li", {}, [
        createElement(
          "span",
          { on: { dblclick: () => emit("start-editing-todo", i) } },
          [todo]
        ),
        createElement(
          "button",
          { on: { click: () => emit("remove-todo", i) } },
          ["Done"]
        ),
      ]);
}

createApp({ state, view: App, reducers }).mount(document.body);
