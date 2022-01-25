const fs = require ("fs")
const PLUGIN_NAME = "webpackModuleCounterPlugin"
/**
 * Extracts simplified info from the modules and their dependencies
 * @param {Compilation} compilation the compilation
 * @returns {Map<DependenciesBlock, { modules: Iterable<Module>,
 *   blocks: AsyncDependenciesBlock[]}>} the mapping block to modules
 *   and inner blocks
 */
const extraceBlockInfoMap = compilation => {
  /** @type {Map<DependenciesBlock, { modules: Iterable<Module>, blocks: AsyncDependenciesBlock[]}>} */
  const blockInfoMap = new Map ()

  /**
   * @param {Dependency} d dependency to iterate over
   * @returns {void}
   */
  const iteratorDependency = d => {
    // We skip Dependencies without Reference
    const ref = compilation.getDependencyReference (currentModule, d)
    if (!ref) {
      return
    }
    // We skip Dependencies without Module pointer
    const refModule = ref.module
    if (!refModule) {
      return
    }
    // We skip weak Dependencies
    if (ref.weak) {
      return
    }

    blockInfoModules.add (refModule)
  }

  /**
   * @param {AsyncDependenciesBlock} b blocks to prepare
   * @returns {void}
   */
  const iteratorBlockPrepare = b => {
    blockInfoBlocks.push (b)
    blockQueue.push (b)
  }

  /** @type {Module} */
  let currentModule
  /** @type {DependenciesBlock} */
  let block
  /** @type {DependenciesBlock[]} */
  let blockQueue
  /** @type {Set<Module>} */
  let blockInfoModules
  /** @type {AsyncDependenciesBlock[]} */
  let blockInfoBlocks

  for (const module of compilation.modules) {
    blockQueue = [module]
    currentModule = module
    while (blockQueue.length > 0) {
      block = blockQueue.pop ()
      blockInfoModules = new Set ()
      blockInfoBlocks = []

      if (block.variables) {
        for (const variable of block.variables) {
          for (const dep of variable.dependencies) iteratorDependency (dep)
        }
      }

      if (block.dependencies) {
        for (const dep of block.dependencies) iteratorDependency (dep)
      }

      if (block.blocks) {
        for (const b of block.blocks) iteratorBlockPrepare (b)
      }

      const blockInfo = {
        modules: blockInfoModules,
        blocks: blockInfoBlocks
      }
      blockInfoMap.set (block, blockInfo)
    }
  }

  return blockInfoMap
}

const dataTemplate = ({originData, optimizeData}) => `
  (function (){
  window.originalData=${JSON.stringify (originData)}
  window.optimizeData=${JSON.stringify (optimizeData)}
  }())
  `

module.exports = class webpackModuleCounterPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap (PLUGIN_NAME, (compilation, callback) => {
      const {modules, chunks, entries} = compilation


      compilation.hooks.afterHash.tap (PLUGIN_NAME, () => {
        const blockInfoMap = extraceBlockInfoMap (compilation)

        let index = 1
        let iteratorDep = (blocks, result, type = 'module') => {
          blocks.forEach (block => {
            const moduleTree = {
              id: 'N' + index++,
              label: block.request.split ('/').pop (),
              meta: {type, request: block.request, id: block.id},
              children: []
            }
            const {modules, blocks} = blockInfoMap.get (block)
            if (modules.size || blocks.length) {
              iteratorDep (modules, moduleTree.children)
              iteratorDep (blocks, moduleTree.children, 'block')
            } else delete moduleTree.children
            result.push (moduleTree)
          })
        }
        let results = []
        iteratorDep (entries, results)

        const baseRoot = {
          id: "N0",
          label: 'main chunk',
          meta: {type: 'block'},
        }
        const originData = Object.assign ({}, baseRoot, {children: results})


        const mainChunks = chunks.filter (chunk => chunk.id === 'main')
        iteratorDep = (chunk, block, result, type = 'module') => {
          const moduleTree = {
            id: 'N' + index++,
            label: block.request.split ('/').pop (),
            meta: {type, request: block.request, id: block.id},
            children: []
          }
          const {modules, blocks} = blockInfoMap.get (block)

          if (modules.size) {
            const interModules = new Set ([...modules].filter (x => chunk._modules.has (x)))
            interModules.forEach (b => iteratorDep (chunk, b, moduleTree.children))
          }
          if (blocks.length) {
            blocks.forEach (b => {
              const blockChunks = chunks.filter (c => {
                const group = c._groups.values ().next ().value
                return group && group._blocks.has (b)
              })
              blockChunks.forEach (c => iteratorDep (c, b, moduleTree.children, 'block'))
            })
          }
          if (!modules.size && !blocks.length) delete moduleTree.children
          result.push (moduleTree)
        }
        results = []
        index = 1
        const optimizeData = Object.assign ({}, baseRoot, {children: results})

        mainChunks.forEach (mainChunk => iteratorDep (mainChunk, mainChunk.entryModule, results))
        fs.exists ('graph', exists => {
          if (!exists) fs.mkdirSync ('graph')
          fs.writeFile ('graph/data.js', dataTemplate ({originData, optimizeData}), (err) => {if (err) throw err})
        })
      })
    })
  }
}

