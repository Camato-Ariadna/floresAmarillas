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
        baseY: 300,
        numFlowers: 250, // ¡Subimos para asegurar el relleno!
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
            
            const t = (i / CONFIG.numFlowers) * 2 * Math.PI;
            
            // --- AJUSTE DE PRECISIÓN (Compacto) ---
            // Un radio pequeño y uniforme para que se peguen a la forma
            const r = 6.5 + Math.random() * 0.5; // Muy poca variación para que sea denso
            
            // --- REDUCCIÓN DRÁSTICA DEL NOISE ---
            // Bajamos el ruido a 0.2 para que no se dispersen
            const noise = (Math.random() - 0.5) * 0.2;
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3)) + noise;
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) + noise;

            const finalX = CONFIG.baseX + xOffset;
            const finalY = CONFIG.baseY + yOffset;

            f.style.opacity = "0";
            svg.appendChild(f);
            
            // Flores más grandes para rellenar los huecos
            const scale = Math.random() * 1.0 + 1.2; // Escala grande (1.2x - 2.2x)
            const rotation = Math.random() * 360;

            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0) rotate(0deg)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(${scale}) rotate(${rotation}deg)`, opacity: 1 }
            ], {
                duration: 900,
                delay: (i / CONFIG.numFlowers) * CONFIG.bloomTime,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Efecto pop
                fill: 'forwards'
            });

            flowers.push({ el: f, x: finalX, y: finalY, scale, rotation });
        }

        setTimeout(() => escapeFlowers(flowers), CONFIG.bloomTime + CONFIG.waitTime);
    }

    function escapeFlowers(flowers) {
        flowers.forEach((f, i) => {
            const angle = Math.random() * 2 * Math.PI;
            const dist = 700;
            const destX = f.x + Math.cos(angle) * dist;
            const destY = f.y - (Math.random() * 600 + 200); 

            f.el.animate([
                { transform: `translate(${f.x}px, ${f.y}px) scale(${f.scale}) rotate(${f.rotation}deg)`, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0) rotate(${f.rotation + 1080}deg)`, opacity: 0 }
            ], {
                duration: 2500,
                delay: Math.random() * 1500,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        setTimeout(startCycle, CONFIG.escapeTime + 2000);
    }

    startCycle();
});
