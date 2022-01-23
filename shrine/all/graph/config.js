const container = document.getElementById ("container");
const width = container.scrollWidth;
const height = container.scrollHeight || 500;
const config = {
	container: "container",
	width,
	height,
	linkCenter: true,
	modes: {
		default: [
			{
				type: "collapse-expand",
				onChange: function onChange (item, collapsed) {
					const data = item.get ("model");
					const group = item.get ("group");
					console.log(group)
					data.collapsed = collapsed;
					return true;
				}
			},
			"drag-canvas",
			"zoom-canvas"
		]
	},

	defaultNode: {
		type: "modelRect",
		size: [120, 30],
		style: {
			radius: 5,
			stroke: "#69c0ff",
			fill: "#ffffff",
			lineWidth: 1,
			fillOpacity: 1
		},
		// label configurations
		labelCfg: {
			style: {
				fill: "#595959",
				fontSize: 8
			},
			// paddingTop:-10,
			position: "left",//无效
			offset: 10
		},
		// left rect
		preRect: {
			show: false,
			width: 4,
			fill: "#40a9ff",
			radius: 2
		},
		// configurations for the icon
		logoIcon: {
			// whether to show the icon
			show: true,
			x: 0,
			y: 0,
			// the image url for the icon, string type
			img:
				"https://gw.alipayobjects.com/zos/basement_prod/4f81893c-1806-4de4-aff3-9a6b266bc8a2.svg",
			width: 16,
			height: 16,
			// adjust the offset along x-axis for the icon
			offset: -10
		}
	},
	nodeStateStyles: {
		hover: {
			lineWidth: 2,
			stroke: "#1890ff",
			fill: "#e6f7ff"
		}
	},
	defaultEdge: {
		type: "arc",
		/* you can configure the global edge style as following lines */
		style: {
			// endArrow: {
			// 	path: G6.Arrow.triangle(),
			// },
			stroke: "#5c8b8a"
		}
	},

	layout: {
		type: "compactBox",
		direction: "LR",
		getId: function getId (d) {
			return d.id;
		},
		getVGap: (d) => {
			return 20;
		},
		getHGap: (d) => {
			return 80;
		}
		// radial: true
	}
};
// export default config;
window.config = config;
