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
        numFlowers: 400, // ¡Volvemos a alta densidad para que se llene!
        waitTime: 6000
    };

    function startCycle() {
        svg.innerHTML = ''; // Limpieza total
        svg.innerHTML = `
            <defs>
                <radialGradient id="flowerGrad">
                    <stop offset="10%" stop-color="#FFF59D" />
                    <stop offset="95%" stop-color="#FDD835" />
                </radialGradient>
            </defs>
        `;
        // Paso 2: Creamos el árbol y guardamos los puntos de las puntas
        const treeBranchTips = [];
        growTreeAndBloom(treeBranchTips);
    }

    // NUEVA FUNCIÓN DE CRECIMIENTO RECURSIVO INTEGRADO
    function createBranchRecursive(x1, y1, angle, length, width, level, maxLevel, branchTipsArray) {
        if (level >= maxLevel) {
            // Si es una punta final, la guardamos para las flores de densidad
            branchTipsArray.push({ x: x1, y: y1 });
            return;
        }

        const x2 = x1 + Math.cos(angle * Math.PI / 180) * length;
        const y2 = y1 + Math.sin(angle * Math.PI / 180) * length;

        const line = document.createElementNS(NS, "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#4E342E"); // Café oscuro
        line.setAttribute("stroke-width", width);
        line.setAttribute("stroke-linecap", "round");
        
        // Animación de crecimiento de la rama
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        svg.appendChild(line);

        line.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
            duration: 700 + (level * 200), // Ramas principales más lentas
            fill: 'forwards',
            easing: 'ease-in-out'
        });

        // --- FLORECIMIENTO INTEGRADO ---
        // Nace una flor grande exactamente en la punta de cada rama principal que termina de crecer
        setTimeout(() => {
           const animFlower = document.createElementNS(NS, "path");
           // Usamos x2 y y2, las coordenadas finales de la rama
           createSingleOrganicFlower(animFlower, x2, y2, 1.3, 1500);
        }, 600 + (level * 200));

        // Crear dos ramas más pequeñas (hijas) con ángulos que formen corazón
        const angleSpread = 30 + (level * 3); // Aumentamos la apertura arriba
        setTimeout(() => {
            createBranchRecursive(x2, y2, angle - angleSpread, length * 0.72, width * 0.65, level + 1, maxLevel, branchTipsArray);
            createBranchRecursive(x2, y2, angle + angleSpread, length * 0.72, width * 0.65, level + 1, maxLevel, branchTipsArray);
        }, 500 + (level * 150)); // Retraso en cascada
    }

    function createSingleOrganicFlower(f, centerX, centerY, scaleFactor, animDuration) {
        const flowerPath = "M0,0 C-2,-5 -5,-5 -5,0 C-5,5 -2,5 0,0 C2,5 5,5 5,0 C5,-5 2,-5 0,0";
        f.setAttribute("d", flowerPath);
        f.setAttribute("fill", "url(#flowerGrad)");
        f.setAttribute("stroke", "#FBC02D");
        f.setAttribute("stroke-width", "0.2");

        f.setAttribute("transform", `translate(${centerX} ${centerY}) scale(0)`);
        svg.appendChild(f);

        f.animate([
            { transform: `translate(${centerX}px, ${centerY}px) scale(0)`, opacity: 0 },
            { transform: `translate(${centerX}px, ${centerY}px) scale(${scaleFactor}) rotate(${Math.random() * 360}deg)`, opacity: 1 }
        ], {
            duration: animDuration,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Easing corregido
            fill: 'forwards'
        });
    }

    function growTreeAndBloom(branchTips) {
        // Tronco principal: 
        // 180px de altura y se divide en 6 niveles de ramas
        createBranchRecursive(CONFIG.baseX, CONFIG.baseY, -90, 180, 15, 0, 6, branchTips);
        
        // --- FLORECIMIENTO DE RELLENO (Densidad) ---
        // Nace de las puntas finales para que el corazón se vea lleno
        setTimeout(() => {
            // Usamos una ecuación de corazón (Cardioide) guiada por el árbol
            const fillingPoints = getHeartPoints(CONFIG.baseX, CONFIG.baseY - 180 - 60, 13);
            const fillingFlowers = [];
            
            for (let i = 0; i < CONFIG.numFlowers; i++) {
                const targetPoint = fillingPoints[i];
                const animFlower = document.createElementNS(NS, "path");
                // Nacimiento de las flores de relleno
                createSingleOrganicFlower(animFlower, targetPoint.x, targetPoint.y, Math.random() * 1.0 + 0.3, 1200);
                fillingFlowers.push({ el: animFlower, x: targetPoint.x, y: targetPoint.y });
            }
            
            // --- ESCAPE (SE MANTIENE IGUAL, pero con más flores) ---
            setTimeout(() => escape(fillingFlowers), CONFIG.waitTime);
            
        }, 2200); // Florecimiento de relleno tras las ramas principales
    }

    function escape(flowers) {
        flowers.forEach(f => {
            const destX = f.x + (Math.random() - 0.5) * 800;
            const destY = -200;
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
    
    // Función para obtener puntos en la silueta del corazón (Ecuación Cardioide)
    function getHeartPoints(cx, cy, scale) {
        const points = [];
        for (let i = 0; i < CONFIG.numFlowers; i++) {
            const t = (i / CONFIG.numFlowers) * 2 * Math.PI;
            // r controla qué tan lejos del centro está la flor (con aleatoriedad controlada)
            const r = (Math.sqrt(Math.random()) * scale) + (scale * 0.2); 
            
            const xOffset = r * (16 * Math.pow(Math.sin(t), 3));
            const yOffset = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            points.push({ x: cx + xOffset, y: cy + yOffset });
        }
        return points;
    }

    startCycle();
});
