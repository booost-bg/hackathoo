export default {
  view: {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    worldWidth: 1000,
    worldHeight: 500,
    resizeTo: window,
    centerOnResize: true,
    antialias: true,
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
      inputs: [
        {
          element: "input",
          type: "text",
          text: "Hackathon Name:",
          id: "hackathon-name",
        },
        {
          element: "input",
          type: "color",
          text: "Main Color:",
          id: "main-color",
        },
        {
          element: "input",
          type: "color",
          text: "Accent Color:",
          id: "accent-color",
        },
        {
          element: "input",
          type: "color",
          text: "Fx Color:",
          id: "fx-color",
        },
        {
          element: "textarea",
          type: "text-area",
          text: "Teams (separated by comas):",
          id: "teams",
        },
        {
          element: "textarea",
          type: "text-area",
          text: "Topics (separated by comas):",
          id: "topics",
        },
        {
          element: "input",
          type: "datetime-local",
          text: "Start time:",
          id: "start-time",
        },
        {
          element: "input",
          type: "datetime-local",
          text: "End time:",
          id: "end-time",
        },
      ],
    },
    Winners: {
      startDelay: 1,
      betweenTeamsDelay: 5,
      shockwaveDuration: 3,
    },
  },

  assets: {
    root: "/",
  },
};
