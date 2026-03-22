document.addEventListener("DOMContentLoaded", () => {
    // 1. CONTADOR (Se mantiene igual)
    const counterElement = document.getElementById("flower-counter");
    if (counterElement) {
        const startDate = new Date("2026-03-14T00:00:00");
        const today = new Date();
        const diffInDays = Math.floor((today - startDate) / (1000 * 3600 * 24)) + 1;
        let totalFlowers = 0;
        for (let i = 0; i < diffInDays; i++) {
            totalFlowers += Math.floor(Math.random() * 5) + 1;
        }
        counterElement.innerText = totalFlowers.toLocaleString();
    }

    const svg = document.getElementById("garden-svg");
    if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";

    const CONFIG = {
        baseX: 300,
        baseY: 280, // Un poco más arriba del centro
        numFlowers: 300, 
        bloomTime: 2500,
        waitTime: 4000,
        escapeTime: 3000
    };

    function startCycle() {
        svg.innerHTML = ''; 
        createHeartOfFlowers();
    }

    function createHeartOfFlowers() {
        const flowerPath = "M0,0 C-2,-5 -5,-5 -5,0 C-5,5 -2,5 0,0 C2,5 5,5 5,0 C5,-5 2,-5 0,0";
        const flowers = [];

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const f = document.createElementNS(NS, "path");
            f.setAttribute("d", flowerPath);
            f.setAttribute("fill", "#FFD700");
            f.setAttribute("stroke", "#FBC02D");
            f.setAttribute("stroke-width", "0.3");
            
            // --- MEJORA DE DISTRIBUCIÓN ---
            const t = Math.random() * 2 * Math.PI;
            // Usar Math.sqrt asegura que las flores no se amontonen solo en el centro
            const r = (Math.sqrt(Math.random()) * 13) + 1; 
            
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3));
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            const finalX = CONFIG.baseX + xOffset;
            const finalY = CONFIG.baseY + yOffset;

            // Estado inicial
            f.style.opacity = "0";
            svg.appendChild(f);
            
            const scale = Math.random() * 1.2 + 0.6;
            const rotation = Math.random() * 360;

            // Animación de aparición
            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0) rotate(0deg)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(${scale}) rotate(${rotation}deg)`, opacity: 1 }
            ], {
                duration: 1000,
                delay: Math.random() * CONFIG.bloomTime,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fill: 'forwards'
            });

            flowers.push({ el: f, x: finalX, y: finalY, scale, rotation });
        }

        // Programar el vuelo
        setTimeout(() => escapeFlowers(flowers), CONFIG.bloomTime + CONFIG.waitTime);
    }

    function escapeFlowers(flowers) {
        flowers.forEach(f => {
            // Destino aleatorio hacia afuera
            const angle = Math.random() * Math.PI * 2;
            const dist = 600 + Math.random() * 400;
            const destX = f.x + Math.cos(angle) * dist;
            const destY = f.y - (Math.random() * 400 + 200); // Tienden a subir

            f.el.animate([
                { transform: `translate(${f.x}px, ${f.y}px) scale(${f.scale}) rotate(${f.rotation}deg)`, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0) rotate(${f.rotation + 720}deg)`, opacity: 0 }
            ], {
                duration: CONFIG.escapeTime,
                delay: Math.random() * 1500,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        // Reiniciar el ciclo
        setTimeout(startCycle, CONFIG.escapeTime + 2000);
    }

    startCycle();
});
