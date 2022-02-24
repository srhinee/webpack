(function initG6 () {
  const container = document.getElementById ("container")
  const width = container.scrollWidth
  const height = container.scrollHeight || 500

  const config = {
    container: "container",
    width,
    height,
    modes: {
      default: [
        {
          type: "collapse-expand",
          onChange: function onChange (item, collapsed) {
            const data = item.get ("model")
            const group = item.get ("group")
            console.log (group)
            data.collapsed = collapsed
            return true
          }
        },
        "drag-canvas",
        "zoom-canvas",
        {
          type: 'tooltip',
          formatText (item) {
            debugger
            return item.label
          },
          offset: 10,
        },
      ]
    },

    defaultNode: {
      type: "rect",
      size: [60, 20],
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
        position: "center",//无效
        offset: 10
      },

    },
    nodeStateStyles: {
      hover: {
        lineWidth: 2,
        stroke: "#1890ff",
        fill: "#e6f7ff"
      }
    },
    defaultEdge: {
      type: "polyline",
      style: {
        endArrow: {
          path: G6.Arrow.triangle (5, 8, 2),
          fill: '#5c8b8a',
          stroke: false,
          lineDash: [100],
          d: 2
        },
        radius: 5,
        lineWidth: 1,
        strokeOpacity: .6,
        lineDash: [2, 3],
        stroke: "#5c8b8a"
      }
    },

    layout: {
      type: "mindmap",
      direction: "V",
      getWidth (d) {
        return 10
      },
      getHeight (d) {
        return 20
      },
      getVGap (d) {
        return 10
      },
      getHGap (d) {
        return 40
      }
    }
  }

  const graph = new G6.TreeGraph (config)
  graph.data (originalData)
  graph.node ((node) => {
    if (node.meta.type === 'block') {
      node.style.stroke = '#f93516'
    }
    return node
  })
  graph.render ()
  graph.fitView ()
  graph.on ('node:mouseenter', (evt) => {
    const {item} = evt
    graph.setItemState (item, 'hover', true)
  })

  graph.on ('node:mouseleave', (evt) => {
    const {item} = evt
    graph.setItemState (item, 'hover', false)
  })
  if (typeof window !== "undefined") window.onresize = () => {
    if (!graph || graph.get ("destroyed")) return
    if (!container || !container.scrollWidth || !container.scrollHeight) return
    graph.changeSize (container.scrollWidth, container.scrollHeight)
  }
  window.graph = graph
} ())
