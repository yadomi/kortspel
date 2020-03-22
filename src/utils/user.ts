export const userId = () => {
  return window.localStorage.getItem("user-identifier");
};

export const userColor = () => {
  return window.localStorage.getItem("user-color");
};
