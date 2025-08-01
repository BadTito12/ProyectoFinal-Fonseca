
// Clase Producto
class Producto {
  constructor(id, nombre, precio) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
  }
}

const productoDisponibles = [
  new Producto(1, "Pizza", 2500),
  new Producto(2, "Hamburguesa", 1800),
  new Producto(3, "Empanada", 1000),
  new Producto(4, "Milanesa con fritas", 3560),
  new Producto(5, "Rabas", 9000),
  new Producto(6, "Bondiola al plato", 8730),
  new Producto(7, "Pollo con fritas", 10000),
  new Producto(8, "Bebida", 1500),
  new Producto(9, "Espresso", 1800),
  new Producto(10, "Capuchino", 2600),
  new Producto(11, "Latte", 2000),
  new Producto(12, "Adicional Leche vegetal", 900),
  new Producto(13, "Postre", 2700),
  new Producto(14, "Helado", 1750),
  new Producto(15, "Cookie", 3200),
];

let carrito = [];

function agregarAlCarrito(id) {
  const producto = productoDisponibles.find((p) => p.id === id);
  if (producto) {
    carrito.push(producto);
    renderizarCarrito();
  }
}

function quitarDelCarrito(id) {
  const index = carrito.findIndex((p) => p.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
    renderizarCarrito();
  }
}

function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = ""; // limpiar antes

  productoDisponibles.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4"; // para que sea una grilla de 3 cols

    div.innerHTML = `
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">$${producto.precio}</p>
          <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "<h3>Carrito</h3>";

  if (carrito.length === 0) {
    contenedor.innerHTML += "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "d-flex justify-content-between align-items-center mb-2";

    div.innerHTML = `
      <span>${producto.nombre} - $${producto.precio}</span>
      <button class="btn btn-sm btn-danger" onclick="quitarDelCarrito(${producto.id})">Quitar</button>
    `;
    contenedor.appendChild(div);
  });

  const total = carrito.reduce((sum, p) => sum + p.precio, 0);

  const totalDiv = document.createElement("div");
  totalDiv.className = "mt-3";

  totalDiv.innerHTML = `<hr><p><strong>Total: $${total}</strong></p>`;

  const finalizarBtn = document.createElement("button");
  finalizarBtn.className = "btn btn-success";
  finalizarBtn.textContent = "Finalizar compra";
  finalizarBtn.onclick = () => finalizarCompra(total);

  contenedor.appendChild(totalDiv);
  contenedor.appendChild(finalizarBtn);
}

function finalizarCompra(total) {
  Swal.fire({
    title: "¿Confirmar compra?",
    text: `El total a pagar es $${total}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "¡Gracias por su compra!",
        text: "Su pedido ha sido procesado con éxito.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      carrito = []; // Vacía el carrito
      renderizarCarrito(); // Refresca vista
    }
  });
}

// Al cargar la página, mostrar productos y carrito vacío
mostrarProductos();
renderizarCarrito();
