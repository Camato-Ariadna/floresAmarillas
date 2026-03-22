document.addEventListener("DOMContentLoaded", () => {
    // --- 1. EL CONTADOR (Mantenemos la lógica que ya funcionaba) ---
    const counterElement = document.getElementById("flower-counter");
    if (counterElement) {
        // Fecha de inicio: 14 de Marzo de 2026
        const startDate = new Date("2026-03-14T00:00:00");
        const today = new Date();
        
        // Calculamos la diferencia en días
        const diffInMs = today - startDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24)) + 1; // +1 para incluir el día actual
        
        // Lógica para acumular flores (ej: entre 1 y 5 flores nuevas por día)
        let totalFlowers = 0;
        for (let i = 0; i < diffInDays; i++) {
            totalFlowers += Math.floor(Math.random() * 5) + 1;
        }
        
        // Mostramos el total formateado
        counterElement.innerText = totalFlowers.toLocaleString();
    }

    // --- 2. LA ANIMACIÓN DEL CORAZÓN DE FLORES ---
    const svg = document.getElementById("garden-svg");
    if (!svg) return; // Seguridad si no encuentra el SVG

    const NS = "http://www.w3.org/2000/svg";
    
    // Configuración de la animación
    const CONFIG = {
        baseX: 300,         // Centro horizontal del SVG
        baseY: 300,         // Centro vertical del SVG (donde se formará el corazón)
        numFlowers: 200,    // Cantidad de flores para formar el corazón
        bloomTime: 2000,    // Tiempo que tardan en aparecer todas las flores (ms)
        waitTime: 4000,     // Tiempo que se queda el corazón formado (ms)
        escapeTime: 3000    // Tiempo que tardan en irse volando (ms)
    };

    // Función principal para iniciar el ciclo
    function startCycle() {
        // Limpiamos todo el contenido previo del SVG
        svg.innerHTML = '';
        
        // Creamos y animamos las flores
        createHeartOfFlowers();
    }

    function createHeartOfFlowers() {
        // Path de la florecita amarilla (reutilizamos el diseño que te gustó)
        const flowerPath = "M0,0 C-2,-5 -5,-5 -5,0 C-5,5 -2,5 0,0 C2,5 5,5 5,0 C5,-5 2,-5 0,0";
        const flowers = [];

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const f = document.createElementNS(NS, "path");
            f.setAttribute("d", flowerPath);
            f.setAttribute("fill", "#FFD700"); // Amarillo Oro
            f.setAttribute("stroke", "#FBC02D"); // Borde amarillo oscuro
            f.setAttribute("stroke-width", "0.3");
            
            // --- FÓRMULA MATEMÁTICA DEL CORAZÓN (Cardioide) ---
            // Usamos una ecuación para distribuir los puntos formando un corazón
            const t = Math.random() * 2 * Math.PI; // Ángulo aleatorio
            const r = (Math.sqrt(Math.random()) * 12) + 2; // Radio aleatorio para rellenar
            
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3));
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            const finalX = CONFIG.baseX + xOffset;
            const finalY = CONFIG.baseY + yOffset;

            // Colocamos la flor inicialmente invisible y en escala 0
            f.setAttribute("transform", `translate(${finalX} ${finalY}) scale(0)`);
            svg.appendChild(f);
            
            // Guardamos la referencia y posición final para la fase de escape
            flowers.push({ el: f, x: finalX, y: finalY });

            // --- ANIMACIÓN 1: APARECER (BLOOM) ---
            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(${Math.random() * 1.5 + 0.5}) rotate(${Math.random() * 360}deg)`, opacity: 1 }
            ], {
                duration: 1000, // Cada flor tarda 1s en crecer
                delay: Math.random() * CONFIG.bloomTime, // Aparecen dispersas en el tiempo
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Efecto "pop" al aparecer
                fill: 'forwards'
            });
        }

        // Programamos la siguiente fase: irse volando
        setTimeout(() => escapeFlowers(flowers), CONFIG.bloomTime + CONFIG.waitTime);
    }

    function escapeFlowers(flowers) {
        flowers.forEach(f => {
            // Calculamos un destino aleatorio fuera de la pantalla
            const angle = Math.random() * Math.PI * 2;
            const dist = 500 + Math.random() * 200;
            const destX = f.x + Math.cos(angle) * dist;
            const destY = f.y - dist; // Se van hacia arriba y afuera

            // --- ANIMACIÓN 2: IRSE VOLANDO (ESCAPE) ---
            f.el.animate([
                { transform: f.el.style.transform, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) rotate(720deg) scale(0)`, opacity: 0 }
            ], {
                duration: CONFIG.escapeTime,
                delay: Math.random() * 1000, // No se van todas al mismo tiempo
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        // Programamos el reinicio del ciclo
        setTimeout(startCycle, CONFIG.escapeTime + 1000);
    }

    // Iniciamos la animación por primera vez
    startCycle();
});
