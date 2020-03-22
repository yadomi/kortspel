function* color() {
  let i = 0;
  const colors = ["#ff9ff3", "#feca57", "#ff6b6b", "#48dbfb", "#1dd1a1"];
  while (true) {
    yield colors[i % colors.length];
    i++;
  }
}

module.exports = color;
