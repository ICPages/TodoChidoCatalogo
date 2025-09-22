document.addEventListener("mousemove", function(e) {
  const cursor = document.getElementById("cursor");
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
});