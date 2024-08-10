import {promises as fsPromises} from 'fs';
import path from 'path';
import process from 'process';
import got from 'got';
import {fileTypeFromBuffer} from 'file-type';
import filenamify from 'filenamify';
import osFilterObj from 'os-filter-obj';
import binCheck from 'bin-check';
import binVersionCheck from 'bin-version-check';
import contentDisposition from 'content-disposition';
import extName from 'ext-name';

const getExtFromMime = response => {
	const header = response.headers['content-type'];

	if (!header) {
		return null;
	}

	const exts = extName.mime(header);

	if (exts.length !== 1) {
		return null;
	}

	return exts[0].ext;
};

const getFilename = async (response, data) => {
	const header = response.headers['content-disposition'];

	if (header) {
		const parsed = contentDisposition.parse(header);

		if (parsed.parameters && parsed.parameters.filename) {
			return parsed.parameters.filename;
		}
	}

	const filename = path.basename(new URL(response.requestUrl).pathname);

	if (!path.extname(filename)) {
		const fileTypeResult = await fileTypeFromBuffer(data).catch(() => null);
		const ext = fileTypeResult ? fileTypeResult.ext : getExtFromMime(response);

		if (ext && ext !== 'elf') {
			return `${filename}.${ext}`;
		}
	}

	return filename;
};

/**
 * Initialize a new `BinWrapper`
 *
 * @param {Object} options
 * @api public
 */
class BinWrapper {
	constructor(options = {}) {
		this.options = options;

		this._src = [];
		this._dest = '';
		this._use = '';
		this._version = '';
	}

	/**
	 * Get or set files to download
	 *
	 * @param {String} src
	 * @param {String} os
	 * @param {String} arch
	 * @api public
	 */
	src(src, os, arch) {
		if (arguments.length === 0) {
			return this._src;
		}

		this._src.push({
			url: src,
			os,
			arch,
		});

		return this;
	}

	/**
	 * Get or set the destination
	 *
	 * @param {String} dest
	 * @api public
	 */
	dest(dest) {
		if (arguments.length === 0) {
			return this._dest;
		}

		this._dest = dest;
		return this;
	}

	/**
	 * Get or set the binary
	 *
	 * @param {String} bin
	 * @api public
	 */
	use(bin) {
		if (arguments.length === 0) {
			return this._use;
		}

		this._use = bin;
		return this;
	}

	/**
	 * Get or set a semver range to test the binary against
	 *
	 * @param {String} range
	 * @api public
	 */
	version(range) {
		if (arguments.length === 0) {
			return this._version;
		}

		this._version = range;
		return this;
	}

	/**
	 * Get path to the binary
	 *
	 * @api public
	 */
	get path() {
		return path.join(this.dest(), this.use());
	}

	/**
	 * Run
	 *
	 * @param {Array} cmd
	 * @api public
	 */
	async run(cmd = ['--version']) {
		await this.findExisting();
		if (this.options.skipCheck) {
			return;
		}

		return this.runCheck(cmd);
	}

	/**
	 * Run binary check
	 *
	 * @param {Array} cmd
	 * @api private
	 */
	async runCheck(cmd) {
		const bin = this.path;
		if (this.version()) {
			if (cmd.length === 1 && cmd[0] === '--version') {
				return binVersionCheck(bin, this.version());
			}

			return binVersionCheck(bin, this.version(), {args: cmd});
		}

		await binCheck(bin, cmd).catch(() => {
			throw new Error(`The \`${bin}\` binary doesn't seem to work correctly`);
		});
	}

	/**
	 * Find existing files
	 *
	 * @api private
	 */
	async findExisting() {
		try {
			await fsPromises.stat(this.path);
		} catch (error) {
			if (error && error.code === 'ENOENT') {
				return this.download();
			}

			throw new Error(error);
		}
	}

	/**
	 * Download files
	 *
	 * @api private
	 */
	async download() {
		const files = osFilterObj(this.src());
		const urls = [];

		if (files.length === 0) {
			throw new Error('No binary found matching your system. It\'s probably not supported.');
		}

		for (const file of files) {
			urls.push(file.url);
		}

		const downloadFile = async (url, output) => {
			const responsePromise = got(url, {
				responseType: 'buffer',
				https: {
					rejectUnauthorized: process.env.npm_config_strict_ssl !== 'false',
				},
				...this.options.gotOptions,
			});
			const response = await responsePromise;
			const data = await responsePromise.buffer();

			if (!output) {
				return data;
			}

			const filename = this.options.filename || filenamify(await getFilename(response, data));
			const outputFilepath = path.join(output, filename);

			await fsPromises.mkdir(path.dirname(outputFilepath), {recursive: true});
			await fsPromises.writeFile(outputFilepath, data);
			return data;
		};

		const result = await Promise.all(urls.map(url => downloadFile(url, this.dest())));
		const resultingFiles = result.flatMap((item, index) => {
			if (Array.isArray(item)) {
				return item.map(file => file.path);
			}

			const parsedUrl = new URL(files[index].url);
			const parsedPath = path.parse(parsedUrl.pathname);

			return parsedPath.base;
		});

		return Promise.all(resultingFiles.map(fileName => fsPromises.chmod(path.join(this.dest(), fileName), 0o755)));
	}
}

export {BinWrapper};
