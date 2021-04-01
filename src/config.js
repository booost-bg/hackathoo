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
    Intro: {
      Button: {
        text: "CONTINUE",
        fontSize: 24,
        width: 300,
        height: 50,
        curveSize: 20,
      },
    },
  },
  assets: {
    root: "/",
  },
};
