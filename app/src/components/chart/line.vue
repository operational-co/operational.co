<template>
  <div class="c-chart-line">
    <div :class="['c-chart-line__popup', { active: popupActive === true }]" :style="popupStyle">
      <article v-if="popupActive">
        <span>{{ computedPopupDatumX }}</span>
        <!-- <span>{{ popupDatum.y }}</span> -->
      </article>
    </div>
    <div class="c-chart-line__chart" ref="svg"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

import moment from "moment";

export default {
  data: function () {
    return {
      width: 100,
      height: 100,
      popupActive: false,
      popupDataPoints: null,
      popupX: 0,
      popupY: 0,
    };
  },

  props: {
    datasets: {
      type: Array,
      default: function () {
        return [
          {
            color: "#777",
            data: [
              { x: "2024-09-10T00:00:00Z", y: 90 },
              { x: "2024-09-11T00:00:00Z", y: 70 },
              { x: "2024-09-12T00:00:00Z", y: 95 },
              { x: "2024-09-13T00:00:00Z", y: 90 },
              { x: "2024-09-14T00:00:00Z", y: 102 },
              { x: "2024-09-15T00:00:00Z", y: 105 },
              { x: "2024-09-16T00:00:00Z", y: 124 },
              { x: "2024-09-17T00:00:00Z", y: 80 },
              { x: "2024-09-18T00:00:00Z", y: 120 },
              { x: "2024-09-19T00:00:00Z", y: 123 },
              { x: "2024-09-20T00:00:00Z", y: 100 },
              { x: "2024-09-21T00:00:00Z", y: 115 },
            ],
          },
          {
            data: [
              { x: "2024-09-10T00:00:00Z", y: 100 },
              { x: "2024-09-11T00:00:00Z", y: 120 },
              { x: "2024-09-12T00:00:00Z", y: 115 },
              { x: "2024-09-13T00:00:00Z", y: null },
              { x: "2024-09-14T00:00:00Z", y: 122 },
              { x: "2024-09-15T00:00:00Z", y: 135 },
              { x: "2024-09-16T00:00:00Z", y: 144 },
              { x: "2024-09-17T00:00:00Z", y: null },
              { x: "2024-09-18T00:00:00Z", y: 90 },
              { x: "2024-09-19T00:00:00Z", y: 133 },
              { x: "2024-09-20T00:00:00Z", y: 130 },
              { x: "2024-09-21T00:00:00Z", y: 155 },
            ],
          },
        ];
      },
    },
  },

  computed: {
    computedPopupDatumX: function () {
      let popupDataPoints = this.popupDataPoints;
      if (!popupDataPoints) {
        return null;
      }

      if (popupDataPoints.length === 0) {
        return null;
      }

      const datum = popupDataPoints[0];

      try {
        return datum.label || datum.x;
      } catch (err) {
        return "N/A";
      }
    },
    popupStyle: function () {
      let clientLeft = -1;
      let rect = null;
      if (this.$el) {
        rect = this.$el.getBoundingClientRect();

        clientLeft = rect.left;
      }
      if (rect) {
        console.log(rect.width, this.popupX);
      }
      let offsetY = 20;
      let offsetX = 40;

      // assume 200;
      let popupWidth = 120;
      let gap = 40;

      let top = this.popupY || 0;
      let left = this.popupX || 0;
      let right = "auto";

      if (left + popupWidth - gap > popupWidth) {
        left = this.popupX - popupWidth - gap;
      }

      top = top + offsetY;
      left = left + offsetX;

      top = top - 30;

      top = `${top}px`;

      left = `${left}px`;

      let style = {
        top: `${top}`,
        left: `${left}`,
      };

      return style;
    },
  },

  methods: {
    calculateDims: function () {
      let el = this.$el;
      let width = el.offsetWidth;
      let height = el.offsetHeight;

      this.width = width;
      this.height = height;
    },
    render: function () {
      let margin = { top: 20, right: 28, bottom: 28, left: 28 };
      let width = this.width - margin.left - margin.right;
      let height = this.height - margin.top - margin.bottom;
      let el = this.$refs.svg;

      // Flatten all points
      let data = this.datasets.flatMap(function (d) {
        return d.data;
      });

      // Build categorical X domain in original order
      let seen = new Set(),
        domainX = [];
      for (let i = 0; i < data.length; i++) {
        let v = data[i].x; // string ISO, treated as category
        if (!seen.has(v)) {
          seen.add(v);
          domainX.push(v);
        }
      }

      // Scales
      let x = d3.scalePoint().domain(domainX).range([0, width]);

      let yMax =
        d3.max(data, function (d) {
          return d.y == null ? 0 : d.y;
        }) || 0;
      let y = d3.scaleLinear().domain([0, yMax]).nice().range([height, 0]);

      // Line generator (no date parsing)
      let line = d3
        .line()
        .defined(function (d) {
          return d.y !== null;
        })
        .x(function (d) {
          return x(d.x);
        })
        .y(function (d) {
          return y(d.y);
        });

      // SVG
      let svg = d3
        .select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // X axis (use first/last domain labels as ticks; no formatting)
      let tickValues = domainX.length ? [domainX[0], domainX[domainX.length - 1]] : [];
      let xAxis = d3.axisBottom(x).tickValues(tickValues);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "grid-line")
        .call(xAxis);

      // X gridlines (at those ticks)
      svg
        .selectAll(".grid-line")
        .data(tickValues.slice(0, -1))
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", function (d) {
          return x(d);
        })
        .attr("x2", function (d) {
          return x(d);
        })
        .attr("y1", 0)
        .attr("y2", height);

      // Solid lines
      for (let ds = 0; ds < this.datasets.length; ds++) {
        let dataset = this.datasets[ds];
        svg
          .append("path")
          .datum(dataset.data)
          .attr("class", "line")
          .attr("d", line)
          .attr("stroke", dataset.color || "var(--theme-color)");
      }

      // Dashed bridge over single null gaps
      for (let ds2 = 0; ds2 < this.datasets.length; ds2++) {
        let dataset2 = this.datasets[ds2];
        let color = dataset2.color || "var(--theme-color)";

        let dashed = d3
          .line()
          .x(function (d) {
            return x(d.x);
          })
          .y(function (d) {
            return y(d.y);
          });

        let arr = dataset2.data;
        for (let i2 = 0; i2 < arr.length - 2; i2++) {
          let p1 = arr[i2],
            p2 = arr[i2 + 1],
            p3 = arr[i2 + 2];
          if (p1.y !== null && p2.y === null && p3.y !== null) {
            let interpolated = [
              { x: p1.x, y: p1.y },
              { x: p2.x, y: (p1.y + p3.y) / 2 },
              { x: p3.x, y: p3.y },
            ];
            svg
              .append("path")
              .datum(interpolated)
              .attr("fill", "none")
              .attr("stroke", color)
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", "5,5")
              .attr("d", dashed);
          }
        }
      }

      // Hover components
      let focus = svg.append("g").attr("class", "focus").style("display", "none");
      focus.append("circle").attr("r", 2);

      let hoverLine = svg
        .append("line")
        .attr("class", "hover-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#888")
        .style("stroke-dasharray", "4 4")
        .style("opacity", 0);

      let dateLabelGroup = svg.append("g").attr("class", "hover-date-group").style("opacity", 1);
      let dateLabelBg = dateLabelGroup
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("height", 16)
        .attr("fill", "rgba(255,255,255,0.75)");
      let dateLabelText = dateLabelGroup
        .append("text")
        .attr("y", height + 13)
        .attr("dy", "0.35em")
        .style("fill", "#000")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "500");

      // Helpers to find nearest X by pixel (scalePoint has no invert)
      let xPos = domainX.map(function (v) {
        return x(v);
      });
      function nearestIndex(px) {
        let best = 0,
          bestDist = Infinity;
        for (let i = 0; i < xPos.length; i++) {
          let d = Math.abs(xPos[i] - px);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        return best;
      }

      function handleMouseMove(event) {
        let mouseX = d3.pointer(event)[0];
        let mouseY = d3.pointer(event)[1];
        let idx = nearestIndex(mouseX);
        let vx = domainX[idx]; // categorical x value (string)
        let cx = x(vx);

        // find closest points at that x for each dataset
        let hoverPoints = [];
        for (let i = 0; i < this.datasets.length; i++) {
          let arr = this.datasets[i].data;
          let pt = null;
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].x === vx) {
              pt = arr[j];
              break;
            }
          }
          hoverPoints.push(pt || { x: vx, y: null });
        }

        // pick a valid anchor
        let valid = null;
        for (let k = 0; k < hoverPoints.length; k++) {
          if (hoverPoints[k].y !== null) {
            valid = hoverPoints[k];
            break;
          }
        }
        if (!valid) return;

        let cy = y(valid.y);

        focus.attr("transform", "translate(" + cx + "," + cy + ")").style("display", null);
        hoverLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);

        // label: show raw x value
        dateLabelText.text(vx);
        let textWidth = dateLabelText.node().getComputedTextLength();
        cy = Math.max(8, Math.min(height - 8, mouseY - 12));
        dateLabelText.attr("x", cx);
        dateLabelBg
          .attr("x", cx - textWidth / 2 - 6)
          .attr("y", height + 5)
          .attr("width", textWidth + 12);
        dateLabelGroup.style("opacity", 1);

        this.customHoverFunction(event, hoverPoints, [cx, cy]);
      }

      function handleMouseOut() {
        focus.style("display", "none");
        hoverLine.style("opacity", 0);
        dateLabelGroup.style("opacity", 0);
        this.customHoverFunction(null);
      }

      const onMove = handleMouseMove.bind(this);
      const onOut = handleMouseOut.bind(this);

      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", onMove)
        .on("mouseout", onOut)
        .on("touchstart", onMove)
        .on("touchmove", onMove)
        .on("touchend", onOut);
    },
    customHoverFunction: function (e, datapoints, coordinates) {
      if (datapoints) {
        this.popupDataPoints = datapoints;
        this.popupActive = true;
      } else {
        this.popupActive = false;
      }
      if (coordinates) {
        this.popupX = coordinates[0];
        this.popupY = coordinates[1];
      }
    },
    handleResize: function () {
      d3.select(this.$refs.svg).selectAll("*").remove(); // clear old chart
      this.calculateDims();
      this.render();
    },
    debounce: function (func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    },
  },

  mounted: function () {
    this.$nextTick(() => {
      this.calculateDims();
      this.render();

      this.debouncedResizeHandler = this.debounce(this.handleResize, 150);
      window.addEventListener("resize", this.debouncedResizeHandler);
    });
  },

  beforeUnmount: function () {
    d3.select(this.$refs.svg).selectAll("*").remove();
    window.removeEventListener("resize", this.debouncedResizeHandler);
  },
};
</script>

