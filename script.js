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
        baseY: 550,
        trunkHeight: 180,
        numFlowers: 250, // ¡Mucha más densidad!
        growTime: 2000,
        waitTime: 6000
    };

    function startCycle() {
        svg.innerHTML = ''; // Limpieza total
        // Añadir gradiente para las flores (opcional para brillo)
        svg.innerHTML = `
            <defs>
                <radialGradient id="flowerGrad">
                    <stop offset="10%" stop-color="#FFF59D" />
                    <stop offset="95%" stop-color="#FDD835" />
                </radialGradient>
            </defs>
        `;
        growTree();
    }

    function createBranch(x1, y1, angle, length, width) {
        if (length < 10) return; // Límite de las ramas pequeñas

        const x2 = x1 + Math.cos(angle * Math.PI / 180) * length;
        const y2 = y1 + Math.sin(angle * Math.PI / 180) * length;

        const line = document.createElementNS(NS, "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#4E342E");
        line.setAttribute("stroke-width", width);
        line.setAttribute("stroke-linecap", "round");
        
        // Animación de crecimiento de la rama
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        svg.appendChild(line);

        line.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
            duration: 800,
            fill: 'forwards',
            easing: 'ease-in-out'
        });

        // Crear dos ramas más pequeñas (hijas)
        setTimeout(() => {
            createBranch(x2, y2, angle - 25, length * 0.7, width * 0.6);
            createBranch(x2, y2, angle + 25, length * 0.7, width * 0.6);
        }, 500);
    }

    function growTree() {
        // Tronco principal
        createBranch(CONFIG.baseX, CONFIG.baseY, -90, CONFIG.trunkHeight, 15);
        
        // Empezar a florecer un poco antes de que termine de crecer
        setTimeout(bloomIntoHeart, 1500);
    }

    function bloomIntoHeart() {
        const flowers = [];
        // Path de pétalos más suave
        const flowerPath = "M0,0 C-2,-5 -5,-5 -5,0 C-5,5 -2,5 0,0 C2,5 5,5 5,0 C5,-5 2,-5 0,0";
        
        const centerX = CONFIG.baseX;
        const centerY = CONFIG.baseY - CONFIG.trunkHeight - 50;

        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const f = document.createElementNS(NS, "path");
            f.setAttribute("d", flowerPath);
            f.setAttribute("fill", "url(#flowerGrad)");
            f.setAttribute("stroke", "#FBC02D");
            f.setAttribute("stroke-width", "0.2");
            
            // --- ECUACIÓN DE CORAZÓN DE ALTA DENSIDAD ---
            const t = Math.random() * 2 * Math.PI;
            // r controla qué tan lejos del centro está la flor
            const r = (Math.sqrt(Math.random()) * 12) + 2; 
            
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3));
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            const finalX = centerX + xOffset;
            const finalY = centerY + yOffset;

            f.setAttribute("transform", `translate(${finalX} ${finalY}) scale(0)`);
            svg.appendChild(f);
            flowers.push({ el: f, x: finalX, y: finalY });

            f.animate([
                { transform: `translate(${finalX}px, ${finalY}px) scale(0)`, opacity: 0 },
                { transform: `translate(${finalX}px, ${finalY}px) scale(${Math.random() * 1.5 + 0.5}) rotate(${Math.random() * 360}deg)`, opacity: 1 }
            ], {
                duration: 1200,
                delay: Math.random() * 3000, // Florece poco a poco
                easing: 'back.out(1.7)',
                fill: 'forwards'
            });
        }
        setTimeout(() => escape(flowers), CONFIG.waitTime);
    }

    function escape(flowers) {
        flowers.forEach(f => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 600 + Math.random() * 200;
            const destX = f.x + Math.cos(angle) * dist;
            const destY = f.y - dist;

            f.el.animate([
                { transform: f.el.style.transform, opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) rotate(720deg) scale(0)`, opacity: 0 }
            ], {
                duration: 4000,
                delay: Math.random() * 2000,
                easing: 'ease-in',
                fill: 'forwards'
            });
        });
        setTimeout(startCycle, 6000);
    }

    startCycle();
});
