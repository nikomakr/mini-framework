// framework/router.js

export function createRouter({ routes, store }) {
  const getPath = () => {
    const hash = window.location.hash || "#/";
    return hash.slice(1) || "/";
  };

  const applyRoute = () => {
    const path = getPath();
    const handler = routes[path] || routes["/"];
    if (typeof handler === "function") handler(store);
  };

  window.onhashchange = applyRoute;

  if (!window.location.hash) {
    window.location.hash = "#/";
  } else {
    applyRoute();
  }
}
