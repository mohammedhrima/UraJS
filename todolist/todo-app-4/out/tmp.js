let oldVdom = {
    index: 6,
    tag: "root",
    type: "element",
    children: [
        {
            index: 0,
            tag: "div",
            type: "element",
            props: {
                id: "home",
                name: "home",
            },
            children: [
                { type: "text", index: 1, value: "test counter " },
                { type: "text", index: 2, value: 1 },
                { type: "text", index: 7, value: 0 },
                { type: "text", index: 8, value: 2 },
                { type: "text", index: 9, value: 2 },
                { type: "text", index: 10, value: 2 },
            ],
        },
        { index: 3, tag: "br", type: "element", children: [] },
        {
            index: 4,
            tag: "button",
            type: "element",
            children: [{ type: "text", index: 5, value: "clique me" }],
        },
    ],
    isfunc: true,
    key: 1,
};
let newVdom = {
    index: 6,
    tag: "root",
    type: "element",
    children: [
        {
            index: 0,
            tag: "div",
            type: "element",
            props: {
                id: "new-home",
                nickname: "hello",
            },
            children: [
                { type: "text", index: 1, value: "test counter " },
                { type: "text", index: 2, value: 1 },
                { type: "text", index: 7, value: 4 },
                { type: "element", index: 8, tag: "button" },
                { type: "text", index: 9, value: 5 },
            ],
        },
        { index: 3, tag: "br", type: "element", children: [] },
        {
            index: 4,
            tag: "button",
            type: "element",
            children: [{ type: "text", index: 5, value: "clique me" }],
        },
    ],
    isfunc: true,
    key: 1,
};
function reconciliate(left, right) {
    // Handle case where the tag or type is different
    if (left.tag !== right.tag || left.type !== right.type) {
        return {
            action: "replace",
            left: left,
            right: right,
        };
    }
    // Handle case where the text node's value has changed
    if (left.type === "text" && left.value !== right.value) {
        return {
            action: "replace",
            left: left,
            right: right,
        };
    }
    // Compare props
    let propChanges = reconciliateProps(left.props, right.props, left.index);
    const children1 = left.children || [];
    const children2 = right.children || [];
    let subs = [];
    // Reconciliate children
    for (let i = 0; i < Math.max(children1.length, children2.length); i++) {
        const child1 = children1[i];
        const child2 = children2[i];
        if (child1 && child2) {
            let diff = reconciliate(child1, child2);
            if (diff.action != "keep")
                subs.push(diff);
        }
        else if (child1 && !child2) {
            subs.push({
                action: "remove",
                left: child1,
            });
        }
        else if (!child1 && child2) {
            subs.push({
                action: "insert",
                right: child2,
            });
        }
    }
    // Return the result, including prop changes and children reconciliation
    return {
        left: left,
        action: subs.length || propChanges.length ? "update" : "keep",
        subs: subs,
        propChanges: propChanges, // Track any prop changes
    };
}
// Function to compare props and log differences
function reconciliateProps(oldProps = {}, newProps = {}, index) {
    let propChanges = [];
    // Check for props that need to be removed or changed
    for (let key in oldProps) {
        if (!(key in newProps)) {
            console.log(`Remove prop '${key}' from element with index ${index}`);
            propChanges.push({
                action: "removeProp",
                key: key,
            });
        }
        else if (oldProps[key] !== newProps[key]) {
            console.log(`Change prop '${key}' from '${oldProps[key]}' to '${newProps[key]}' for element with index ${index}`);
            propChanges.push({
                action: "changeProp",
                key: key,
                oldValue: oldProps[key],
                newValue: newProps[key],
            });
        }
    }
    // Check for new props that need to be added
    for (let key in newProps) {
        if (!(key in oldProps)) {
            console.log(`Add prop '${key}' with value '${newProps[key]}' to element with index ${index}`);
            propChanges.push({
                action: "addProp",
                key: key,
                value: newProps[key],
            });
        }
    }
    return propChanges;
}
// Rendering function to apply changes
function execute(rec, parent) {
    switch (rec.action) {
        case "keep": {
            console.log(`Keep ${rec.left.index}`);
            return rec.left;
        }
        case "update": {
            console.log(`Update ${rec.left.index} children`);
            // Handle prop changes
            if (rec.propChanges?.length) {
                rec.propChanges.forEach((change) => {
                    if (change.action === "removeProp") {
                        console.log(`Removing prop '${change.key}' from element ${rec.left.index}`);
                    }
                    else if (change.action === "changeProp") {
                        console.log(`Changing prop '${change.key}' from '${change.oldValue}' to '${change.newValue}' for element ${rec.left.index}`);
                    }
                    else if (change.action === "addProp") {
                        console.log(`Adding prop '${change.key}' with value '${change.value}' to element ${rec.left.index}`);
                    }
                });
            }
            // Reconcile and execute child elements
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case "insert": {
            console.log(`Insert element with index ${rec.right.index} to element with index ${parent.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case "remove": {
            console.log(`Remove element with index ${rec.left.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        case "replace": {
            console.log(`Replace element with index ${rec.left.index} with element with index ${rec.right.index}`);
            rec.subs?.forEach((sub) => execute(sub, rec.left));
            break;
        }
        default:
            break;
    }
    return rec;
}
// Example usage:
const rec = reconciliate(oldVdom, newVdom);
execute(rec, oldVdom);
