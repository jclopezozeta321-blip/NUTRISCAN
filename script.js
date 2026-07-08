// ===========================================
// NUTRISCAN v3.0
// ===========================================

// Variables globales
let productoSeleccionado = null;
let favoritos = [];

// ===========================================
// NAVEGACIÓN
// ===========================================

function mostrarPagina(id){

    document.querySelectorAll(".pagina").forEach(pagina=>{

        pagina.classList.remove("activa");

    });

    document.getElementById(id).classList.add("activa");

}

// ===========================================
// EVENTOS
// ===========================================

function inicializarEventos(){

    document.getElementById("btnInicio").onclick = () => mostrarPagina("inicio");

    document.getElementById("btnBuscar").onclick = () => mostrarPagina("buscar");

    document.getElementById("btnDashboard").onclick = () => mostrarPagina("dashboard");

    document.getElementById("btnComparar").onclick = () => mostrarPagina("comparar");

    document.getElementById("btnFavoritos").onclick = () => {

    mostrarPagina("favoritos");

    mostrarFavoritos();

};
  document.getElementById("btnBuscarProducto").onclick = buscarProducto;
document.getElementById("btnFavorito").onclick = agregarFavorito;
  document.getElementById("btnCompararProductos").onclick = compararProductos;
  document.getElementById("btnPDF").onclick = exportarPDF;
}

// ===========================================
// INICIO
// ===========================================

window.onload = function(){

    inicializarEventos();
  const guardados = localStorage.getItem("favoritos");

if(guardados){

    favoritos = JSON.parse(guardados);

}

    mostrarPagina("inicio");

    actualizarDashboard();
crearGraficoCategorias();
  crearGraficoSemaforo();
  cargarComparador();
}
// ===========================================
// COMPARAR PRODUCTOS
// ===========================================

function compararProductos(){

    const codigo1 = document.getElementById("producto1").value;
    const codigo2 = document.getElementById("producto2").value;

    const p1 = productos.find(p => p.codigo === codigo1);
    const p2 = productos.find(p => p.codigo === codigo2);

    if(!p1 || !p2){
        return;
    }
  let ganador = "";

if(p1.puntuacion > p2.puntuacion){

    ganador = `
        <div class="ganador">
            🏆 <strong>${p1.producto}</strong> es la opción más saludable.
        </div>
    `;

}else if(p2.puntuacion > p1.puntuacion){

    ganador = `
        <div class="ganador">
            🏆 <strong>${p2.producto}</strong> es la opción más saludable.
        </div>
    `;

}else{

    ganador = `
        <div class="ganador">
            🤝 Ambos productos tienen la misma puntuación nutricional.
        </div>
    `;

}

    document.getElementById("resultadoComparacion").innerHTML = `

        <table class="tablaComparacion">

            <tr>
                <th>Característica</th>
                <th>${p1.producto}</th>
                <th>${p2.producto}</th>
            </tr>

            <tr>
                <td>Marca</td>
                <td>${p1.marca}</td>
                <td>${p2.marca}</td>
            </tr>

            <tr>
                <td>Categoría</td>
                <td>${p1.categoria}</td>
                <td>${p2.categoria}</td>
            </tr>

            <tr>
                <td>Calorías</td>
                <td>${p1.calorias}</td>
                <td>${p2.calorias}</td>
            </tr>

            <tr>
                <td>Azúcar</td>
                <td>${p1.azucar}</td>
                <td>${p2.azucar}</td>
            </tr>

            <tr>
    <td>Grasas Saturadas</td>
    <td>${p1.grasasSaturadas}</td>
    <td>${p2.grasasSaturadas}</td>
</tr>

            <tr>
                <td>Sodio</td>
                <td>${p1.sodio}</td>
                <td>${p2.sodio}</td>
            </tr>

            <tr>
                <td>Proteínas</td>
                <td>${p1.proteinas}</td>
                <td>${p2.proteinas}</td>
            </tr>

            <tr>
                <td>Fibra</td>
                <td>${p1.fibra}</td>
                <td>${p2.fibra}</td>
            </tr>

            <tr>
                <td>NutriScore</td>
                <td>${p1.indiceNutricional}</td>
<td>${p2.indiceNutricional}</td>
            </tr
            <tr>
    <td>Semáforo</td>
    <td>${p1.semaforoNutricional}</td>
    <td>${p2.semaforoNutricional}</td>
</tr>
<tr>
    <td>Recomendación</td>
    <td>${p1.recomendacion}</td>
    <td>${p2.recomendacion}</td>
</tr>
<tr>
    <td>Frecuencia</td>
    <td>${p1.frecuenciaRecomendada}</td>
    <td>${p2.frecuenciaRecomendada}</td>
</tr>

        </table>
${ganador}
    `;

}
// ===========================================
// EXPORTAR PDF
// ===========================================

