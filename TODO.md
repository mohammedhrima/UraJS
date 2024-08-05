+ 2 players in same keyboard
+ tournament:
    + add game types

+ registration
    + hash password
    + SQL injections / XSS
    + Sign up / Login
    + upload images (avatar)
    + user can choose nickname
    + Google authentification

+ Chat
    + chat box should expand if text is big
    + message send when cliquing enter or button send
    + chat message divs should be expandable depends on
      message size

+ add friends


+ responsivity
+ lazy loading

+ building command npx swc ./src -d dist --strip-leading-paths

+ listenOnDir:
    + loop on content:
        + if isDir:
            + listenOnDir
        + elif isFile:
            + if file not js:
                + copy file if changed
            + elif is js:
                + execute npx swc file -d dist