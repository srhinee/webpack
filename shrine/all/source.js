/* normalize component */
import normalizer
	from "!../../node_modules/vue-loader/lib/runtime/componentNormalizer.js";
import script from "./a.vue?vue&type=script&lang=js&";
import {
	render,
	staticRenderFns
} from "./a.vue?vue&type=template&id=76ee1843&scoped=true&";

export * from "./a.vue?vue&type=script&lang=js&"


var component = normalizer(
	script,
	render,
	staticRenderFns,
	false,
	null,
	"76ee1843",
	null

)

/* hot reload */
if (module.hot) {
	var api = require("F:\\project\\origin\\webpack\\node_modules\\vue-hot-reload-api\\dist\\index.js")
	api.install(require('vue'))
	if (api.compatible) {
		module.hot.accept()
		if (!api.isRecorded('76ee1843')) {
			api.createRecord('76ee1843', component.options)
		} else {
			api.reload('76ee1843', component.options)
		}
		module.hot.accept("./a.vue?vue&type=template&id=76ee1843&scoped=true&", function () {
			api.rerender('76ee1843', {
				render: render,
				staticRenderFns: staticRenderFns
			})
		})
	}
}
component.options.__file = "a.vue"
export default component.exports
