const fs = require ("fs");
const PLUGIN_NAME = "webpackModuleCounterPlugin";
/**
 * Extracts simplified info from the modules and their dependencies
 * @param {Compilation} compilation the compilation
 * @returns {Map<DependenciesBlock, { modules: Iterable<Module>,
 *   blocks: AsyncDependenciesBlock[]}>} the mapping block to modules
 *   and inner blocks
 */
const extraceBlockInfoMap = compilation => {
	/** @type {Map<DependenciesBlock, { modules: Iterable<Module>, blocks: AsyncDependenciesBlock[]}>} */
	const blockInfoMap = new Map ();

	/**
	 * @param {Dependency} d dependency to iterate over
	 * @returns {void}
	 */
	const iteratorDependency = d => {
		// We skip Dependencies without Reference
		const ref = compilation.getDependencyReference (currentModule, d);
		if (!ref) {
			return;
		}
		// We skip Dependencies without Module pointer
		const refModule = ref.module;
		if (!refModule) {
			return;
		}
		// We skip weak Dependencies
		if (ref.weak) {
			return;
		}

		blockInfoModules.add (refModule);
	};

	/**
	 * @param {AsyncDependenciesBlock} b blocks to prepare
	 * @returns {void}
	 */
	const iteratorBlockPrepare = b => {
		blockInfoBlocks.push (b);
		blockQueue.push (b);
	};

	/** @type {Module} */
	let currentModule;
	/** @type {DependenciesBlock} */
	let block;
	/** @type {DependenciesBlock[]} */
	let blockQueue;
	/** @type {Set<Module>} */
	let blockInfoModules;
	/** @type {AsyncDependenciesBlock[]} */
	let blockInfoBlocks;

	for (const module of compilation.modules) {
		blockQueue = [module];
		currentModule = module;
		while (blockQueue.length > 0) {
			block = blockQueue.pop ();
			blockInfoModules = new Set ();
			blockInfoBlocks = [];

			if (block.variables) {
				for (const variable of block.variables) {
					for (const dep of variable.dependencies) iteratorDependency (dep);
				}
			}

			if (block.dependencies) {
				for (const dep of block.dependencies) iteratorDependency (dep);
			}

			if (block.blocks) {
				for (const b of block.blocks) iteratorBlockPrepare (b);
			}

			const blockInfo = {
				modules: blockInfoModules,
				blocks: blockInfoBlocks
			};
			blockInfoMap.set (block, blockInfo);
		}
	}

	return blockInfoMap;
};
module.exports = class webpackModuleCounterPlugin {
	apply (compiler) {
		compiler.hooks.compilation.tap (PLUGIN_NAME, (compilation, callback) => {
			let { modules, chunks, entries } = compilation;
			compilation.hooks.beforeChunks.tap (PLUGIN_NAME, () => {
				const blockInfoMap = extraceBlockInfoMap(compilation);
				entries.forEach (entry=>{
					const moduleTree={id:null,children:[]}
					moduleTree.id=entry.id;
					moduleTree.children.push()

				})

			});
			compilation.hooks.afterChunks.tap (PLUGIN_NAME, () => {
				console.log (modules, chunks);
				debugger
			});
		});
	}
};

