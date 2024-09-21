// pages/Tmp/Tmp.jsx
import Mino from "../../Minotaur/code.js";

Mino.loadCSS("pages/Tmp/Tmp.css");

function Tmp() {
  const [key, state] = Mino.initState();
  const [getter, setter] = state(0)
  return {
    key: key,
    render: () => {
      return (
        <root>
          <div id="tmp">tmp counter {getter()}</div>
          <br />
          <button
            onclick={() => {
              setter(getter() + 1);
            }}
          >
            clique me
          </button>
        </root>
      );
    },
  };
}
export default Tmp;

// // pages/Home/Home.jsx
// import Mino from "../../Minotaur/code.js";

// // Mino.loadCSS("pages/Home/Home.css");

// function Home() {
//   const [key, state] = Mino.initState();
//   const [getArray, setArray] = state([
//     {
//       check: false,
//       value: "task 1",
//     },
//     {
//       check: true,
//       value: "task 2",
//     },
//     {
//       check: false,
//       value: "task 3",
//     },
//   ]);
//   const [getText, setText] = state("");

//   function handleClique(index) {
//     let curr = getArray();
//     curr[index].check = !curr[index].check;
//     setArray(curr);
//   }
//   let value = "";
//   function handleInput(event) {
//     console.log("input event");
//     console.log("set text", event.target.value);

//     setText(event.target.value);
//     event.preventDefault();
//     // value = event.target.value;
//     // console.log("set:", value);
//   }

//   function handleAdd(event) {
//     console.log("btn event");
//     // event.preventDefault();
//     // setArray([
//     //   ...getArray(),
//     //   {
//     //     check: false,
//     //     value: getText(),
//     //   },
//     // ]);
//     // console.log(getArray());
//     // setText("");
//   }
//   return {
//     key: key,
//     render: () => {
//       // document.addEventListener("input", function(event) {
//       //   event.preventDefault()
//       //   console.log("inpuuuut");
//       //   setText(event.target.value);
//       // });

//       return (
//         <root>
//           <div className="container">
//             <div className="todo-app">
//               <h2>
//                 To-Do List <img src="./assets/icon.png" alt="" />
//               </h2>

//               <div className="row">
//                 <input
//                   type="text"
//                   id="input-box"
//                   placeholder="Add your text"
//                   onchange={(e) => handleInput(e)}
//                   value={getText()}
//                 />
//                 <button onclick={handleAdd}>Add</button>
//               </div>

//               <ul id="list-container">
//                 <loop
//                   on={getArray()}
//                   exec={(elem, id) => (
//                     <>
//                       <li className={elem.check ? "uncheked" : "checked"}>
//                         <img
//                           src={`../../assets/${
//                             elem.check ? "checked.png" : "unchecked.png"
//                           }`}
//                           onclick={() => handleClique(id)}
//                         />
//                         <p>{elem.value}</p>
//                       </li>
//                     </>
//                   )}
//                 />
//               </ul>
//             </div>
//           </div>
//         </root>
//       );
//     },
//   };
// }

