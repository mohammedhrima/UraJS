import Mini from "../../mini/mini.js";

Mini.loadCSS("pages/About/About.css");

function About() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <get by={"#root"}>
          <div id="about">about counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </get>
      );
    },
  };
}
export default About;
