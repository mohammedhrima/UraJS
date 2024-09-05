import Mini from "./mini.js";

const Func = () => {
  return (
    <div>
      func tag
      <button
        onclick={() => {
          console.log("hey");
        }}
        style={{
          color: "red",
        }}
      >
        clique me
      </button>
    </div>
  );
};

let root: HTMLElement = document.getElementById("root");

Mini.render(<Func />).mount(root);
