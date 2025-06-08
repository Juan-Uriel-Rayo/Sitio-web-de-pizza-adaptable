document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navClose = document.getElementById('nav-close')

    /* Menú visible */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu')
        })
    }

    /* Menú oculto */
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu')
        })
    }

    /*=============== OCULTAR MENÚ EN MÓVIL ===============*/
    const navLink = document.querySelectorAll('.nav__link')

    const linkAction = () => {
        navMenu.classList.remove('show-menu')
    }
    navLink.forEach(n => n.addEventListener('click', linkAction))


    /*=============== AGREGAR SOMBRA AL ENCABEZADO ===============*/
    const shadowHeader = () => {
        const header = document.getElementById('header')
        window.scrollY >= 50
            ? header.classList.add('shadow-header')
            : header.classList.remove('shadow-header')
    }
    window.addEventListener('scroll', shadowHeader)

    /*=============== SWIPER DE POPULARES ===============*/
    const swiperPopular = new Swiper('.popular__swiper', {
        loop: true,
        grabCursor: true,
        slidesPerView: 'auto',
        centeredSlides: 'auto',
    })

    /*=============== MOSTRAR BOTÓN DE SUBIR ===============*/
    const scrollUp = () => {
        const scrollUp = document.getElementById('scroll-up')
        window.scrollY >= 560
            ? scrollUp.classList.add('show-scroll')
            : scrollUp.classList.remove('show-scroll')
    }
    window.addEventListener('scroll', scrollUp)


    /*==================== FORMULARIO DE PEDIDO ====================*/
    const productsContainer = document.getElementById("products-container");
    const orderFormContainer = document.getElementById("order-form");
    const cerrarFormulario = document.getElementById("cerrar-formulario");
    const formPedido = document.getElementById("formulario-pedido");

    const inputNombre = document.getElementById("nombre");
    const inputTelefono = document.getElementById("telefono");
    const inputDireccion = document.getElementById("direccion");
    const listaPizzas = document.getElementById("lista-pizzas");
    const agregarPizzaBtn = document.getElementById("agregar-pizza");
    const totalPagoSpan = document.getElementById("total-pago");

    const metodoPagoSelect = document.getElementById("metodo-pago");
    const detallesPago = document.getElementById("detalles-pago");

    let preciosPizzas = {}; // Se llenará dinámicamente

    // --- ESTILO PARA SCROLL DEL FORMULARIO ---
    // Aplicar scroll al contenedor del formulario para que siempre se pueda scrollear
    orderFormContainer.style.overflowY = "auto";
    orderFormContainer.style.maxHeight = "90vh"; // máximo alto visible con scroll

    // Mostrar campos visuales según el método de pago
    metodoPagoSelect.addEventListener("change", () => {
        const metodo = metodoPagoSelect.value;
        detallesPago.innerHTML = ""; // Limpiar campos anteriores

        // Remover botón "Listo" si existe (para resetear)
        const btnListoExistente = document.getElementById("btn-listo-pago");
        if (btnListoExistente) btnListoExistente.remove();

        if (metodo === "tarjeta") {
            detallesPago.innerHTML = `
        <label for="numero-tarjeta">Número de Tarjeta:</label>
        <input type="text" id="numero-tarjeta" placeholder="**** **** **** ****" maxlength="19" required>

        <label for="fecha-expiracion">Fecha de Expiración:</label>
        <input type="month" id="fecha-expiracion" required>

        <label for="cvv">CVV:</label>
        <input type="text" id="cvv" placeholder="123" maxlength="3" required>
        `;

            // Crear botón "Listo" para cerrar detalles de pago
            crearBotonListoPago();

        } else if (metodo === "paypal") {
            detallesPago.innerHTML = `
        <label for="correo-paypal">Correo de PayPal:</label>
        <input type="email" id="correo-paypal" placeholder="ejemplo@correo.com" required>
        `;

            crearBotonListoPago();
        }
    });

    function crearBotonListoPago() {
        const btnListo = document.createElement("button");
        btnListo.type = "button";
        btnListo.id = "btn-listo-pago";
        btnListo.textContent = "Listo";
        btnListo.style.marginTop = "10px";
        btnListo.style.padding = "8px 15px";
        btnListo.style.cursor = "pointer";

        btnListo.addEventListener("click", () => {
            detallesPago.innerHTML = "";
            metodoPagoSelect.value = "";
            actualizarTotal();
            // Opcional: hacer focus en botón enviar o en el formulario
            formPedido.querySelector("button[type=submit]").focus();
        });

        detallesPago.appendChild(btnListo);
    }

    // Obtener productos del backend
    fetch("http://localhost:3001/api/productos")
        .then(response => response.json())
        .then(productos => {
            productsContainer.innerHTML = "";
            preciosPizzas = {}; // reiniciar

            productos.forEach(producto => {
                preciosPizzas[producto.nombre] = producto.precio;

                const productCard = document.createElement("article");
                productCard.classList.add("products__card");

                productCard.innerHTML = `
            <img src="${producto.imagen}" alt="image" class="products__img">
            <h3 class="products__name">${producto.nombre}</h3>
            <span class="products__price">$${producto.precio}</span>
            <button class="products__button" aria-label="Ordenar">
                <i class="ri-shopping-bag-3-fill"></i>
            </button>
        `;

                const button = productCard.querySelector(".products__button");
                button.addEventListener("click", () => {
                    orderFormContainer.style.display = "flex";
                    listaPizzas.innerHTML = "";
                    listaPizzas.appendChild(crearLineaPizza(producto.nombre));
                    actualizarTotal();
                    // Asegurar scroll al top al abrir
                    orderFormContainer.scrollTop = 0;
                });

                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
            productsContainer.innerHTML = "<p>Error al cargar los productos.</p>";
        });

    cerrarFormulario.addEventListener("click", () => {
        orderFormContainer.style.display = "none";
    });

    // Crear línea de selección de pizza
    function crearLineaPizza(pizzaPreseleccionada = "") {
        const div = document.createElement("div");
        div.classList.add("linea-pizza");
        div.style.marginBottom = "10px";

        const opciones = Object.keys(preciosPizzas)
            .map(pizza => `<option value="${pizza}" ${pizza === pizzaPreseleccionada ? "selected" : ""}>${pizza}</option>`)
            .join("");

        div.innerHTML = `
    <label>Tipo de Pizza:</label>
    <select class="pizza-select" required>${opciones}</select>

    <label>Cantidad:</label>
    <input type="number" class="pizza-cantidad" min="1" value="1" required style="width: 60px;">

    <button type="button" class="eliminar-pizza">Eliminar</button>
`;

        div.querySelector(".pizza-select").addEventListener("change", actualizarTotal);
        div.querySelector(".pizza-cantidad").addEventListener("input", actualizarTotal);
        div.querySelector(".eliminar-pizza").addEventListener("click", () => {
            div.remove();
            actualizarTotal();
        });

        return div;
    }

    function actualizarTotal() {
        let total = 0;
        document.querySelectorAll(".linea-pizza").forEach(linea => {
            const tipo = linea.querySelector(".pizza-select").value;
            const cantidad = parseInt(linea.querySelector(".pizza-cantidad").value);
            if (tipo && preciosPizzas[tipo]) {
                total += preciosPizzas[tipo] * cantidad;
            }
        });
        totalPagoSpan.textContent = total.toFixed(2);
    }

    // Botón para agregar nueva pizza
    agregarPizzaBtn.addEventListener("click", () => {
        listaPizzas.appendChild(crearLineaPizza());
        actualizarTotal();
    });

    // Enviar pedido al backend
    formPedido.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const telefono = inputTelefono.value.trim();
        const direccion = inputDireccion.value.trim();
        const metodoPago = metodoPagoSelect.value;
        const total = parseFloat(totalPagoSpan.textContent);

        if (!nombre || !telefono || !direccion || !metodoPago) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const pizzas = [];
        document.querySelectorAll(".linea-pizza").forEach(linea => {
            const tipo = linea.querySelector(".pizza-select").value;
            const cantidad = parseInt(linea.querySelector(".pizza-cantidad").value);
            if (tipo && cantidad > 0) {
                pizzas.push({ tipo, cantidad });
            }
        });

        if (pizzas.length === 0) {
            alert("Debe seleccionar al menos una pizza.");
            return;
        }

        const pedido = {
            nombre,
            telefono,
            direccion,
            metodoPago,
            total,
            pizzas
        };

        fetch("http://localhost:3001/api/ordenar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pedido),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.mensaje || "¡Pedido confirmado! Gracias por su compra.");
                formPedido.reset();
                listaPizzas.innerHTML = "";
                detallesPago.innerHTML = "";
                orderFormContainer.style.display = "none";
            })
            .catch(error => {
                console.error("Error al enviar el pedido:", error);
                alert("Ocurrió un error al procesar el pedido.");
            });
    });


    /*==================== SUSCRIPCIÓN AL BOLETÍN ====================*/
    const formSuscripcion = document.getElementById("form-suscripcion");
    const inputCorreo = document.getElementById("correo-suscripcion");
    const mensajeSuscripcion = document.getElementById("mensaje-suscripcion");

    if (formSuscripcion && inputCorreo && mensajeSuscripcion) {
        formSuscripcion.addEventListener("submit", function (e) {
            e.preventDefault();

            const correo = inputCorreo.value.trim();
            if (!correo) {
                mensajeSuscripcion.textContent = "Por favor, introduce un correo válido.";
                mensajeSuscripcion.style.color = "red";
                return;
            }

            fetch("http://localhost:3001/api/suscripcion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ correo }),
            })
                .then(response => response.json())
                .then(data => {
                    mensajeSuscripcion.textContent = data.mensaje || "¡Gracias por suscribirte!";
                    mensajeSuscripcion.style.color = "#28a745";
                    formSuscripcion.reset();
                })
                .catch(error => {
                    console.error("Error al enviar el correo:", error);
                    mensajeSuscripcion.textContent = "Ocurrió un error. Inténtalo de nuevo.";
                    mensajeSuscripcion.style.color = "red";
                });

            setTimeout(() => {
                mensajeSuscripcion.textContent = "";
            }, 4000);
        });
    }
});
