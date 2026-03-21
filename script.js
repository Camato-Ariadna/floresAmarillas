// script.js (Reemplazo completo)

document.addEventListener("DOMContentLoaded", () => {
    // === SECCIÓN 1: LÓGICA DEL CONTADOR (Ya la teníamos) ===
    const counterElement = document.getElementById("flower-counter");
    const startDate = new Date("2026-03-14T00:00:00");
    const today = new Date();
    const diffInTime = today.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)) + 1;
    let totalFlowers = 0;
    for (let i = 0; i < diffInDays; i++) {
        const randomMultiplier = Math.floor(Math.random() * 5) + 1;
        totalFlowers += (1 * randomMultiplier);
    }
    counterElement.innerText = totalFlowers.toLocaleString();

    // === SECCIÓN 2: LÓGICA DE LA ANIMACIÓN (Nuevo) ===
    const svg = document.getElementById("garden-svg");
    const NS = "http://www.w3.org/2000/svg"; // Namespace para crear elementos SVG

    // Configuración de la animación
    const CONFIG = {
        trunkHeight: 350,
        trunkWidth: 20,
        baseY: 550, // Base donde nace el árbol
        baseX: 300, // Centro horizontal del SVG
        numFlowers: 60, // Cuántas flores nacen
        growTime: 2500, // ms para crecer el tronco
        bloomTime: 1500, // ms para que nazcan todas las flores
        waitTime: 4000, // ms que esperan antes de escapar
        escapeTime: 3000 // ms que tardan en escapar
    };

    let flowerElements = []; // Guardaremos las flores aquí

    // -- FUNCIÓN MAESTRA: Inicia el ciclo --
    function startAnimationCycle() {
        svg.innerHTML = svg.innerHTML; // Limpia el SVG (reinicia gradientes)
        flowerElements = [];
        growTree();
    }

    // -- PASO 1: Crecer el Tronco --
    function growTree() {
        // Creamos el tronco como un rectángulo SVG
        const trunk = document.createElementNS(NS, "rect");
        trunk.setAttribute("class", "trunk");
        trunk.setAttribute("x", CONFIG.baseX - CONFIG.trunkWidth / 2);
        trunk.setAttribute("y", CONFIG.baseY); // Empieza en la base
        trunk.setAttribute("width", CONFIG.trunkWidth);
        trunk.setAttribute("height", 0); // Altura inicial cero
        trunk.setAttribute("rx", 5); // Bordes redondeados
        svg.appendChild(trunk);

        // Animación de crecimiento del tronco (usando Web Animations API)
        const growAnimation = trunk.animate([
            { y: CONFIG.baseY, height: 0 },
            { y: CONFIG.baseY - CONFIG.trunkHeight, height: CONFIG.trunkHeight }
        ], {
            duration: CONFIG.growTime,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Cuando termina de crecer el tronco, pasamos a las flores
        growAnimation.onfinish = () => {
            bloomFlowers();
        };
    }

    // -- PASO 2: Florecer Corazones Amarillos --
    function bloomFlowers() {
        // Path SVG para una forma de corazón simple
        const heartPathData = "M10,30 A10,10 0 0,1 30,30 A10,10 0 0,1 50,30 Q50,50 30,70 Q10,50 10,30 Z";

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const flower = document.createElementNS(NS, "path");
            flower.setAttribute("class", "heart-flower");
            flower.setAttribute("d", heartPathData);

            // Posición aleatoria alrededor de la copa del árbol
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 120 + 30; // Radio de la copa
            const x = CONFIG.baseX + Math.cos(angle) * radius - 30; // -30 para centrar el path
            const y = (CONFIG.baseY - CONFIG.trunkHeight) + Math.sin(angle) * radius * 0.7 - 40; // Copa más aplanada

            flower.setAttribute("transform", `translate(${x}, ${y}) scale(0)`);
            svg.appendChild(flower);
            flowerElements.push(flower);

            // Animación individual de cada flor (crecer con retraso aleatorio)
            flower.animate([
                { transform: `translate(${x}, ${y}) scale(0)`, opacity: 0 },
                { transform: `translate(${x}, ${y}) scale(0.6)`, opacity: 1 } // scale(0.6) para tamaño final
            ], {
                duration: 800,
                delay: Math.random() * CONFIG.bloomTime, // Retraso aleatorio para efecto natural
                easing: 'back-out(1.7)',
                fill: 'forwards'
            });
        }

        // Después de que todas las flores han nacido y esperado...
        setTimeout(escapeButterflies, CONFIG.bloomTime + CONFIG.waitTime);
    }

    // -- PASO 3: Transformación y Escape de Mariposas --
    function escapeButterflies() {
        flowerElements.forEach((flower, index) => {
            // Cambiamos la clase a 'butterfly' para cambiar el estilo CSS
            flower.setAttribute("class", "butterfly");

            // Calculamos un destino de escape caótico (hacia arriba y afuera)
            const targetX = CONFIG.baseX + (Math.random() - 0.5) * 1000; // Muy disperso horizontalmente
            const targetY = -200; // Fuera de la pantalla hacia arriba
            const currentTransform = flower.getAttribute("transform");
            const currentCoords = currentTransform.match(/translate\(([^,]+), ([^\)]+)\)/);
            const startX = parseFloat(currentCoords[1]);
            const startY = parseFloat(currentCoords[2]);

            // Animación de vuelo caótico
            flower.animate([
                { transform: `translate(${startX}, ${startY}) scale(0.6)`, opacity: 1 },
                // Punto intermedio para dar efecto de aleteo/curva
                { transform: `translate(${startX + (Math.random() - 0.5) * 200}, ${startY - 150}) scale(0.7)`, opacity: 1, offset: 0.4 },
                { transform: `translate(${targetX}, ${targetY}) scale(0.2)`, opacity: 0 } // Desaparece al final
            ], {
                duration: CONFIG.escapeTime + Math.random() * 1000, // Tiempos variables para desorden
                delay: Math.random() * 500, // Salida escalonada
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        // Reiniciamos el ciclo completo
        setTimeout(startAnimationCycle, CONFIG.escapeTime + 1000);
    }

    // === INICIAR LA MAGIA POR PRIMERA VEZ ===
    startAnimationCycle();
});
