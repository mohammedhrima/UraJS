export function logmsg(...args) {
    console.log(args.join(' '));
}

export function loginfo(...args) {
    console.log('\x1b[36m%s\x1b[0m', args.join(' '));
}

export function logerror(...args) {
    console.log('\x1b[31m%s\x1b[0m', args.join(' '));
}