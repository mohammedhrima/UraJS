import Mini from "./mini.js";

const Func = () => {
  
  const [index, count, setCount] = Mini.useState(123);
  return (
    <state watch={index}>
        <button
          onclick={() => {
            console.log("click", count());
            setCount(count() + 1);
          }}
        >
          clique me {count()}
        </button>
    </state>
  );
};


let root: HTMLElement = document.getElementById("root");

Mini.render(<Func />).mount(root);