async function exportarPDF(){

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p","mm","a4");

    const contenido = document.getElementById("resultadoComparacion");

    if(contenido.innerHTML.trim()===""){

        alert("Primero realiza una comparación.");

        return;

    }

    const canvas = await html2canvas(contenido);

    const img = canvas.toDataURL("image/png");

    const ancho = 190;
    const alto = canvas.height * ancho / canvas.width;

    pdf.text("NutriScan v3.0 - Comparación de Productos",10,15);

    pdf.addImage(img,"PNG",10,25,ancho,alto);

    pdf.save("Comparacion_NutriScan.pdf");

}
// ===========================================
// GRÁFICO DE CATEGORÍAS
// ===========================================

let graficoCategorias = null;

function crearGraficoCategorias(){

    const categorias = {};

    productos.forEach(producto=>{

        categorias[producto.categoria] =
            (categorias[producto.categoria] || 0) + 1;

    });

    const ctx = document
        .getElementById("graficoCategorias")
        .getContext("2d");

    if(graficoCategorias){
        graficoCategorias.destroy();
    }

    graficoCategorias = new Chart(ctx,{
        type:"bar",
        data:{
            labels:Object.keys(categorias),
            datasets:[{
                label:"Productos",
                data:Object.values(categorias),
                backgroundColor:"#2ecc71"
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false
        }
    });

}
// ===========================================
// GRÁFICO SEMÁFORO
// ===========================================

let graficoSemaforo = null;

function crearGraficoSemaforo(){

    let verde = 0;
    let amarillo = 0;
    let rojo = 0;

    productos.forEach(producto => {

    if (producto.semaforoNutricional === "🟢") {

        verde++;

    } else if (producto.semaforoNutricional === "🟡") {

        amarillo++;

    } else if (producto.semaforoNutricional === "🔴") {

        rojo++;

    }

});

    const ctx = document
        .getElementById("graficoSemaforo")
        .getContext("2d");

    if(graficoSemaforo){

        graficoSemaforo.destroy();

    }

    graficoSemaforo = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:["Verde","Amarillo","Rojo"],

            datasets:[{

                data:[verde,amarillo,rojo],

                backgroundColor:[

                    "#2ECC71",

                    "#F1C40F",

                    "#E74C3C"

                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}
// ===========================================
// BUSCADOR
// ===========================================

function buscarProducto(){

    const texto = document
        .getElementById("txtBuscar")
        .value
        .toLowerCase()
        .trim();

    const resultado = document.getElementById("resultadoBusqueda");

    resultado.innerHTML = "";

    if(texto===""){

        resultado.innerHTML="<p>Escribe un producto.</p>";

        return;

    }

    const encontrados = productos.filter(producto=>{

        return producto.producto.toLowerCase().includes(texto)

            || producto.marca.toLowerCase().includes(texto)

            || producto.categoria.toLowerCase().includes(texto)

            || producto.codigo.includes(texto);

    });

    if(encontrados.length===0){

        resultado.innerHTML="<p>No se encontraron productos.</p>";

        return;

    }

    encontrados.forEach(producto=>{

        resultado.innerHTML += `

        <div class="card">

            <h3>${producto.producto}</h3>

            <p>${producto.marca}</p>

            <p>${producto.categoria}</p>

            <button onclick="mostrarProducto('${producto.codigo}')">

                Ver información

            </button>

        </div>

        `;

    });

}
// ===========================================
// MOSTRAR PRODUCTO
// ===========================================

function mostrarProducto(codigo){

    const producto = productos.find(p => p.codigo === codigo);

    if(!producto) return;

    productoSeleccionado = producto;

    mostrarPagina("producto");

    document.getElementById("nombreProducto").textContent = producto.producto;

    document.getElementById("marcaProducto").textContent = producto.marca;

    document.getElementById("categoriaProducto").textContent = producto.categoria;

    document.getElementById("calorias").textContent = producto.calorias;

document.getElementById("azucar").textContent = producto.azucar;

document.getElementById("grasas").textContent = producto.grasasSaturadas;

document.getElementById("sodio").textContent = producto.sodio;

document.getElementById("proteinas").textContent = producto.proteinas;

document.getElementById("fibra").textContent = producto.fibra;

document.getElementById("nivelSaludable").textContent = producto.nivelSaludable;

document.getElementById("puntuacion").textContent = producto.puntuacion;

document.getElementById("semaforo").textContent = producto.semaforoNutricional;

document.getElementById("porcion").textContent = producto.porcionRecomendada;

document.getElementById("frecuencia").textContent = producto.frecuenciaRecomendada;

document.getElementById("beneficios").textContent = producto.beneficios;

document.getElementById("aspectos").textContent = producto.aspectosAConsiderar;

document.getElementById("alternativa").textContent = producto.alternativaSaludable;

document.getElementById("indice").textContent = producto.indiceNutricional;

document.getElementById("recomendacion").textContent = producto.recomendacion;

document.getElementById("imgProducto").src = producto.imagen;

document.getElementById("nutriScore").textContent = producto.indiceNutricional;
    document.getElementById("recomendacion").textContent = producto.recomendacion;

    document.getElementById("imgProducto").src = producto.imagen;

    document.getElementById("nutriScore").textContent = producto.indice;

}
// ===========================================
// FAVORITOS
// ===========================================

function agregarFavorito(){

    if(!productoSeleccionado) return;

    const existe = favoritos.find(p => p.codigo === productoSeleccionado.codigo);

    if(existe){

        alert("Este producto ya está en favoritos.");

        return;

    }

    favoritos.push(productoSeleccionado);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    alert("Producto agregado a favoritos.");

}
// ===========================================
// MOSTRAR FAVORITOS
// ===========================================

function mostrarFavoritos(){

    const lista = document.getElementById("listaFavoritos");

    lista.innerHTML = "";

    if(favoritos.length === 0){

        lista.innerHTML = "<p>No hay productos favoritos.</p>";

        return;

    }

    favoritos.forEach(producto=>{

        lista.innerHTML += `

        <div class="card">

            <h3>${producto.producto}</h3>

            <p>${producto.marca}</p>

            <p>${producto.categoria}</p>

            <button onclick="mostrarProducto('${producto.codigo}')">

                Ver producto

            </button>

        </div>

        `;

    });

}
// ===========================================
// CARGAR COMPARADOR
// ===========================================

function cargarComparador(){

    const producto1 = document.getElementById("producto1");
    const producto2 = document.getElementById("producto2");

    producto1.innerHTML = "";
    producto2.innerHTML = "";

    productos.forEach(producto=>{

        producto1.innerHTML += `
            <option value="${producto.codigo}">
                ${producto.producto}
            </option>
        `;

        producto2.innerHTML += `
            <option value="${producto.codigo}">
                ${producto.producto}
            </option>
        `;

    });

}
// ===========================================
// DASHBOARD
// ===========================================

function actualizarDashboard(){

    document.getElementById("totalProductos").textContent =
        productos.length;

    let suma = 0;
    let saludables = 0;
    let riesgo = 0;

    productos.forEach(producto=>{

        suma += Number(producto.puntuacion || 0);

       if (
    producto.indiceNutricional === "A" ||
    producto.indiceNutricional === "B"
) {
    saludables++;
}

if (
    producto.indiceNutricional === "D" ||
    producto.indiceNutricional === "E"
) {
    riesgo++;
}

    });

    const promedio = productos.length===0
        ? 0
        : (suma/productos.length).toFixed(1);

    document.getElementById("promedio").textContent =
        promedio;

    document.getElementById("saludables").textContent =
        saludables;

    document.getElementById("riesgo").textContent =
        riesgo;

}
