// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";

// Mino.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0);
  const [gettArr, setArr] = state(["task 1", "task 2", "task 3"]);
  // const add = () => {
  //   setArr([...gettArr(), "hello"]);
  //   console.log("new array:", gettArr());
  // };
  return {
    key: key,
    render: () => {
      return (
        <root>
          {/* <if cond={getter() == 0}>
            hello 
          </if> */}
          {/* <loop on={gettArr()}>
            {(elem, id) => {
              return <>{`${elem} ${id}`}</>;
            }}
          </loop> */}
          <button
            onclick={
              getter() % 2 != 0
                ? () => {
                    console.log("is even");
                    setter(getter() + 1);
                  }
                : () => {
                    console.log("is odd");
                    setter(getter() + 1);
                  }
            }
          >
            clique me {getter()}
          </button>
          {/* <h1>this is Home</h1> */}
        </root>
      );
    },
  };
}
export default Home;
