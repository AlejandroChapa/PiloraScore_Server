const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch'); // Cambia aquí

const app = express();
const port = 3000;

// Función que se ejecuta cada 15 minutos y actualiza los datos de 'resultados' desde la API externa
const updateResultados = async () => {
    try {
        const response = await fetch('https://prueba-five-eta.vercel.app/api/resultados');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const resultados = await response.json();
        console.log('Datos de resultados actualizados:');

        fs.writeFile('resultados.json', JSON.stringify(resultados, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar los resultados en el archivo:', err);
            } else {
                console.log('Datos de resultados guardados en resultados.json');
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos de resultados:', error);
    }
};

// Función que se ejecuta cada 15 minutos y actualiza los datos de 'próximos' desde la API externa
const updateProximos = async () => {
    try {
        const response = await fetch('https://prueba-five-eta.vercel.app/api/partidos');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const proximos = await response.json();
        console.log('Datos de próximos partidos actualizados:');

        fs.writeFile('proximos.json', JSON.stringify(proximos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar los próximos partidos en el archivo:', err);
            } else {
                console.log('Datos de próximos partidos guardados en proximos.json');
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos de próximos partidos:', error);
    }
};

// Ejecutar las funciones inmediatamente al iniciar el servidor
updateResultados();
updateProximos();

// Configurar el intervalo para que se ejecuten cada 15 minutos (900,000 milisegundos)
setInterval(updateResultados, 900000);
setInterval(updateProximos, 60000);

// Rutas API
app.get('/resultados', (req, res) => {
    console.log(`Solicitud a la ruta /resultados en: ${new Date().toLocaleString()}`);
    fs.readFile('resultados.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer resultados.json:', err);
            res.status(500).send('Error al leer el archivo de resultados');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/proximos', (req, res) => {
    fs.readFile('proximos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer proximos.json:', err);
            res.status(500).send('Error al leer el archivo de próximos');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
