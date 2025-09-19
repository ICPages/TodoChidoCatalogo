// cursor.js
// Detectar si NO es un dispositivo móvil
if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.addEventListener("mousemove", function(e) {
    const cursor = document.getElementById("cursor");
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  });
}
