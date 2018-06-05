import { loadYaml, glob, now, printLog } from './utils';
import { router } from 'cmdrouter';
import { extname } from 'path';
import { rollupFiles, pcssFiles, tmplFiles } from './processors';
import { spawn } from 'p-spawn';
import * as chokidar from 'chokidar';

type BundlerFn = (bundle: Bundle, opts?: BuildOptions) => Promise<any>;

type BundleType = 'js' | 'ts' | 'pcss' | 'tmpl';

const bundlers: { [type: string]: BundlerFn } = {
	ts: buildTsBundler,
	js: buildJsBundler,
	pcss: buildPcssBundler,
	tmpl: buildTmplBundler,
}

router({ build, watch }).route();

type Bundle = {
	name: string,
	type: BundleType,
	entries: string,
	dist: string,
	tsconfig?: string,
	rollupOptions?: any
};

type BuildData = { 'webBundles': Bundle[] };


async function build() {

	const buildData = await loadBuildData();

	for (let bundle of buildData.webBundles) {
		await buildBundle(bundle);
	}

}


async function watch() {

	const buildData = await loadBuildData();

	for (let bundle of buildData.webBundles) {
		// TODO: might need to handle the case when we add/delete files
		if (bundle.type === 'js' || bundle.type === 'ts') {
			await buildBundle(bundle, { watch: true });
		}

		// otherwise, we just watch the entries, and rebuild everything
		else {
			await buildBundle(bundle);
			let watcher = chokidar.watch(bundle.entries, { persistent: true });
			watcher.on('change', async function (filePath: string, stats) {
				if (filePath.endsWith(`.${bundle.type}`)) {
					await buildBundle(bundle);
				}
			});
		}
	}

	spawn('npm', ['run', 'start']);
}

//#region    Bundlers

export interface BuildOptions {
	watch?: boolean; // for rollup bundles for now
	full?: boolean; // for maven for including unit test (not implemented yet)
}

async function buildBundle(bundle: Bundle, opts?: BuildOptions) {
	const start = now();
	await bundlers[bundle.type](bundle, opts);
	printLog(`${bundle.name} built`, bundle.dist, start);
}

async function buildTsBundler(bundle: Bundle, opts?: BuildOptions) {
	// TODO: need to re-enable watch
	try {
		if (opts && opts.watch) {
			bundle.rollupOptions.watch = {
				chokidar: true,
				includes: bundle.entries
			};
		}
		// resolve all of the entries (with glob)
		const allEntries = await glob(bundle.entries);
		await rollupFiles(allEntries, bundle.dist, bundle.rollupOptions);
	} catch (ex) {
		// TODO: need to move exception ahndle to the caller
		console.log("BUILD ERROR - something when wrong on rollup\n\t", ex);
		console.log("Empty string was save to the app bundle");
		console.log("Trying saving again...");
		return;
	}
}

async function buildPcssBundler(bundle: Bundle, opts?: BuildOptions) {
	const allEntries = await glob(bundle.entries);
	await pcssFiles(allEntries, bundle.dist);
}

async function buildTmplBundler(bundle: Bundle, opts?: BuildOptions) {
	const allEntries = await glob(bundle.entries);
	await tmplFiles(allEntries, bundle.dist);
}

async function buildJsBundler(bundle: Bundle, opts?: BuildOptions) {
	if (opts && opts.watch) {
		bundle.rollupOptions.watch = {
			chokidar: true,
			includes: bundle.entries
		};
	}
	const allEntries = await glob(bundle.entries);
	await rollupFiles(allEntries, bundle.dist, bundle.rollupOptions);
}

//#endregion Bundlers



//#region    Private Utils
const rollupOptionsDefault = {
	watch: false
}

type TypeStrings = 'js' | 'ts' | 'pcss' | 'tmpl'; // must have a better way to do this enum check

async function loadBuildData() {
	// Note: Technically at this stage, not a full BuildData, this methods hide the plumbing.
	const buildData: BuildData = <BuildData>(await loadYaml('./build.yaml'));


	for (let bundle of buildData.webBundles) {
		// Initialize the bundle `.type` (for now, just based on entry)
		bundle.type = <BundleType>extname(bundle.entries).slice(1);

		if (bundle.type === 'ts' || bundle.type === 'js') {
			// get the base default options for this type
			// override default it if bundle has one
			const rollupOptions = (bundle.rollupOptions) ? { ...rollupOptionsDefault, ...bundle.rollupOptions }
				: { ...rollupOptionsDefault };

			// resolve tsconfig
			if (bundle.tsconfig) {
				rollupOptions.tsconfig = bundle.tsconfig;
			}

			// set the new option back.
			bundle.rollupOptions = rollupOptions;
		}
	}

	return buildData;
}
//#endregion Private Utils