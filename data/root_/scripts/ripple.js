function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("div");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const but_location = button.getBoundingClientRect();
  const relativeX = event.clientX - but_location.left;
  const relativeY = event.clientY - but_location.top;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${relativeX - radius}px`;
  circle.style.top = `${relativeY - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

const buttons = document.getElementsByClassName("ripple_but");
for (const button of buttons) {
  button.addEventListener("mousedown", createRipple);
}
