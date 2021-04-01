export default {
  view: {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    worldWidth: 1000,
    worldHeight: 500,
    resizeTo: window,
    centerOnResize: true,
    antialias: true, // makes graphics smoother
  },
  game: {
    width: 1000,
    height: 500,
    drag: false,
    pinch: true,
    decelerate: true,
    wheel: false,
  },
  scenes: {
    Splash: {
      hideDelay: 0,
    },
    Setup: {
      Button: {
        text: "CONTINUE",
        fontSize: 24,
        width: 367,
        height: 53,
        curveSize: 20,
      },
      inputs: [
        {
          element: "input",
          type: "text",
          text: "Hackaton Name",
        },
        {
          element: "input",
          type: "color",
          text: "Main Color",
        },
        {
          element: "input",
          type: "color",
          text: "Accent Color",
        },
        {
          element: "textarea",
          type: "text-area",
          text: "Teams (separated by comas)",
        },
        {
          element: "textarea",
          type: "text-area",
          text: "Topics (separated by comas)",
        },
        {
          element: "input",
          type: "datetime-local",
          text: "Start time",
        },
        {
          element: "input",
          type: "datetime-local",
          text: "End time",
        },
      ],
    },
  },

  assets: {
    root: "/",
  },
};
