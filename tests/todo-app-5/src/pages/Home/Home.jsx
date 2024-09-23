// pages/Home/Home.jsx
import Mino from "../../Minotaur/code.js";
import Comp from "./_utils/Comp/Comp.js";
Mino.loadCSS("pages/Home/Home.css");

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
    render: () => (
      <>
        <if cond={true}>
          <Comp id={"odd"} />
        </if>
        <if cond={true}>
          <Comp id={"even"} />
        </if>
        ==============================================================
        {/* <if cond={true}>
            <h1>hello</h1>
          </if> */}
        {/* <loop on={gettArr()}>
            {(elem, id) => {
              return <>{`${elem} ${id}`}</>;
            }}
          </loop> */}
        <br />
        <button onclick={() => setter(getter() + 1)}>clique me {getter()}</button>
        {/* <h1>this is Home</h1> */}
      </>
    ),
  };
}
export default Home;
