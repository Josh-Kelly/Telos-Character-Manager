document.body.onload = onLoad();

function onLoad() {
  const button = document.createElement("button");
  button.innerHTML = "Click me";
  document.body.appendChild(button);
}
