document.addEventListener("DOMContentLoaded", () => {
    // 1. CONTADOR (Mantener igual)
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
        baseY: 550,
        trunkHeight: 220,
        trunkWidth: 12,
        numFlowers: 450, // Más flores para llenar el corazón
        growTime: 1500,
        waitTime: 5000
    };

    function startCycle() {
        svg.innerHTML = svg.innerHTML; // Reset técnico
        const toRemove = svg.querySelectorAll('rect, path, line, g');
        toRemove.forEach(el => el.remove());
        growOrganicTree();
    }

    function growOrganicTree() {
        // --- EL TRONCO ---
        const trunk = document.createElementNS(NS, "rect");
        trunk.setAttribute("fill", "#5D4037");
        trunk.setAttribute("x", CONFIG.baseX - CONFIG.trunkWidth / 2);
        trunk.setAttribute("y", CONFIG.baseY - CONFIG.trunkHeight);
        trunk.setAttribute("width", CONFIG.trunkWidth);
        trunk.setAttribute("height", CONFIG.trunkHeight);
        trunk.setAttribute("rx", 4);
        trunk.style.transformOrigin = `${CONFIG.baseX}px ${CONFIG.baseY}px`;
        trunk.style.transform = "scaleY(0)";
        svg.appendChild(trunk);

        const trunkAnim = trunk.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], 
            { duration: CONFIG.growTime, easing: 'ease-out', fill: 'forwards' });

        trunkAnim.onfinish = () => {
            // --- LAS RAMAS (Para que parezca árbol) ---
            const branchCoords = [
                { x2: CONFIG.baseX - 60, y2: CONFIG.baseY - CONFIG.trunkHeight - 40 },
                { x2: CONFIG.baseX + 60, y2: CONFIG.baseY - CONFIG.trunkHeight - 40 },
                { x2: CONFIG.baseX, y2: CONFIG.baseY - CONFIG.trunkHeight - 80 }
            ];

            branchCoords.forEach(coord => {
                const branch = document.createElementNS(NS, "line");
                branch.setAttribute("x1", CONFIG.baseX);
                branch.setAttribute("y1", CONFIG.baseY - CONFIG.trunkHeight);
                branch.setAttribute("x2", coord.x2);
                branch.setAttribute("y2", coord.y2);
                branch.setAttribute("stroke", "#5D4037");
                branch.setAttribute("stroke-width", 6);
                branch.setAttribute("stroke-linecap", "round");
                branch.style.opacity = "0";
                svg.appendChild(branch);
                branch.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: 'forwards' });
            });

            setTimeout(bloomOrganic, 300);
        };
    }

    function bloomOrganic() {
        const flowers = [];
        // Path de una FLOR real (centro y 4 pétalos)
        const flowerPath = "M0,0 Q5,-10 10,0 Q20,-10 20,0 Q25,10 10,10 Q0,20 0,10 Q-10,10 -10,0 Q-5,-10 0,0";
        
        const centerX = CONFIG.baseX;
        const centerY = CONFIG.baseY - CONFIG.trunkHeight - 60;

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const f = document.createElementNS(NS, "path");
            f.setAttribute("d", flowerPath);
            f.setAttribute("fill", "#FFD700"); // Amarillo
            f.setAttribute("stroke", "#DAA520"); // Borde dorado
            f.setAttribute("stroke-width", "0.5");
            
            // Ecuación de Corazón (Cardioide) para la copa
            const t = Math.random() * 2 * Math.PI;
            const r = Math.random() * 10 + 2; // Densidad
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3));
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            const finalX = centerX + xOffset;
            const finalY = centerY + yOffset;

            f.setAttribute("transform", `translate(${finalX} ${finalY}) scale(0)`);
            svg.appendChild(f);
            flowers.push({ el: f, x: finalX, y: finalY });

            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0) rotate(0deg)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(0.6) rotate(${Math.random() * 360}deg)`, opacity: 1 }
            ], {
                duration: 1500,
                delay: Math.random() * 2000,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fill: 'forwards'
            });
        }
        setTimeout(() => escape(flowers), CONFIG.waitTime);
    }

    function escape(flowers) {
        flowers.forEach(f => {
            const destX = f.x + (Math.random() - 0.5) * 1000;
            const destY = -200;
            f.el.animate([
                { transform: f.el.style.transform, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) rotate(360deg) scale(0.2)`, opacity: 0 }
            ], {
                duration: 3000,
                delay: Math.random() * 1000,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });
        setTimeout(startCycle, 4000);
    }

    startCycle();
});
