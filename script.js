document.addEventListener("DOMContentLoaded", () => {
    const counterElement = document.getElementById("flower-counter");
    
    // Configuración de fechas
    const startDate = new Date("2026-03-14T00:00:00");
    const today = new Date();
    
    // Cálculo de diferencia de días
    const diffInTime = today.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)) + 1; // +1 para incluir el día actual

    let totalFlowers = 0;

    // Lógica aleatoria por cada día transcurrido
    for (let i = 0; i < diffInDays; i++) {
        const randomMultiplier = Math.floor(Math.random() * 5) + 1; // Aleatorio entre 1 y 5
        totalFlowers += (1 * randomMultiplier);
    }

    // Mostrar el resultado
    counterElement.innerText = totalFlowers.toLocaleString();
    
    console.log(`Días transcurridos: ${diffInDays}`);
});
