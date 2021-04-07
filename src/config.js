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
  musicPlayer: {
    playlist: "https://open.spotify.com/embed/playlist/4GYLwf8CfJ7Csi0Dm2CeLU",
  },
  scenes: {
    Splash: {
      hideDelay: 0,
    },
    Setup: {
      forms: [
        {
          vh: "-90vh",
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
              text: "Fx 1 Color:",
              id: "fx1-color",
            },
            {
              element: "input",
              type: "color",
              text: "Fx 2 Color:",
              id: "fx2-color",
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
        {
          vh: "-80vh",
          inputs: [
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
              element: "textarea",
              type: "text-area",
              text: "Rules (separated by comas):",
              id: "rules",
            },
            {
              element: "textarea",
              type: "text-area",
              text: "Criteria:",
              id: "criteria",
            },
          ],
        },
      ],
    },
  },

  assets: {
    root: "/",
  },
};
