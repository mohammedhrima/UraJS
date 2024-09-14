import Mini from "../../../../mini/mini.js";

Mini.loadCSS("pages/Test/_utils/Count2/Count2.css");

function Count2() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="count2">test/count2</div>
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
export default Count2;
