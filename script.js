const calendario = document.getElementById("calendario");
const nombreMesElemento = document.getElementById("mes-nombre");
const modal = document.getElementById("modal");

// Fecha inicial (Febrero 2026)
let fechaActual = new Date(2026, 1, 1); 

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function renderizarCalendario() {
    calendario.innerHTML = "";
    const mes = fechaActual.getMonth();
    const año = fechaActual.getFullYear();
    nombreMesElemento.textContent = `${meses[mes]} ${año}`;

    const primerDiaSemana = new Date(año, mes, 1).getDay();
    const totalDiasMes = new Date(año, mes + 1, 0).getDate();

    // Espacios para alinear el día 1 correctamente
    for (let i = 0; i < primerDiaSemana; i++) {
        const vacio = document.createElement("div");
        vacio.classList.add("dia");
        calendario.appendChild(vacio);
    }

    const datosGuardados = JSON.parse(localStorage.getItem('estresCalendario')) || {};

    for (let i = 1; i <= totalDiasMes; i++) {
        const dia = document.createElement("div");
        dia.classList.add("dia");
        dia.textContent = i;

        const fechaId = `${i}-${mes}-${año}`; // Ejemplo: "7-1-2026" para hoy

        if (datosGuardados[fechaId]) {
            dia.classList.add(`estres-${datosGuardados[fechaId]}`);
        }

        // Resaltar hoy Sábado 7 de Feb
        const hoy = new Date();
        if (i === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()) {
            dia.style.border = "2px solid #a18cd1";
        }

        dia.onclick = () => abrirModal(fechaId, dia);
        calendario.appendChild(dia);
    }
}

let idSeleccionado = "";
let elementoSeleccionado = null;

function abrirModal(id, elemento) {
    idSeleccionado = id;
    elementoSeleccionado = elemento;
    document.getElementById("fecha-label").textContent = `Día: ${id.split('-')[0]}`;
    modal.style.display = "block";
}

function cambiarMes(dir) {
    fechaActual.setMonth(fechaActual.getMonth() + dir);
    renderizarCalendario();
}

function guardarEstado() {
    const nivel = document.getElementById("nivel-estres").value;
    const datos = JSON.parse(localStorage.getItem('estresCalendario')) || {};

    elementoSeleccionado.classList.remove('estres-bajo', 'estres-medio', 'estres-alto', 'estres-critico');
    elementoSeleccionado.classList.add(`estres-${nivel}`);

    datos[idSeleccionado] = nivel;
    localStorage.setItem('estresCalendario', JSON.stringify(datos));
    cerrarModal();
}

function cerrarModal() { modal.style.display = "none"; }

renderizarCalendario();