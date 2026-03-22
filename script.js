document.addEventListener("DOMContentLoaded", () => {
    // 1. CONTADOR (Se mantiene igual)
    const counterElement = document.getElementById("flower-counter");
    if (counterElement) {
        const startDate = new Date("2026-03-14T00:00:00");
        const today = new Date();
        const diffInDays = Math.floor((today - startDate) / (1000 * 3600 * 24)) + 1;
        let totalFlowers = 0;
        for (let i = 0; i < diffInDays; i++) totalFlowers += Math.floor(Math.random() * 5) + 1;
        counterElement.innerText = totalFlowers.toLocaleString();
    }

    const svg = document.getElementById("garden-svg");
    if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";

    const CONFIG = {
        baseX: 300,
        baseY: 280,
        numFlowers: 450, // Cantidad óptima para fluidez y densidad
        bloomTime: 2000,
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
            f.setAttribute("stroke-width", "0.2");
            
            // --- DISTRIBUCIÓN MEJORADA (Uniforme) ---
            // Usamos una distribución más homogénea dentro de la forma
            const t = (i / CONFIG.numFlowers) * 2 * Math.PI;
            const r = 10 + Math.sqrt(Math.random()) * 4; // Radio base + variación
            
            // Ecuación de corazón pura con una pizca de ruido para naturalidad
            const noise = (Math.random() - 0.5) * 2;
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3)) + noise;
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) + noise;

            const finalX = CONFIG.baseX + xOffset;
            const finalY = CONFIG.baseY + yOffset;

            f.style.opacity = "0";
            svg.appendChild(f);
            
            const scale = Math.random() * 0.7 + 0.5; // Flores un poco más pequeñas para que no se pisen
            const rotation = Math.random() * 360;

            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0) rotate(0deg)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(${scale}) rotate(${rotation}deg)`, opacity: 1 }
            ], {
                duration: 800,
                delay: (i / CONFIG.numFlowers) * CONFIG.bloomTime, // Aparecen en orden circular (efecto mágico)
                easing: 'ease-out',
                fill: 'forwards'
            });

            flowers.push({ el: f, x: finalX, y: finalY, scale, rotation });
        }

        setTimeout(() => escapeFlowers(flowers), CONFIG.bloomTime + CONFIG.waitTime);
    }

    function escapeFlowers(flowers) {
        flowers.forEach((f, i) => {
            const angle = (i / flowers.length) * 2 * Math.PI;
            const dist = 600;
            const destX = f.x + Math.cos(angle) * dist;
            const destY = f.y - (Math.random() * 500); 

            f.el.animate([
                { transform: `translate(${f.x}px, ${f.y}px) scale(${f.scale}) rotate(${f.rotation}deg)`, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0) rotate(${f.rotation + 360}deg)`, opacity: 0 }
            ], {
                duration: 2500,
                delay: Math.random() * 1000,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        setTimeout(startCycle, CONFIG.escapeTime + 2000);
    }

    startCycle();
});
