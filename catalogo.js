// ==================== CARRITO ====================
let cart = [];
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Progress bar envío
const envioSelect = document.getElementById("envioSelect");
const envioProgress = document.getElementById("shippingProgressFill");
const envioMsg = document.getElementById("shippingMessage");

let envioMinimo = 999; // default

// Selección de tipo de envío
envioSelect.addEventListener("change", () => {
  envioMinimo = envioSelect.value === "puebla" ? 599 : 999;
  actualizarEnvioGratis();
});

// Agregar al carrito
document.querySelectorAll('.addCart').forEach(btn => {
  btn.addEventListener('click', () => {
    const nombre = btn.dataset.nombre;
    const precio = parseFloat(btn.dataset.precio);
    const uniprenda = btn.dataset.uniprenda === "true";
    const unitalla = btn.dataset.unitalla === "true";
    const imagen = btn.dataset.imagen; 

    // Obtener prenda
    let prenda = uniprenda ? "Uniprenda" : btn.parentElement.querySelector('.prendaSelect').value;
    if (!prenda) {
      alert("Selecciona una prenda para tu diseño.");
      return;
    }
    // Obtener talla
    let talla = unitalla ? "Unitalla" : btn.parentElement.querySelector('.tallaSelect').value;
    if (!talla) {
      alert("Selecciona una talla para tu prenda.");
      return;
    }

    cart.push({ nombre, precio, prenda, talla, imagen });
    renderCart();
  });
});

// Renderizar carrito
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.precio;

    const li = document.createElement('li');
    li.className = 'list-group-item cart-item';

    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.imagen}" alt="${item.nombre}">
        <span>${item.prenda} - ${item.nombre} (${item.talla}) - $${item.precio}</span>
      </div>
      <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button>
    `;

    cartItems.appendChild(li);
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = total.toFixed(2);

  actualizarEnvioGratis();
}

// Actualizar barra de progreso y mensaje de envío gratis
function actualizarEnvioGratis() {
  const total = parseFloat(cartTotal.textContent) || 0;

  if (!envioSelect.value) {
    envioProgress.style.width = "0%";
    envioMsg.textContent = "Selecciona tu tipo de envío";
    return;
  }

  if (total >= envioMinimo) {
    envioProgress.style.width = "100%";
    envioMsg.textContent = "🎉 ¡Felicidades! Has obtenido envío gratis.";
  } else {
    const faltante = envioMinimo - total;
    const porcentaje = Math.min((total / envioMinimo) * 100, 100);
    envioProgress.style.width = porcentaje + "%";
    envioMsg.textContent = `¡Te faltan $${faltante.toFixed(2)} para obtener envío gratis!`;
  }
}

// Eliminar un artículo
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// Vaciar carrito
document.getElementById('clearCartBtn').addEventListener('click', () => {
  if (confirm("¿Seguro que quieres vaciar el carrito?")) {
    cart = [];
    renderCart();
  }
});

// Checkout - enviar a WhatsApp
document.getElementById('checkoutBtn').addEventListener('click', () => {
  const nombre = document.getElementById('nombreComprador').value;
  const correo = document.getElementById('correoComprador').value;
  const metodoPago = document.getElementById('metodoPago').value;

  if (!nombre || !correo || !metodoPago) {
    alert("Por favor, completa todos los datos.");
    return;
  }
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = `Hola, soy ${nombre} (${correo}).\nMétodo de pago: ${metodoPago}\nQuiero comprar:\n`;
  cart.forEach(item => {
    mensaje += `${item.prenda} - ${item.nombre} (${item.talla}): $${item.precio}\n`;
  });
  mensaje += `\nTotal: $${cart.reduce((acc, it) => acc + it.precio, 0).toFixed(2)}`;

  const url = `https://wa.me/522221106016?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});

// ==================== VARIABLES DE CATÁLOGO ====================
const productos = Array.from(document.querySelectorAll('.producto'));
const productosContainer = document.getElementById('productos');

let currentPage = 1;
const itemsPerPage = 15;
let sortedAndFiltered = []; 

// ==================== FILTROS ====================
const searchBar = document.getElementById('searchBar');
const filterPrenda = document.getElementById('filterPrenda');
const filterGenero = document.getElementById('filterGenero');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetFiltersBtn');