<style lang="scss">
.c-chart-line {
  position: relative;
  height: 100%;

  .hover-date-group {
    transition: opacity 0.2s ease-in-out;
  }

  .hover-line {
    pointer-events: none;
  }

  .hover-date {
    pointer-events: none;
  }

  .line {
    fill: none;
    //stroke: #6a67ce;
    stroke-width: 2;
  }

  .dashed {
    fill: none;
    stroke: var(--theme-color);
    stroke-width: 2;
    stroke-dasharray: 5, 5;
  }

  .focus {
    fill: var(--theme-color);
    stroke: var(--theme-color);
    stroke-width: 3;
    stroke-linecap: round;
  }

  .grid-line {
    stroke: var(--theme-bg-color);
    stroke-opacity: 0.5;
    stroke-width: 1;

    path {
      stroke: var(--theme-bg-color);
    }

    text {
      font-family: var(--font-family);
      font-weight: 600;
      fill: var(--theme-color);
      stroke: none;
    }

    line {
      display: none;
      stroke: var(--theme-bg-color);
    }
  }

  &__popup {
    pointer-events: none;
    position: absolute;
    //top: 0;
    left: 0;
    width: 120px;
    padding: 4px 8px;
    background-color: var(--color-bg-3);
    border-radius: var(--border-radius-sm);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);

    font-family: var(--font-family);
    font-weight: 450;
    font-size: 12px;

    transition:
      top 30ms linear,
      left 30ms linear;

    opacity: 0;

    &.active {
      opacity: 1;
    }
  }

  &__chart {
    display: flex;
    justify-content: center;
  }
}
</style>
