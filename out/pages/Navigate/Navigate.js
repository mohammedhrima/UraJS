import Mini from "../../mini/mini.js";
Mini.loadCSS("pages/Navigate/Navigate.css");
// Mini.navigate("/navigate");
// function Event({ path }): MiniComponent {
//   const [key, state] = Mini.initState();
//   return {
//     key: key,
//     render: () => {
//       return (
//         <>
//           <button onclick={() => Mini.navigate(path)}>navigate to {path}</button>
//           <br />
//           <br />
//         </>
//       );
//     },
//   };
// }
// function Navigate(): MiniComponent {
//   const [key, state] = Mini.initState();
//   return {
//     key: key,
//     render: () => {
//       return (
//         <>
//           <div>
//             <Event path={"/home"}/>
//             <Event path={"/test"}/>
//             <Event path={"/todo"}/>
//           </div>
//         </>
//       );
//     },
//   };
// }
export default Navigate;
