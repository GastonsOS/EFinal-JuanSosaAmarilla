const imcCategories = [
    { category: 'Bajo peso', range: [0, 18.4] },
    { category: 'Normal', range: [18.5, 24.9] },
    { category: 'Sobrepeso', range: [25, 29.9] },
    { category: 'Obesidad grado 1', range: [30, 34.9] },
    { category: 'Obesidad grado 2', range: [35, 39.9] },
    { category: 'Obesidad grado 3', range: [40, Infinity] }
];

function calcularIMC(Peso, altura) {
    const imc = Peso / (altura * altura);
    return imc;
}

function getCategory(imc) {
    for (const category of imcCategories) {
        if (imc >= category.range[0] && imc <= category.range[1]) {
            return category.category;
        }
    }
}

const prevResultados = JSON.parse(localStorage.getItem('imcResultados')) || [];
if (prevResultados.length > 0) {
    const prevResultadosDiv = document.createElement('div');
    prevResultadosDiv.innerHTML = '<h2>Resultados Anteriores:</h2>';
    for (const resultado of prevResultados) {
        prevResultadosDiv.innerHTML += `
            <p>
                Peso: ${resultado.peso} kg, Altura: ${resultado.altura} m,
                IMC: ${resultado.imc.toFixed(2)}, Categoría: ${resultado.category}
            </p>`;
    }
    document.body.appendChild(prevResultadosDiv);
}

document.addEventListener('DOMContentLoaded', () => {
    const calcularButton = document.getElementById('calcular');
    const resultadoDiv = document.getElementById('resultado');
    
    calcularButton.addEventListener('click', () => {
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);
        
        if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
            const imc = calcularIMC(peso, altura);
            const category = getCategory(imc);
            
            // Realizar una solicitud Fetch para enviar los datos al servidor
            fetch('/calcular-imc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ peso, altura })
            })
            .then(response => response.json())
            .then(data => {
                resultadoDiv.innerHTML = `Tu IMC es: ${imc.toFixed(2)} (${category}) - Respuesta del servidor: ${data.message}`;
            })
            .catch(error => {
                resultadoDiv.innerHTML = `Tu IMC es: ${imc.toFixed(2)} (${category}) - Error en la solicitud al servidor: ${error}`;
            });

            prevResultados.push({
                peso: peso,
                altura: altura, 
                category,
                imc: imc,
            })
            localStorage.setItem ('imcResultados', JSON.stringify(prevResultados))
        } else {
            resultadoDiv.innerHTML = 'Por favor ingresa valores válidos.';
        }
    });
});