import validTags from "./validTags"

let div = document.getElementById("app");

class State {
	constructor() {
		this.map = new Map();
		this.render = null;
	}
	setRender(func) {
		this.render = func;
	}
	setItem(key, value) {
		console.log("set item", key, "with value", value);
		this.map.set(key, value);
		if (this.render) this.render();
	}
	// TODO: if key not found throw an Error
	getItem(key) {
		if (!this.map.has(key)) throw `State: Item with key ${key} not found`;
		return this.map.get(key);
	}
	removeItem(key) {
		this.map.delete(key);
	}
	clear() {
		this.map.clear();
	}
}

function check(child) {
	if (!child) throw "check found NULL child";
	else if (typeof child === "string" || typeof child === "number") {
		return {
			type: "text",
			value: child,
		};
	}
	return child;
}

function createFragment(props, ...children) {
	return children || [];
}

function createElement(tag = null, props = {}, ...children) {
	// console.log(typeof tag, ":", tag);

	if (typeof tag === "function") {
		let func = tag(props || {});
		console.log("func:", func);
		if (func.length == 0) {
			return {
				type: "fragment",
				props: props || {},
				children: (children || []).map(check),
			}
		}
		return createElement(func.tag, func.props, ...func.children)
	}
	return {
		tag: tag,
		type: tag ? "element" : "fragment",
		props: props || {},
		children: (children || []).map(check),
		dom: null,
	};
}

function destroyDOM(vdom) {
	switch (vdom.type) {
		case "text": {
			vdom.dom.remove();
			break;
		}
		case "element": {
			vdom.dom.remove();
			vdom.children.map(destroyDOM);
			break;
		}
		case "fragment": {
			vdom.children.map(destroyDOM);
			break;
		}
		default: {
			break;
		}
	}
}

function mountDOM(vdom, parentDOM) {
	const style = {};
	switch (vdom.type) {
		case "element": {
			let { tag, props } = vdom;
			vdom.dom = document.createElement(tag);
			parentDOM.append(vdom.dom);

			Object.keys(props || {}).forEach((key) => {
				if (validTags[vdom?.tag].includes(key)) {
					if (key.startsWith("on")) vdom.dom[key] = props[key];
					else if (key === "style") Object.assign(style, props[key]);
					else if (key === "state") {
						console.log("found key state");
					}
					else {
						if (tag == "svg" || parent.tagName == "svg")
							vdom.dom.setAttribute(key, props[key]);
						else vdom.dom[key] = props[key];
					}
				} else {
					console.warn(`Invalid attribute "${key}" ignored.`);
				}
			});
			vdom.children?.map(child => {
				mountDOM(child, vdom.dom);
			})
			if (Object.keys(style).length > 0) {
				vdom.dom.style.cssText = Object.keys(style)
					.map((styleProp) => {
						const Camelkey = styleProp.replace(
							/[A-Z]/g,
							(match) => `-${match.toLowerCase()}`
						);
						return Camelkey + ":" + style[styleProp];
					})
					.join(";");
			}
			break;
		}
		case "text": {
			const { value } = vdom;
			vdom.dom = document.createTextNode(value);
			parentDOM.append(vdom.dom);
			break;
		}
		case "fragment": {
			vdom.children.map((child) => {
				mountDOM(child, parentDOM);
			});
		}
		default:
			break;
	}
}

function SayHi() {
	return (<div>hi</div>)
}

function Tag() {
	const state = new State();
	state.setItem("x", 0);
	state.getItem("x");

	return (
		<>
			<h1 style={{ color: "red" }} >
				{state.getItem("x")}
			</h1>
			<button
			// onclick={()=>{state.setItem("x", state.getItem("x") + 1)}}
			>
				clique me
			</button>
			<SayHi />
		</>
	)
}

function createApp(app) {
	let vdom = null;
	// if (typeof app === "function") app = app();
	console.log(app);
	return {
		mount(parentDOM) {
			if (vdom) destroyDOM(vdom);
			vdom = app;

			mountDOM(vdom, parentDOM);
			return vdom;
		},
		unmount() {
			destroyDOM(vdom);
			vdom = null;
		},
	};
}

createApp(Tag()).mount(div);