// Botón reiniciar filtros
resetBtn.addEventListener("click", () => {
  searchBar.value = "";
  filterPrenda.value = "";
  filterGenero.value = "";
  sortSelect.value = "abc";
  filtrar();
});

// ==================== FILTRAR ====================
function filtrar() {
  const search = searchBar.value.toLowerCase();
  const prenda = filterPrenda.value;
  const genero = filterGenero.value;

  sortedAndFiltered = productos.filter(prod => {
    const nombre = prod.querySelector('.card-title').textContent.toLowerCase();
    const p = prod.dataset.prenda;
    const g = prod.dataset.genero;

    let visible = true;
    if (search && !nombre.includes(search)) visible = false;
    if (prenda && p !== prenda) visible = false;
    if (genero && g !== genero) visible = false;

    return visible;
  });

  ordenar(); 
}

// ==================== ORDENAR ====================
function ordenar() {
  const sortValue = sortSelect.value;

  sortedAndFiltered.sort((a, b) => {
    const nameA = a.querySelector('.card-title').textContent.toLowerCase();
    const nameB = b.querySelector('.card-title').textContent.toLowerCase();
    const priceA = parseFloat(a.dataset.precio);
    const priceB = parseFloat(b.dataset.precio);

    if (sortValue === "precioAsc") {
      return priceA - priceB;
    } else if (sortValue === "precioDesc") {
      return priceB - priceA;
    } else { 
      return nameA.localeCompare(nameB);
    }
  });

  currentPage = 1; 
  renderProductos();
}

// ==================== PAGINACIÓN ====================
function renderProductos() {
  productosContainer.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productosPagina = sortedAndFiltered.slice(start, end);

  productosPagina.forEach(p => {
    productosContainer.appendChild(p);
    p.style.display = "block"; 
  });

  renderPagination();

  // 👇 inicializar selects en cada render
  inicializarSelects();
}

function renderPagination() {
  let pagContainer = document.getElementById("pagination");
  if (!pagContainer) {
    pagContainer = document.createElement("div");
    pagContainer.id = "pagination";
    pagContainer.className = "d-flex justify-content-center mt-4";
    productosContainer.after(pagContainer);
  }

  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
  pagContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `btn btn-sm mx-1 ${i === currentPage ? "btn-dark" : "btn-outline-dark"}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProductos();

      // 👇 Scroll al inicio del catálogo
      document.getElementById("catalogo").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
    pagContainer.appendChild(btn);
  }
}

// ==================== PRENDA/TALLA SELECT ====================
function inicializarSelects() {
  document.querySelectorAll(".prendaSelect").forEach(select => {
    select.onchange = function() {
      const opcion = this.options[this.selectedIndex];
      const card = this.closest(".producto");
      const img = card.querySelector(".producto-img");
      const precio = card.querySelector(".precio");
      const boton = card.querySelector(".addCart");

      img.src = opcion.getAttribute("data-imagen");
      precio.textContent = "$" + opcion.getAttribute("data-precio");

      boton.setAttribute("data-precio", opcion.getAttribute("data-precio"));
      boton.setAttribute("data-imagen", opcion.getAttribute("data-imagen"));
      card.dataset.precio = opcion.getAttribute("data-precio");
    };
  });

  document.querySelectorAll(".tallaSelect").forEach(select => {
    select.onchange = function() {
      const card = this.closest(".producto");
      const boton = card.querySelector(".addCart");
      boton.dataset.unitalla = this.value;
    };
  });
}

// ==================== EVENTOS ====================
[searchBar, filterPrenda, filterGenero].forEach(el => {
  el.addEventListener('input', filtrar);
  el.addEventListener('change', filtrar);
});
sortSelect.addEventListener("change", ordenar);

// ==================== INICIAL ====================
filtrar(); 
inicializarSelects(); 
actualizarEnvioGratis(); // 👈 inicializar barra en vacío

// ==================== BOTÓN SUBIR ====================
const btnSubir = document.getElementById("subir");
window.addEventListener("scroll", function () {
  btnSubir.style.display = window.scrollY > 200 ? "flex" : "none";
});
btnSubir.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
