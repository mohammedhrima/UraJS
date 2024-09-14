import Mini from "../../../../mini/mini.js";

Mini.loadCSS("pages/Test/_utils/Count3/Count3.css");

function Count3() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="count3">test/count3</div>
          <button
              onclick={() => {
                setter(getter() + 1);
              }} >
            clique me
          </button>
        </>
      );
    },
  };
}
export default Count3;
