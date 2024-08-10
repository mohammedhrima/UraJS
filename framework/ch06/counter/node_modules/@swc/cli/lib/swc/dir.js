"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dir;
    }
});
const _fs = require("fs");
const _path = require("path");
const _piscina = /*#__PURE__*/ _interop_require_default(require("piscina"));
const _constants = require("./constants");
const _util = require("./util");
const _dirWorker = /*#__PURE__*/ _interop_require_default(require("./dirWorker"));
const _sources = require("./sources");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { mkdir, rmdir, rm, copyFile, unlink } = _fs.promises;
const recursive = {
    recursive: true
};
async function handleCopy(filename, outDir, stripLeadingPaths) {
    const dest = (0, _util.getDest)(filename, outDir, stripLeadingPaths);
    const dir = (0, _path.dirname)(dest);
    await mkdir(dir, recursive);
    await copyFile(filename, dest);
    return _constants.CompileStatus.Copied;
}
async function beforeStartCompilation(cliOptions) {
    const { outDir, deleteDirOnStart } = cliOptions;
    if (deleteDirOnStart) {
        const exists = await (0, _fs.existsSync)(outDir);
        if (exists) {
            rm ? await rm(outDir, recursive) : await rmdir(outDir, recursive);
        }
    }
}
async function initialCompilation(cliOptions, swcOptions) {
    const { includeDotfiles, filenames, copyFiles, extensions, outDir, outFileExtension, stripLeadingPaths, sync, quiet, watch, only, ignore } = cliOptions;
    const results = new Map();
    const start = process.hrtime();
    const sourceFiles = await (0, _sources.globSources)(filenames, only, ignore, includeDotfiles);
    const [compilable, copyable] = (0, _sources.splitCompilableAndCopyable)(sourceFiles, extensions, copyFiles);
    if (sync) {
        for (const filename of compilable){
            try {
                const result = await (0, _dirWorker.default)({
                    filename,
                    outDir,
                    sync,
                    cliOptions,
                    swcOptions,
                    outFileExtension
                });
                results.set(filename, result);
            } catch (err) {
                console.error(err.message);
                results.set(filename, _constants.CompileStatus.Failed);
            }
        }
        for (const filename of copyable){
            try {
                const result = await handleCopy(filename, outDir, stripLeadingPaths);
                results.set(filename, result);
            } catch (err) {
                console.error(err.message);
                results.set(filename, _constants.CompileStatus.Failed);
            }
        }
    } else {
        const workers = new _piscina.default({
            filename: (0, _path.resolve)(__dirname, "./dirWorker.js"),
            maxThreads: cliOptions.workers,
            concurrentTasksPerWorker: 2
        });
        await Promise.all([
            Promise.allSettled(compilable.map((filename)=>workers.run({
                    filename,
                    outDir,
                    sync,
                    cliOptions,
                    swcOptions,
                    outFileExtension
                }).catch((err)=>{
                    console.error(err.message);
                    throw err;
                }))),
            Promise.allSettled(copyable.map((file)=>handleCopy(file, outDir, stripLeadingPaths)))
        ]).then(([compiled, copied])=>{
            compiled.forEach((result, index)=>{
                const filename = compilable[index];
                if (result.status === "fulfilled") {
                    results.set(filename, result.value);
                } else {
                    results.set(filename, _constants.CompileStatus.Failed);
                }
            });
            copied.forEach((result, index)=>{
                const filename = copyable[index];
                if (result.status === "fulfilled") {
                    results.set(filename, result.value);
                } else {
                    results.set(filename, _constants.CompileStatus.Failed);
                }
            });
        });
    }
    const end = process.hrtime(start);
    let failed = 0;
    let compiled = 0;
    let copied = 0;
    for (let [_, status] of results){
        switch(status){
            case _constants.CompileStatus.Compiled:
                compiled += 1;
                break;
            case _constants.CompileStatus.Failed:
                failed += 1;
                break;
            case _constants.CompileStatus.Copied:
                copied += 1;
                break;
        }
    }
    if (!quiet && compiled + copied) {
        let message = "";
        if (compiled) {
            message += `Successfully compiled: ${compiled} ${compiled > 1 ? "files" : "file"}`;
        }
        if (compiled && copied) {
            message += ", ";
        }
        if (copied) {
            message += `copied ${copied} ${copied > 1 ? "files" : "file"}`;
        }
        message += ` with swc (%dms)`;
        console.log(message, (end[1] / 1000000).toFixed(2));
    }
    if (failed) {
        console.log(`Failed to compile ${failed} ${failed !== 1 ? "files" : "file"} with swc.`);
        if (!watch) {
            const files = Array.from(results.entries()).filter(([, status])=>status === _constants.CompileStatus.Failed).map(([filename, _])=>filename).join("\n");
            throw new Error(`Failed to compile:\n${files}`);
        }
    }
}
async function watchCompilation(cliOptions, swcOptions) {
    const { includeDotfiles, filenames, copyFiles, extensions, outDir, stripLeadingPaths, outFileExtension, quiet, sync } = cliOptions;
    const watcher = await (0, _sources.watchSources)(filenames, includeDotfiles);
    watcher.on("ready", ()=>{
        if (!quiet) {
            console.info("Watching for file changes.");
        }
    });
    watcher.on("unlink", async (filename)=>{
        try {
            if ((0, _sources.isCompilableExtension)(filename, extensions)) {
                await unlink((0, _util.getDest)(filename, outDir, stripLeadingPaths, ".js"));
                const sourcemapPath = (0, _util.getDest)(filename, outDir, stripLeadingPaths, ".js.map");
                const sourcemapExists = await (0, _util.exists)(sourcemapPath);
                if (sourcemapExists) {
                    await unlink(sourcemapPath);
                }
            } else if (copyFiles) {
                await unlink((0, _util.getDest)(filename, outDir, stripLeadingPaths));
            }
        } catch (err) {
            if (err.code !== "ENOENT") {
                console.error(err.stack);
            }
        }
    });
    for (const type of [
        "add",
        "change"
    ]){
        watcher.on(type, async (filename)=>{
            if ((0, _sources.isCompilableExtension)(filename, extensions)) {
                try {
                    const start = process.hrtime();
                    const result = await (0, _dirWorker.default)({
                        filename,
                        outDir,
                        sync,
                        cliOptions,
                        swcOptions,
                        outFileExtension
                    });
                    if (!quiet && result === _constants.CompileStatus.Compiled) {
                        const end = process.hrtime(start);
                        console.log(`Successfully compiled ${filename} with swc (%dms)`, (end[1] / 1000000).toFixed(2));
                    }
                } catch (err) {
                    console.error(err.message);
                }
            } else if (copyFiles) {
                try {
                    const start = process.hrtime();
                    const result = await handleCopy(filename, outDir, stripLeadingPaths);
                    if (!quiet && result === _constants.CompileStatus.Copied) {
                        const end = process.hrtime(start);
                        console.log(`Successfully copied ${filename} with swc (%dms)`, (end[1] / 1000000).toFixed(2));
                    }
                } catch (err) {
                    console.error(`Failed to copy ${filename}`);
                    console.error(err.message);
                }
            }
        });
    }
}
async function dir({ cliOptions, swcOptions }) {
    const { watch } = cliOptions;
    await beforeStartCompilation(cliOptions);
    await initialCompilation(cliOptions, swcOptions);
    if (watch) {
        await watchCompilation(cliOptions, swcOptions);
    }
}

//# sourceMappingURL=dir.js.map