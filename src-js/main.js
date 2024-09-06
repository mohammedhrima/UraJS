import Mini from "./mini.js";
const [index, count, setCount] = Mini.useState(1);
// const Func = () => {
//   console.log("call function");
//   return (
//     <button
//       onclick={() => {
//         console.log("click", count());
//         setCount(count() + 1);
//       }}
//     >
//       clique me {count()}
//     </button>
//   );
// };
// const user = {
//   firstName: "Chris",
//   lastName: "Bongers",
//   age: 10,
// };
// const handler = {
//   get(target: any, prop: any) {
//     console.log("get called", target, prop);
//     return target[prop].toUpperCase();
//   },
//   set(target: any, prop: any, value: any): any {
//     console.log(`changed ${prop} from ${target[prop]} to ${value}`);
//     target[prop] = value;
//   },
// };
// const proxyUser = new Proxy(user, handler);
// console.log(proxyUser.firstName);
// console.log(proxyUser.lastName);
const handler = {
    get(target, prop) {
        console.log("get called", target, prop);
        return target[prop].toUpperCase();
    },
    set(target, prop, value) {
        console.log(`changed ${prop} from ${target[prop]} to ${value}`);
        target[prop] = value;
    },
};
class Something {
    constructor() {
        this.x = 10;
    }
    render() {
        return Mini.Element("div", null, this.x);
    }
}
const Func = () => {
    let states = {
        id: 11,
    };
    let Test = () => Mini.Element("div", null,
        "hello ",
        states.id);
    // Test.parent.element = document.getElementById("root");
    // Test.states = states;
    return {
        func: Test,
        states: states,
    };
    return (Mini.Element("get", { find: "#root" },
        Mini.Element("state", { watch: index },
            Mini.Element(Test, null))));
};
Mini.display(Func).mount();
