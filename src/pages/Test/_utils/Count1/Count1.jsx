import Mini from "../../../../mini/mini.js";

Mini.loadCSS("pages/Test/_utils/Count1/Count1.css");

function Count1() {
  const [key, state] = Mini.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <>
          <div className="count1">test/count1</div>
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
export default Count1;
