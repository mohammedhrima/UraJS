import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Home/Home.css");

function Home() {
  const [key, state] = Mini.initState();
  const [set, get] = state(10);
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          {/* <div id="home">
            <h1>Home page</h1>
            <div>
              <span>text 2</span>
              <br />
              <span>text 1</span>
              <br />
              <span>text 1</span>
              <br />
              <span>text 1</span>
            </div>
          </div> */}
            text 1
            text 2
            text 3
        </get>
      );
    },
  };
}
export default Home;
