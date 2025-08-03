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
  new Producto(15, "Cookie", 3200, "fa-cookie"),
];

let carrito = [];

function agregarAlCarrito(id) {
  const producto = productoDisponibles.find((p) => p.id === id);
  if (producto) {
    const itemEnCarrito = carrito.find((item) => item.producto.id === id);
    if (itemEnCarrito) {
      itemEnCarrito.cantidad++;
    } else {
      carrito.push({ producto: producto, cantidad: 1 });
    }
    renderizarCarrito();
  }
}

function quitarDelCarrito(id) {
  const index = carrito.findIndex((item) => item.producto.id === id);
  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1);
    }
    renderizarCarrito();
  }
}

function mostrarProductos() {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productoDisponibles.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";

    div.innerHTML = `
      <div class="card h-100 text-center">
        <div class="card-body d-flex flex-column">
          <i class="fa-solid ${producto.icono} fa-3x mb-3" style="color:#dc3545;"></i>
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

  carrito.forEach(({ producto, cantidad }) => {
    const div = document.createElement("div");
    div.className = "d-flex justify-content-between align-items-center mb-2";

    div.innerHTML = `
      <span>${producto.nombre} x${cantidad} - $${
      producto.precio * cantidad
    }</span>
      <button class="btn btn-sm btn-danger" onclick="quitarDelCarrito(${
        producto.id
      })">Quitar</button>
    `;
    contenedor.appendChild(div);
  });

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

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
  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "Agregá productos antes de finalizar la compra.",
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  let factura = "";
  carrito.forEach(({ producto, cantidad }, i) => {
    factura += `${i + 1}. ${producto.nombre} x${cantidad} - $${
      producto.precio * cantidad
    }\n`;
  });
  factura += `\nTOTAL A PAGAR: $${total}`;

  Swal.fire({
    title: "Factura Final",
    html: `<pre style="text-align: left; font-size: 14px;">${factura}</pre>`,
    icon: "info",
    confirmButtonText: "Elegir método de pago",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      elegirMetodoPago(total);
    }
  });
}

function elegirMetodoPago(total) {
  Swal.fire({
    title: "Seleccioná un método de pago",
    input: "select",
    inputOptions: {
      efectivo: "Efectivo",
      credito: "Tarjeta de crédito",
      debito: "Tarjeta de débito",
      transferencia: "Transferencia bancaria",
      mercadopago: "MercadoPago",
    },
    inputPlaceholder: "Elegí una opción",
    showCancelButton: true,
    confirmButtonText: "Pagar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const metodo = result.value;

      const pagosConLector = ["credito", "debito", "mercadopago"];

      if (pagosConLector.includes(metodo)) {
        Swal.fire({
          title: "Acercá tu tarjeta al lector...",
          timer: 8000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            Swal.fire({
              title: "Pago exitoso",
              text: `Pagaste $${total} con ${metodo}. ¡Gracias por tu compra!`,
              icon: "success",
              confirmButtonText: "Aceptar",
            });
            carrito = [];
            renderizarCarrito();
          },
        });
      } else {
        Swal.fire({
          title: "Pago realizado",
          text: `Pagaste $${total} con ${metodo}. ¡Gracias por tu compra!`,
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        carrito = [];
        renderizarCarrito();
      }
    }
  });
}

mostrarProductos();
renderizarCarrito();
