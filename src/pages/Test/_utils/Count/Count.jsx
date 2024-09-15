import Mini from "../../../../mini/mini.js";
Mini.loadCSS("pages/Test/_utils/Count/Count.css");

function Count1({ index }) {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0);
  return {
    key: key,
    render: () => {
      return (
        <button
          onclick={() => {
            setter(getter() + 1);
          }}
        >
          {getter()}
        </button>
      );
    },
  };
}
export default Count1;
