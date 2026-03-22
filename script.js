document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONTADOR (Se mantiene igual) ---
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
        trunkHeight: 180, // Mantengo la altura base del tronco
        numFlowers: 350,  // ¡Subimos la densidad para rellenar!
        growTime: 2000,
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
        growTreeAndBloom();
    }

    // --- NUEVA LÓGICA INTEGRADA ---

    function createOrganicBranch(x1, y1, angle, length, width, isMainTip = false) {
        if (length < 15 && !isMainTip) return null; // Límite para ramitas

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
            duration: 800,
            fill: 'forwards',
            easing: 'ease-out'
        });

        // Retornamos las coordenadas de la punta para el nacimiento de flores
        return { x: x2, y: y2 };
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

    function growTreeAndBloom() {
        const trunkCoords = createOrganicBranch(CONFIG.baseX, CONFIG.baseY, -90, CONFIG.trunkHeight, 15, true);
        const trunkTipX = trunkCoords.x;
        const trunkTipY = trunkCoords.y;

        // --- DEFINIR LAS RAMAS PRINCIPALES DEL CORAZÓN ---
        // Obtenemos puntos fijos en el corazón para guiar las ramas
        const heartPoints = getHeartPoints(CONFIG.baseX, CONFIG.baseY - CONFIG.trunkHeight - 40, 10);
        const mainBranchTargets = [];
        // Seleccionamos puntos clave del corazón (izquierda, arriba, derecha, centro)
        const sampleIndices = [0, CONFIG.numFlowers * 0.25, CONFIG.numFlowers * 0.5, CONFIG.numFlowers * 0.75, CONFIG.numFlowers / 2];
        
        // --- RAMAS QUE DEFINEN LA COPA ---
        sampleIndices.forEach((index) => {
            const target = heartPoints[Math.floor(index)];
            if (target) {
                mainBranchTargets.push(target);
                const angle = Math.atan2(target.y - trunkTipY, target.x - trunkTipX) * 180 / Math.PI;
                const length = Math.sqrt(Math.pow(target.x - trunkTipX, 2) + Math.pow(target.y - trunkTipY, 2));
                
                // Crecimiento retardado de las ramas principales
                setTimeout(() => {
                    const tip = createOrganicBranch(trunkTipX, trunkTipY, angle, length * 0.9, 6, true);
                    
                    // --- FLORECIMIENTO DESDE LAS PUNTAS PRINCIPALES ---
                    // Nace una flor grande exactamente en la punta de cada rama principal
                    setTimeout(() => {
                        for(let k = 0; k < 8; k++) { // Racimo en cada punta principal
                           const animFlower = document.createElementNS(NS, "path");
                           createSingleOrganicFlower(animFlower, tip.x, tip.y, 1.5, 1500);
                        }
                    }, 800);
                    
                    // Ramitas secundarias que nacen de las principales
                    setTimeout(() => {
                        createOrganicBranch(tip.x, tip.y, angle - 20, length * 0.3, 3);
                        createOrganicBranch(tip.x, tip.y, angle + 20, length * 0.3, 3);
                    }, 1000);

                }, Math.random() * 500 + 800); // Retraso tras el tronco
            }
        });

        // --- FLORECIMIENTO DE RELLENO (Guiado por el corazón) ---
        setTimeout(() => {
            const fillingPoints = getHeartPoints(CONFIG.baseX, CONFIG.baseY - CONFIG.trunkHeight - 40, 13);
            const fillingFlowers = [];
            
            for (let i = 0; i < CONFIG.numFlowers; i++) {
                const targetPoint = fillingPoints[i];
                const animFlower = document.createElementNS(NS, "path");
                // Nacimiento de las flores de relleno
                createSingleOrganicFlower(animFlower, targetPoint.x, targetPoint.y, Math.random() * 1.2 + 0.3, 1200);
                fillingFlowers.push({ el: animFlower, x: targetPoint.x, y: targetPoint.y });
            }
            
            // --- ESCAPE (SE MANTIENE IGUAL, pero con más flores) ---
            setTimeout(() => escape(fillingFlowers), CONFIG.waitTime);
            
        }, 1800); // Florecimiento de relleno tras las ramas
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

    startCycle();
});
