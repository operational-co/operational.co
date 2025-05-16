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
      popupY: 0
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
              { x: "2024-09-21T00:00:00Z", y: 115 }
            ]
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
              { x: "2024-09-21T00:00:00Z", y: 155 }
            ]
          }
        ];
      }
    }
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
        return moment(datum.x).format("MMM Do");
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
      let offsetY = 34;
      let offsetX = 40;

      let top = this.popupY || 0;
      let left = this.popupX || 0;
      let right = "auto";

      top = top + offsetY;
      left = left + offsetX;

      top = top - 30;

      top = `${top}px`;

      let style = {
        top: `${top}`,
        left: `${left}`,
        right: `${right}`
      };

      return style;
    }
  },

  methods: {
    calculateDims: function () {
      let el = this.$el;
      let width = el.offsetWidth;
      let height = el.offsetHeight;

      this.width = width;
      this.height = height;

      //console.log(width);
    },
    render: function () {
      let margin = { top: 20, right: 28, bottom: 28, left: 28 };
      const width = this.width - margin.left - margin.right;
      const height = this.height - margin.top - margin.bottom;
      let el = this.$refs.svg;

      // Data format: Array of objects with ISO date and y value (nullable)

      const data = this.datasets.flatMap((d) => d.data);

      // Parse date function
      const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");

      // Create scales
      // const x = d3
      //   .scaleTime()
      //   .domain(d3.extent(data, (d) => parseDate(d.x)))
      //   .range([0, width]);

      // const y = d3
      //   .scaleLinear()
      //   .domain([0, d3.max(data, (d) => d.y) || 0])
      //   .nice()
      //   .range([height, 0]);

      const xExtent = d3.extent(data, (d) => parseDate(d.x));
      const yMax = d3.max(data, (d) => d.y);

      const x = d3.scaleTime().domain(xExtent).range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([0, yMax || 0])
        .nice()
        .range([height, 0]);

      // Line generator for normal line
      const line = d3
        .line()
        .defined((d) => d.y !== null)
        .x((d) => x(parseDate(d.x)))
        .y((d) => y(d.y));

      // Create the SVG
      const svg = d3
        .select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add x-axis with tick alignment and date formatting
      const tickValues = [parseDate(data[0].x), parseDate(data[data.length - 1].x)];
      const xAxis = d3.axisBottom(x).tickValues(tickValues).tickFormat(d3.timeFormat("%b %d")); // Format ticks as date (e.g., Sep 10)

      svg.append("g").attr("transform", `translate(0,${height})`).attr("class", "grid-line").call(xAxis);

      // Add y-axis
      //svg.append("g").call(d3.axisLeft(y));

      // Add gridlines for x-axis
      svg
        .selectAll(".grid-line")
        .data(tickValues.slice(0, -1)) // Skip last tick (e.g. "Sep 21")
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", (d) => x(d))
        .attr("x2", (d) => x(d))
        .attr("y1", 0)
        .attr("y2", height);

      // Add normal line
      //svg.append("path").datum(data).attr("class", "line").attr("d", line);

      // Draw all lines
      this.datasets.forEach((dataset) => {
        const definedLine = d3
          .line()
          .defined((d) => d.y !== null)
          .x((d) => x(parseDate(d.x)))
          .y((d) => y(d.y));

        svg
          .append("path")
          .datum(dataset.data)
          .attr("class", "line")
          .attr("d", definedLine)
          .attr("stroke", dataset.color || "#6a67ce");
      });

      this.datasets.forEach((dataset) => {
        const data = dataset.data;
        const color = dataset.color || "#6a67ce";
        const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");

        const dashedLine = d3
          .line()
          .x((d) => x(parseDate(d.x)))
          .y((d) => y(d.y));

        for (let i = 0; i < data.length - 2; i++) {
          const p1 = data[i];
          const p2 = data[i + 1];
          const p3 = data[i + 2];

          // Detect a [valid, null, valid] sequence
          if (p1.y !== null && p2.y === null && p3.y !== null) {
            const interpolated = [
              { x: p1.x, y: p1.y },
              {
                x: p2.x,
                y: (p1.y + p3.y) / 2 // midpoint interpolation
              },
              { x: p3.x, y: p3.y }
            ];

            svg
              .append("path")
              .datum(interpolated)
              .attr("fill", "none")
              .attr("stroke", color)
              .attr("stroke-width", 2)
              .attr("stroke-dasharray", "5,5")
              .attr("d", dashedLine);
          }
        }
      });

      // Create focus circle for hovering effect
      const focus = svg.append("g").attr("class", "focus").style("display", "none");
      focus.append("circle").attr("r", 2);

      const hoverLine = svg
        .append("line")
        .attr("class", "hover-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#888")
        .style("stroke-dasharray", "4 4")
        .style("opacity", 0);

      const dateLabelGroup = svg.append("g").attr("class", "hover-date-group").style("opacity", 1);

      const dateLabelBg = dateLabelGroup
        .append("rect")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("height", 16)
        .attr("fill", "rgba(255,255,255,0.75)");

      const dateLabelText = dateLabelGroup
        .append("text")
        .attr("y", height + 13)
        .attr("dy", "0.35em")
        .style("fill", "#000")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "500");

      // Function to handle mouse move and call custom function
      const handleMouseMove = (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = x.invert(mouseX);

        // For each dataset, find the closest point to mouse X
        const hoverPoints = this.datasets.map((dataset) => {
          return dataset.data.reduce((a, b) =>
            Math.abs(parseDate(a.x) - xDate) < Math.abs(parseDate(b.x) - xDate) ? a : b
          );
        });

        // Pick the first valid (non-null y) point for focus circle positioning
        const validPoint = hoverPoints.find((d) => d.y !== null);
        if (!validPoint) {
          return; // don't show anything if all values are null
        }

        const parsedX = parseDate(validPoint.x);
        const cx = x(parsedX);
        const cy = y(validPoint.y);

        // Move the focus circle
        focus.attr("transform", `translate(${cx},${cy})`).style("display", null);

        // Show vertical hover line
        hoverLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);

        // Set date label text
        const labelText = d3.timeFormat("%b %d")(parsedX);
        dateLabelText.text(labelText);

        // Measure and position the pill background
        const textWidth = dateLabelText.node().getComputedTextLength();
        dateLabelText.attr("x", cx);
        dateLabelBg
          .attr("x", cx - textWidth / 2 - 6)
          .attr("y", height + 5)
          .attr("width", textWidth + 12);

        // Show label group
        dateLabelGroup.style("opacity", 1);

        // ✅ Send full array of datapoints to custom handler
        this.customHoverFunction(hoverPoints, [cx, cy]);
      };

      const handleMouseOut = () => {
        focus.style("display", "none");
        hoverLine.style("opacity", 0);
        dateLabelGroup.style("opacity", 0);
        this.customHoverFunction(null);
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const [touchX] = d3.pointers(e)[0];
        const xDate = x.invert(touchX);

        // Find closest point in each dataset
        const hoverPoints = this.datasets.map((dataset) => {
          return dataset.data.reduce((a, b) =>
            Math.abs(parseDate(a.x) - xDate) < Math.abs(parseDate(b.x) - xDate) ? a : b
          );
        });

        // Find a valid point to anchor focus
        const validPoint = hoverPoints.find((d) => d.y !== null);
        if (!validPoint) return;

        const parsedX = parseDate(validPoint.x);
        const cx = x(parsedX);
        const cy = y(validPoint.y);

        focus.attr("transform", `translate(${cx},${cy})`).style("display", null);
        hoverLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);

        const labelText = d3.timeFormat("%b %d")(parsedX);
        dateLabelText.text(labelText);

        const textWidth = dateLabelText.node().getComputedTextLength();
        dateLabelText.attr("x", cx);
        dateLabelBg
          .attr("x", cx - textWidth / 2 - 6)
          .attr("y", height + 5)
          .attr("width", textWidth + 12);

        dateLabelGroup.style("opacity", 1);
        this.customHoverFunction(hoverPoints, [cx, cy]);
      };

      const handleTouchEnd = () => {
        focus.style("display", "none");
        hoverLine.style("opacity", 0);
        dateLabelGroup.style("opacity", 0);
        this.customHoverFunction(null);
      };

      // Attach mouse event handlers to the SVG
      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", handleMouseMove)
        .on("mouseout", handleMouseOut)
        .on("touchstart", handleTouchMove)
        .on("touchmove", handleTouchMove)
        .on("touchend", handleTouchEnd);
    },
    customHoverFunction: function (datapoints, coordinates) {
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
    }
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
  }
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
    stroke: #6a67ce;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
  }

  .focus {
    fill: #6a67ce;
    stroke: #6a67ce;
    stroke-width: 3;
    stroke-linecap: round;
  }

  .grid-line {
    stroke: rgba(255, 255, 255, 0.1);
    stroke-opacity: 0.5;
    stroke-width: 1;

    path {
      stroke: rgba(255, 255, 255, 0.1); /* Example styling for axis line */
    }

    text {
      font-weight: 500;
      fill: #6a67ce; /* Example styling for tick labels */
    }

    line {
      stroke: rgba(255, 255, 255, 0.1); /* Example styling for tick marks */
    }
  }

  &__popup {
    pointer-events: none;
    position: absolute;
    //top: 0;
    left: 0;
    width: 200px;
    padding: var(--margin) var(--margin-lg);
    background-color: var(--color-bg-4);
    border-radius: var(--border-radius);

    font-size: var(--font-size-xs);

    transition:
      top 60ms linear,
      left 60ms linear;

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
