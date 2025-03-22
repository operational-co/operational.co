<template>
  <div class="c-chart-area">
    <div class="c-chart-area__popup" :style="popupStyle" v-if="popupActive">
      <span>x: {{ popupDatum.x }}</span>
      <span>y: {{ popupDatum.y }}</span>
    </div>
    <div class="c-chart-area__chart" ref="svg"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data: function () {
    return {
      width: 100,
      height: 100,
      popupActive: false,
      popupDatum: null,
      popupX: 0,
      popupY: 0
    };
  },

  computed: {
    popupStyle: function () {
      let top = this.popupY || 0;
      let left = this.popupX || 0;

      top = top - 30;

      return {
        top: `${top}px`,
        left: `${left}px`
      };
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
    render2: function () {
      let margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = this.width - margin.left - margin.right;
      const height = this.height - margin.top - margin.bottom;
      let el = this.$refs.svg;

      // Data format: Array of objects with ISO date and y value (nullable)
      const data = [
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
      ];

      // Parse date function
      const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");

      // Create scales
      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => parseDate(d.x)))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.y) || 0])
        .nice()
        .range([height, 0]);

      // Line generator for normal line
      const line = d3
        .line()
        .defined((d) => d.y !== null)
        .x((d) => x(parseDate(d.x)))
        .y((d) => y(d.y));

      // Line generator for dashed line segments
      const dashedLine = d3
        .line()
        // Define how to calculate the x-coordinate for each point
        .x((d) => {
          // Parse the ISO date and map it to the x-scale
          const xCoordinate = x(parseDate(d.x));
          return xCoordinate;
        })

        // Define how to calculate the y-coordinate for each point
        .y((d, i, z) => {
          //console.log(i, z);
          //console.log(d);
          // If the y-value is null, set a default value (e.g., 1)
          let yCoordinate = d.y; //d.y !== null ? y(d.y) : y(1);
          //console.log(yCoordinate);
          if (d.y === null) {
            let prevVal = 0;
            let nextVal = 0;
            for (let j = 0; j < z.length; j++) {
              let datum = z[j];
              if (j === i - 2) {
                prevVal = datum.y || 0;
              }
              if (j === i) {
                nextVal = datum.y || 0;
              }
            }

            let avgVal = prevVal + nextVal / 2;

            yCoordinate = avgVal;

            yCoordinate = y(yCoordinate);
          } else {
            yCoordinate = y(d.y);
          }
          return yCoordinate;
        });

      // Create the SVG
      const svg = d3
        .select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add x-axis
      //const xAxis = d3.axisBottom(x).ticks(data.length);
      //svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

      // Add x-axis with tick alignment and date formatting
      const tickValues = data.map((d) => parseDate(d.x)); // Align ticks with data points
      const xAxis = d3.axisBottom(x).tickValues(tickValues).tickFormat(d3.timeFormat("%b %d")); // Format ticks as date (e.g., Sep 10)

      svg.append("g").attr("transform", `translate(0,${height})`).attr("class", "grid-line").call(xAxis);

      // Add y-axis
      //svg.append("g").call(d3.axisLeft(y));

      // Add gridlines for x-axis
      svg
        .selectAll(".grid-line")
        .data(tickValues)
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", (d) => x(d))
        .attr("x2", (d) => x(d))
        .attr("y1", 0)
        .attr("y2", height);

      // Add normal line
      svg.append("path").datum(data).attr("class", "line").attr("d", line);

      // Add dashed line where y is null
      let dashData = [];
      for (let i = 0; i < data.length - 1; i++) {
        dashData.push(data[i], data[i + 1]);
      }

      svg.append("path").datum(dashData).attr("class", "dashed").attr("d", dashedLine);

      // Create focus circle for hovering effect
      const focus = svg.append("g").attr("class", "focus").style("display", "none");

      focus.append("circle").attr("r", 5);

      // Function to handle mouse move and call custom function
      const handleMouseMove = (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = x.invert(mouseX);
        const closest = data.reduce((a, b) =>
          Math.abs(parseDate(a.x) - xDate) < Math.abs(parseDate(b.x) - xDate) ? a : b
        );

        if (closest.y !== null) {
          focus.attr("transform", `translate(${x(parseDate(closest.x))},${y(closest.y)})`);
          focus.style("display", null);
          this.customHoverFunction(closest, [x(parseDate(closest.x)), y(closest.y)]);
        }
      };

      const handleMouseOut = () => {
        focus.style("display", "none");
        this.customHoverFunction(null);
      };

      const handleTouchMove = (e) => {
        // Prevent the default behavior like scrolling on touch
        e.preventDefault();

        // Get touch position (similar to getting mouse pointer position)
        const [touchX] = d3.pointers(e)[0]; // d3.pointers handles touch events

        const xDate = x.invert(touchX);
        const closest = data.reduce((a, b) =>
          Math.abs(parseDate(a.x) - xDate) < Math.abs(parseDate(b.x) - xDate) ? a : b
        );

        if (closest.y !== null) {
          focus.attr("transform", `translate(${x(parseDate(closest.x))},${y(closest.y)})`);
          focus.style("display", null);
          this.customHoverFunction(closest, [x(parseDate(closest.x)), y(closest.y)]);
        }
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
        .on("touchstart", handleTouchMove) // Similar to handleMouseMove
        .on("touchmove", handleTouchMove) // Similar to dragging the finger
        .on("touchend", handleMouseOut); // Similar to lifting the finger
    },
    customHoverFunction: function (datapoint, coordinates) {
      if (datapoint) {
        this.popupDatum = datapoint;
        this.popupActive = true;
      } else {
        this.popupActive = false;
      }
      if (coordinates) {
        this.popupX = coordinates[0];
        this.popupY = coordinates[1];
      }
    }
  },

  mounted: function () {
    this.$nextTick(() => {
      this.calculateDims();
      this.render2();
    });
  },

  beforeUnmount: function () {
    d3.select(this.$refs.svg).selectAll("*").remove();
  }
};
</script>

<style lang="scss">
.c-chart-area {
  position: relative;
  height: 100%;

  .line {
    fill: none;
    stroke: #6a67ce;
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
    padding: var(--margin) var(--margin-lg);
    background-color: var(--color-bg-4);
    border-radius: var(--border-radius);

    font-size: var(--font-size-sm);
  }

  &__chart {
    display: flex;
    justify-content: center;
  }
}
</style>
