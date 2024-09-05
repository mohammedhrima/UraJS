import Mini from "./mini.js";

const [index, count, setCount] = Mini.useState(1);

const Func = () => {
  console.log("call function");

  return (
    <button
      onclick={() => {
        console.log("click", count());
        setCount(count() + 1);
      }}
    >
      clique me {count()}
    </button>
  );
};

const Func2 = () => {
  return (
    <get find={"#root"}>
      <state watch={index}>
        <Func />
      </state>
    </get>
  );
};

Mini.display(<Func2 />).mount();
