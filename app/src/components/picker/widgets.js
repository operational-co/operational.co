const widgets = [
  {
    type: "LINE",
    title: "Line chart",
    subtitle: "Shows a line chart. Can show multiple datasets.",
    svg: `<span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 11L17.7071 9.70711C17.3166 9.31658 16.6834 9.31658 16.2929 9.70711L12.7071 13.2929C12.3166 13.6834 11.6834 13.6834 11.2929 13.2929L10.2071 12.2071C9.81658 11.8166 9.18342 11.8166 8.79289 12.2071L4 17M4 4V17M20 20H5C4.44772 20 4 19.5523 4 19V17"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`,
    schema: {
      title: "",
      metric: "",
      date: "",
      dataSelectors: [],
    },
  },
  {
    type: "STAT",
    title: "Stat widget",
    subtitle: "Shows a single metric. Great for showing simple statistics.",
    svg: `<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0039 17V14M18 5H20C20.5523 5 21 5.44772 21 6V7C21 8.65685 19.6569 10 18 10M6 5H4C3.44772 5 3 5.44772 3 6V7C3 8.65685 4.34315 10 6 10M12 14C8.68629 14 6 11.3137 6 8V4C6 3.44772 6.44772 3 7 3H17C17.5523 3 18 3.44772 18 4V8C18 11.3137 15.3137 14 12 14ZM17 20V18C17 17.4477 16.5523 17 16 17H8C7.44772 17 7 17.4477 7 18V20C7 20.5523 7.44772 21 8 21H16C16.5523 21 17 20.5523 17 20Z"
            stroke="currentColor"
            stroke-width="1"
            stroke-linejoin="round"
          />
        </svg>`,
    schema: {
      icon: "🏆",
      type: "event",
      title: "User signups",
      aggregate: "TOTAL",
      date: "7 days",
    },
  },
  {
    type: "ACTION",
    title: "Action button",
    subtitle: "Clickable button that triggers a webhook on your server.",
    svg: `<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 7C19 8.10457 15.866 9 12 9C8.13401 9 5 8.10457 5 7M19 7C19 5.89543 15.866 5 12 5C8.13401 5 5 5.89543 5 7M19 7V14C19 15.1046 15.866 16 12 16C8.13401 16 5 15.1046 5 14V7M5 14.1067C3.14864 14.6253 2 15.3479 2 16.1471C2 17.7251 6.47715 19.0043 12 19.0043C17.5228 19.0043 22 17.7251 22 16.1471C22 15.3479 20.8514 14.6253 19 14.1067"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="square"
          />
        </svg>`,

    schema: {
      url: "",
      title: "",
      description: "",
      buttonText: "Press me",
      external: false,
    },
  },
];

export default widgets;
