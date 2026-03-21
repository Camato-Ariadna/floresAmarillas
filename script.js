document.addEventListener("DOMContentLoaded", () => {
    // 1. EL CONTADOR (Mantenemos la lógica que ya funcionaba)
    const counterElement = document.getElementById("flower-counter");
    const startDate = new Date("2026-03-14T00:00:00");
    const today = new Date();
    const diffInDays = Math.floor((today - startDate) / (1000 * 3600 * 24)) + 1;
    let totalFlowers = 0;
    for (let i = 0; i < diffInDays; i++) {
        totalFlowers += Math.floor(Math.random() * 5) + 1;
    }
    counterElement.innerText = totalFlowers.toLocaleString();

    // 2. LA ANIMACIÓN
    const svg = document.getElementById("garden-svg");
    const NS = "http://www.w3.org/2000/svg";

    const CONFIG = {
        trunkHeight: 300,
        trunkWidth: 15,
        baseY: 500, 
        baseX: 300,
        numFlowers: 40, // Reducido un poco para que sea más fluido
        growTime: 2000, 
        bloomTime: 1000, 
        waitTime: 3000, 
        escapeTime: 2500 
    };

    function startCycle() {
        // Limpiamos solo los rectángulos y paths, manteniendo los <defs>
        const elementsToRemove = svg.querySelectorAll('rect, path:not([id])');
        elementsToRemove.forEach(el => el.remove());
        
        growTree();
    }

    function growTree() {
        const trunk = document.createElementNS(NS, "rect");
        trunk.setAttribute("fill", "#8b4513"); // Color sólido de respaldo
        trunk.setAttribute("x", CONFIG.baseX - CONFIG.trunkWidth / 2);
        trunk.setAttribute("width", CONFIG.trunkWidth);
        // Empezamos con el tronco ya en su posición pero altura 0
        trunk.setAttribute("y", CONFIG.baseY);
        trunk.setAttribute("height", 0);
        svg.appendChild(trunk);

        const anim = trunk.animate([
            { y: CONFIG.baseY, height: 0 },
            { y: CONFIG.baseY - CONFIG.trunkHeight, height: CONFIG.trunkHeight }
        ], {
            duration: CONFIG.growTime,
            easing: 'ease-out',
            fill: 'forwards'
        });

        anim.onfinish = bloom;
    }

    function bloom() {
        // Path de un corazón escalado
        const heartPath = "M10,30 A5,5 0 0,1 20,30 A5,5 0 0,1 30,30 Q30,45 20,55 Q10,45 10,30 Z";
        const flowers = [];

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const f = document.createElementNS(NS, "path");
            f.setAttribute("d", heartPath);
            f.setAttribute("fill", "#FFD700"); // Amarillo Oro
            
            // Posición en la copa
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 100;
            const x = CONFIG.baseX + Math.cos(angle) * dist - 20;
            const y = (CONFIG.baseY - CONFIG.trunkHeight) + Math.sin(angle) * dist * 0.6 - 20;

            f.setAttribute("transform", `translate(${x}, ${y}) scale(0)`);
            svg.appendChild(f);
            flowers.push({ el: f, x, y });

            f.animate([
                { transform: `translate(${x}, ${y}) scale(0)`, opacity: 0 },
                { transform: `translate(${x}, ${y}) scale(1.5)`, opacity: 1 }
            ], {
                duration: 800,
                delay: Math.random() * CONFIG.bloomTime,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                fill: 'forwards'
            });
        }

        setTimeout(() => escape(flowers), CONFIG.bloomTime + CONFIG.waitTime);
    }

    function escape(flowers) {
        flowers.forEach(f => {
            const destX = f.x + (Math.random() - 0.5) * 600;
            const destY = -100;

            f.el.animate([
                { transform: `translate(${f.x}, ${f.y}) scale(1.5)`, opacity: 1 },
                { transform: `translate(${destX}, ${destY}) scale(0.5)`, opacity: 0 }
            ], {
                duration: CONFIG.escapeTime,
                delay: Math.random() * 500,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });

        setTimeout(startCycle, CONFIG.escapeTime + 500);
    }

    startCycle();
});
