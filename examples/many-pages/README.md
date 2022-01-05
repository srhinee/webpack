# Info

This example illustrates webpack's algorithm for automatic deduplication using `optimization.splitChunks`.

This example application contains 7 pages, each of them importing 1-3 modules from the `node_modules` folder (vendor libs) and 0-3 modules from the `stuff` folder (application modules). In reallity an application is probably more complex, but the same mechanisms apply.

The following configuration is used:

- `optimization.splitChunks.chunks: "all"` - This opt-in into automatic splitting of initial chunks which is off by default
- `optimization.splitChunks.maxInitial/AsyncRequests: 20` - This opt-in into a HTTP2 optimized splitting mode by increasing the allowed amount of requests. Browser only supports 6 requests in parallel for HTTP1.1.

# Interpreting the result

- `pageA.js` the normal output files for the entrypoint `pageA`
- `vendors~pageD~pageE~pageF~pageG.js` vendor libs shared by these pages extracted into a separate output file when larger then the threshold in size
- `vendors~pageA.js` vendors only used by a single page but larger than the threshold in size
- `pageA~pageD~pageF.js` application modules shared by these pages and larger than the threshold in size

The threshold is here 40 bytes, but by default (in a real application) 30kb.

Some modules are intentially duplicated, i. e. `./stuff/s4.js` is shared by `pageA` and `pageC`, but it's the only shared module so no separate output file is created because it would be smaller than the threshold. A separate request (which comes with an overhead and worsen gzipping) is not worth the extra bytes.

Note: decreasing `maxInitial/AsyncRequest` will increase duplication further to reduce the number of requests. Duplication doesn't affect initial page load, it only affects download size of navigations to other pages of the application.

## webpack.config.js

```
module.exports = {
	// mode: "development || "production",
	entry: {
		pageA: "./pages/a",
		pageB: "./pages/b",
		pageC: "./pages/c",
		pageD: "./pages/d",
		pageE: "./pages/e",
		pageF: "./pages/f",
		pageG: "./pages/g"
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			maxInitialRequests: 20, // for HTTP2
			maxAsyncRequests: 20, // for HTTP2
			minSize: 40 // for example only: chosen to match 2 modules
			// omit minSize in real use case to use the default of 30kb
		}
	}
};
```

## Production mode

```
Hash: 0a1b2c3d4e5f6a7b8c9d
Version: webpack 4.46.0
   Asset       Size  Chunks             Chunk Names
pageA.js  958 bytes       0  [emitted]  pageA
pageB.js  960 bytes       1  [emitted]  pageB
pageC.js  960 bytes       2  [emitted]  pageC
pageD.js  960 bytes       3  [emitted]  pageD
pageE.js  960 bytes       4  [emitted]  pageE
pageF.js  960 bytes       5  [emitted]  pageF
pageG.js  960 bytes       6  [emitted]  pageG
Entrypoint pageA = pageA.js
Entrypoint pageB = pageB.js
Entrypoint pageC = pageC.js
Entrypoint pageD = pageD.js
Entrypoint pageE = pageE.js
Entrypoint pageF = pageF.js
Entrypoint pageG = pageG.js
chunk    {0} pageA.js (pageA) 106 bytes [entry] [rendered] > ./pages/a pageA
 [8] ./pages/a.js 106 bytes {0} [built]
chunk    {1} pageB.js (pageB) 106 bytes [entry] [rendered]
    > ./pages/b pageB
 [11] ./pages/b.js 106 bytes {1} [built]
chunk    {2} pageC.js (pageC) 106 bytes [entry] [rendered]
    > ./pages/c pageC
 [12] ./pages/c.js 106 bytes {2} [built]
chunk    {3} pageD.js (pageD) 106 bytes [entry] [rendered]
    > ./pages/d pageD
 [13] ./pages/d.js 106 bytes {3} [built]
chunk    {4} pageE.js (pageE) 62 bytes [entry] [rendered]
    > ./pages/e pageE
 [14] ./pages/e.js 62 bytes {4} [built]
chunk    {5} pageF.js (pageF) 106 bytes [entry] [rendered]
    > ./pages/f pageF
 [15] ./pages/f.js 106 bytes {5} [built]
chunk    {6} pageG.js (pageG) 36 bytes [entry] [rendered]
    > ./pages/g pageG
 [16] ./pages/g.js 36 bytes {6} [built]
```
