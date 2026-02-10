// ============================================
// LÓGICA DEL CALENDARIO Y ESTADÍSTICAS
// ============================================

const calendario = document.getElementById("calendario");
const nombreMesElemento = document.getElementById("mes-nombre");
const modal = document.getElementById("modal");

let fechaActual = new Date();
let idSeleccionado = null;
let elementoSeleccionado = null;

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function renderizarCalendario() {
    calendario.innerHTML = "";
    
    const mes = fechaActual.getMonth();
    const año = fechaActual.getFullYear();
    nombreMesElemento.textContent = `${meses[mes]} ${año}`;

    const primerDia = new Date(año, mes, 1).getDay();
    const totalDias = new Date(año, mes + 1, 0).getDate();

    // Días vacíos previos al día 1
    for (let i = 0; i < primerDia; i++) {
        const vacio = document.createElement("div");
        vacio.style.visibility = "hidden";
        calendario.appendChild(vacio);
    }

    // Cargar datos guardados
    const datos = JSON.parse(localStorage.getItem("estresCalendario")) || {};

    // Dibujar los días
    for (let diaNum = 1; diaNum <= totalDias; diaNum++) {
        const dia = document.createElement("div");
        dia.classList.add("dia");

        const idFecha = `${diaNum}-${mes}-${año}`;

        dia.innerHTML = `
            <span>${diaNum}</span>
            <span class="emoji-dia"></span>
        `;

        // Si ya hay un estado guardado para este día
        if (datos[idFecha]) {
            dia.classList.add(`estres-${datos[idFecha].nivel}`);
            dia.querySelector(".emoji-dia").textContent = datos[idFecha].emoji;
        }

        // Evento Click para abrir modal
        dia.addEventListener("click", () => {
            idSeleccionado = idFecha;
            elementoSeleccionado = dia;
            document.getElementById("fecha-label").textContent = `${diaNum} de ${meses[mes]}`;
            modal.style.display = "flex";
        });

        calendario.appendChild(dia);
    }
}

// Función para guardar el estado de ánimo seleccionado
function guardarEstado() {
    if (!idSeleccionado || !elementoSeleccionado) return;

    const nivel = document.getElementById("nivel-estres").value;

    const emojis = {
        bajo: "😊",
        medio: "😐",
        alto: "😟",
        critico: "😫"
    };

    const emoji = emojis[nivel];

    // Guardar en localStorage
    const datos = JSON.parse(localStorage.getItem("estresCalendario")) || {};
    datos[idSeleccionado] = { nivel, emoji };
    localStorage.setItem("estresCalendario", JSON.stringify(datos));

    // Actualizar visualmente el día
    elementoSeleccionado.className = "dia"; // Resetear clases
    elementoSeleccionado.classList.add(`estres-${nivel}`);
    elementoSeleccionado.querySelector(".emoji-dia").textContent = emoji;

    actualizarEstadisticas();
    cerrarModal();
}

// Función para contar cuántos días de cada tipo hay
function actualizarEstadisticas() {
    const datos = JSON.parse(localStorage.getItem('estresCalendario')) || {};
    let conteo = { bajo: 0, medio: 0, alto: 0, critico: 0 };

    Object.values(datos).forEach(item => {
        if (conteo[item.nivel] !== undefined) {
            conteo[item.nivel]++;
        }
    });

    // Actualizar el DOM
    document.getElementById("count-bajo").textContent = conteo.bajo;
    document.getElementById("count-medio").textContent = conteo.medio;
    document.getElementById("count-alto").textContent = conteo.alto;
    document.getElementById("count-critico").textContent = conteo.critico;
}

function cambiarMes(dir) {
    fechaActual.setMonth(fechaActual.getMonth() + dir);
    renderizarCalendario();
}

function cerrarModal() {
    modal.style.display = "none";
    idSeleccionado = null;
    elementoSeleccionado = null;
}

// ============================================
// LÓGICA DEL DIARIO PERSONAL
// ============================================

function guardarNota() {
    const areaTexto = document.getElementById('nota-texto');
    const contenido = areaTexto.value.trim();

    if (contenido === "") return alert("¡Escribe algo antes de guardar!");

    const nota = {
        id: Date.now(),
        texto: contenido,
        fecha: new Date().toLocaleString('es-MX', { 
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
        })
    };

    let notas = JSON.parse(localStorage.getItem('misNotas')) || [];
    notas.unshift(nota);
    localStorage.setItem('misNotas', JSON.stringify(notas));

    areaTexto.value = ""; 
    renderizarNotas();
}

function renderizarNotas() {
    const contenedor = document.getElementById('contenedor-notas');
    const notas = JSON.parse(localStorage.getItem('misNotas')) || [];

    contenedor.innerHTML = notas.map(n => `
        <div class="nota-item">
            <small style="color: #ff8a80; font-weight: bold; display:block; margin-bottom:5px;">● ${n.fecha}</small>
            <span style="color: #333;">${n.texto}</span>
            <button onclick="borrarNota(${n.id})" style="float:right; border:none; background:none; color:#e57373; cursor:pointer;">🗑</button>
        </div>
    `).join('');
}

function borrarNota(id) {
    if(!confirm("¿Borrar nota?")) return;
    let notas = JSON.parse(localStorage.getItem('misNotas')) || [];
    notas = notas.filter(n => n.id !== id);
    localStorage.setItem('misNotas', JSON.stringify(notas));
    renderizarNotas();
}

// ============================================
// EFECTO SAKURA (PÉTALOS)
// ============================================
function crearSakura() {
    const container = document.getElementById("sakura-container");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const petalo = document.createElement("div");
        petalo.className = "sakura";
        petalo.style.left = Math.random() * 100 + "vw";
        const size = Math.random() * 10 + 5;
        petalo.style.width = size + "px";
        petalo.style.height = size + "px";
        petalo.style.animationDuration = Math.random() * 5 + 5 + "s";
        petalo.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(petalo);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarCalendario();
    actualizarEstadisticas();
    renderizarNotas();
    crearSakura();
});