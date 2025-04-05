

export function logmsg(...args) {
    console.log('\x1b[32m%s\x1b[0m', "[MSG]:", args.join(' '));
}

export function loginfo(...args) {
    console.log('\x1b[36m%s\x1b[0m', "[INFO]:", args.join(' '));
}

export function logerror(...args) {
    console.log('\x1b[31m%s\x1b[0m', "[ERROR]:", args.join(' '));
}

export function logwarn(...args) {
    console.log('\x1b[33m%s\x1b[0m', "[WARN]:", args.join(' '));
}