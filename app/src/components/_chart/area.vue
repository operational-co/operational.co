<template>
  <div class="c-chart-area">
    <svg ref="svg"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data: function () {
    return {
      s: null,
      data: [
        { date: "24-Apr-07", amount: 93.24 },
        { date: "25-Apr-07", amount: 95.35 },
        { date: "26-Apr-07", amount: 98.84 },
        { date: "27-Apr-07", amount: 99.92 },
        { date: "30-Apr-07", amount: 99.8 },
        { date: "1-May-07", amount: 99.47 },
        { date: "2-May-07", amount: 100.39 },
        { date: "3-May-07", amount: 100.4 },
        { date: "4-May-07", amount: 100.81 },
        { date: "7-May-07", amount: 103.92 },
        { date: "8-May-07", amount: 105.06 },
        { date: "9-May-07", amount: 106.88 },
        { date: "10-May-07", amount: 107.34 },
      ],
    };
  },

  methods: {
    createGradient: function (select) {
      const gradient = select
        .select("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:#BBF6CA;stop-opacity:0.05");

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:#BBF6CA;stop-opacity:.5");
    },
    createGlowFilter: function (select) {
      const filter = select.select("defs").append("filter").attr("id", "glow");

      filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");

      const femerge = filter.append("feMerge");

      femerge.append("feMergeNode").attr("in", "coloredBlur");
      femerge.append("feMergeNode").attr("in", "SourceGraphic");
    },
    render: function () {
      const width = 708;
      const height = 256;
      let el = this.$refs.svg;
      const svg = d3.select(el).attr("width", width).attr("height", height);

      const defs = svg.append("defs");
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height / 2)
        .attr("y2", height / 2);

      linearGradient.append("stop").attr("stop-color", "#0cbde7").attr("offset", 0);

      linearGradient.append("stop").attr("stop-color", "#58d943").attr("offset", 1);

      const g = svg.append("g");

      const data = this.data;

      //2. Parse the dates
      const parseTime = d3.timeParse("%d-%b-%y");

      //3. Creating the Chart Axes
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(data, function (d) {
            return parseTime(d.date);
          }),
        )
        .rangeRound([0, width]);

      const y = d3
        .scaleLinear()
        .domain(
          d3.extent(data, function (d) {
            return d.amount;
          }),
        )
        .rangeRound([height, 0]);

      //4. Creating a Line
      const line = d3
        .line()
        .x(function (d) {
          return x(parseTime(d.date));
        })
        .y(function (d) {
          return y(d.amount);
        });

      //5. Appending the Axes to the Chart
      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

      //6. Appending a path to the Chart
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line);
    },

    render2: function () {
      const width = 708;
      const height = 256;
      let el = this.$refs.svg;
      // Data format: Array of objects with ISO date and y value (nullable)
      const data = [
        { x: "2024-09-10T00:00:00Z", y: 95000 },
        { x: "2024-09-11T00:00:00Z", y: 120000 },
        { x: "2024-09-12T00:00:00Z", y: 105000 },
        { x: "2024-09-13T00:00:00Z", y: null }, // Dashed line
        { x: "2024-09-14T00:00:00Z", y: 140000 },
        { x: "2024-09-15T00:00:00Z", y: 104812 },
        { x: "2024-09-16T00:00:00Z", y: 100000 },
        { x: "2024-10-08T00:00:00Z", y: null }, // Dashed line
      ];

      // Dimensions
      const margin = { top: 20, right: 30, bottom: 30, left: 50 };
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

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

      // Line generator for dashed line
      const dashedLine = d3
        .line()
        .defined((d) => d.y === null)
        .x((d) => x(parseDate(d.x)))
        .y((d) => y(d.y || 0));

      // Create the SVG
      const svg = d3
        .select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add x-axis
      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(6));

      // Add y-axis
      svg.append("g").call(d3.axisLeft(y));

      // Add normal line
      svg.append("path").datum(data).attr("class", "line").attr("d", line);

      // Add dashed line
      svg.append("path").datum(data).attr("class", "dashed").attr("d", dashedLine);

      // Create focus circle for hovering effect
      const focus = svg.append("g").attr("class", "focus").style("display", "none");

      focus.append("circle").attr("r", 5);

      // Function to handle mouse move and call custom function
      const handleMouseMove = (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = x.invert(mouseX);
        const closest = data.reduce((a, b) =>
          Math.abs(parseDate(a.x) - xDate) < Math.abs(parseDate(b.x) - xDate) ? a : b,
        );

        if (closest.y !== null) {
          focus.attr("transform", `translate(${x(parseDate(closest.x))},${y(closest.y)})`);
          focus.style("display", null);
          customHoverFunction(closest, [x(parseDate(closest.x)), y(closest.y)]);
        }
      };

      const handleMouseOut = () => {
        focus.style("display", "none");
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
        .on("mouseout", handleMouseOut);
    },
    customHoverFunction(datapoint, coordinates) {
      if (datapoint && coordinates) {
        console.log("Hovered over point:", datapoint, "at coordinates:", coordinates);
        // You can handle the popup UI logic here.
      } else {
        console.log("Mouse left chart area.");
        // Handle case when mouse leaves the chart area.
      }
    },
  },

  mounted: function () {
    this.render2();
  },
};
</script>

<style lang="scss">
.c-chart-area {
  height: 100%;
}
</style>
