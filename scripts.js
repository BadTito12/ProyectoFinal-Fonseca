// Clase Producto
class Producto {
  constructor(id, nombre, precio, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.icono = icono;
  }
}

// Lista de productos disponibles
const productoDisponibles = [
  new Producto(1, "Pizza", 2500, "fa-pizza-slice"),
  new Producto(2, "Hamburguesa", 1800, "fa-burger"),
  new Producto(3, "Empanada", 1000, "fa-utensils"),
  new Producto(4, "Milanesa con fritas", 3560, "fa-drumstick-bite"),
  new Producto(5, "Rabas", 9000, "fa-fish"),
  new Producto(6, "Bondiola al plato", 8730, "fa-bacon"),
  new Producto(7, "Pollo con fritas", 10000, "fa-drumstick-bite"),
  new Producto(8, "Bebida", 1500, "fa-wine-glass"),
  new Producto(9, "Espresso", 1800, "fa-mug-hot"),
  new Producto(10, "Capuchino", 2600, "fa-mug-saucer"),
  new Producto(11, "Latte", 2000, "fa-coffee"),
  new Producto(12, "Leche vegetal", 900, "fa-seedling"),
  new Producto(13, "Postre", 2700, "fa-ice-cream"),
  new Producto(14, "Helado", 1750, "fa-ice-cream"),
  new Producto(15, "Cookie", 3200, "fa-cookie")
];

let carrito = [];

// Agrega producto al carrito
function agregarAlCarrito(id) {
  const producto = productoDisponibles.find(p => p.id === id);
  if (producto) {
    carrito.push(producto);
    renderizarCarrito();
  }
}

// Quita producto del carrito
function quitarDelCarrito(id) {
  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    carrito.splice(index, 1);
    renderizarCarrito();
  }
}

// Muestra todos los productos
function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productoDisponibles.forEach(producto => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";

    div.innerHTML = `
      <div class="card h-100 text-center">
        <div class="card-body d-flex flex-column justify-content-between">
          <i class="fas ${producto.icono}"></i>
          <h5 class="card-title mt-2">${producto.nombre}</h5>
          <p class="card-text">$${producto.precio}</p>
          <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

// Renderiza el carrito
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "<h3>Carrito</h3>";

  if (carrito.length === 0) {
    contenedor.innerHTML += "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach(producto => {
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

// Finaliza la compra
function finalizarCompra(total) {
  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "Agregá productos antes de finalizar la compra.",
      icon: "warning",
      confirmButtonText: "Aceptar"
    });
    return;
  }

  let factura = '';
  carrito.forEach((item, i) => {
    factura += `${i + 1}. ${item.nombre} - $${item.precio}\n`;
  });
  factura += `\nTOTAL A PAGAR: $${total}`;

  Swal.fire({
    title: "Factura Final",
    html: `<pre style="text-align: left; font-size: 14px;">${factura}</pre>`,
    icon: "info",
    confirmButtonText: "Elegir método de pago",
    showCancelButton: true,
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      elegirMetodoPago(total);
    }
  });
}

// Elige método de pago
function elegirMetodoPago(total) {
  Swal.fire({
    title: "Seleccioná un método de pago",
    input: "select",
    inputOptions: {
      efectivo: "Efectivo",
      credito: "Tarjeta de crédito",
      debito: "Tarjeta de débito",
      transferencia: "Transferencia bancaria",
      mercadopago: "MercadoPago"
    },
    inputPlaceholder: "Elegí una opción",
    showCancelButton: true,
    confirmButtonText: "Pagar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      const metodo = result.value;
      Swal.fire({
        title: "Pago realizado",
        text: `Pagaste $${total} con ${metodo}. ¡Gracias por tu compra!`,
        icon: "success"
      });
      carrito = [];
      renderizarCarrito();
    }
  });
}

// Inicializa al cargar
mostrarProductos();
renderizarCarrito();
