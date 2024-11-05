const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch'); // Cambia aquí

const app = express();
const port = 3000;


// Función que se ejecuta una vez al día y actualiza los datos de 'noticias' desde la API externa
const updateNoticias = async () => {
    try {
        const response = await fetch('https://vercel-pilota-score.vercel.app/api/noticia');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const noticias = await response.json();
        fs.writeFile('noticias.json', JSON.stringify(noticias, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar las noticias en el archivo:', err);
                logError(err);
            } else {
                console.log(`Noticias actualizados: ${new Date().toLocaleString()}`);
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos de noticias:', error);
        logError(error);
    }
};

// Función que se ejecuta cada 15 minutos y actualiza los datos de 'resultados' desde la API externa
const updateResultados = async () => {
    try {
        const response = await fetch('https://vercel-pilota-score.vercel.app/api/resultados');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const resultados = await response.json();
        
        fs.writeFile('resultados.json', JSON.stringify(resultados, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar los resultados en el archivo:', err);
                logError(err);
            } else {
                console.log(`Resultados actualizados: ${new Date().toLocaleString()}`);

            }
        });
    } catch (error) {
        console.error('Error al obtener los datos de resultados:', error);
        logError(error);
    }
};

// Función que se ejecuta cada 15 minutos y actualiza los datos de 'próximos' desde la API externa
const updateProximos = async () => {
    try {
        const response = await fetch('https://vercel-pilota-score.vercel.app/api/partidos');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const proximos = await response.json();
        fs.writeFile('proximos.json', JSON.stringify(proximos, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar los próximos partidos en el archivo:', err);
                logError(err);
            } else {
                console.log(`Proximos actualizados: ${new Date().toLocaleString()}`);

            }
        });
    } catch (error) {
        console.error('Error al obtener los datos de próximos partidos:', error);
        logError(error);
    }
};




// Ejecutar las funciones inmediatamente al iniciar el servidor
updateResultados();
updateProximos();
updateNoticias();

// Configurar el intervalo para que se ejecuten cada 15 minutos (900,000 milisegundos)
setInterval(updateResultados, 86400000/2);
setInterval(updateProximos, 86400000/2);
setInterval(updateNoticias, 86400000/2);

// Rutas API
app.get('/resultados', (req, res) => {
    console.log(`Solicitud a la ruta /resultados en: ${new Date().toLocaleString()}`);
    fs.readFile('resultados.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer resultados.json:', err);
            res.status(500).send('Error al leer el archivo de resultados');
            logError(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/proximos', (req, res) => {
    console.log(`Solicitud a la ruta /proximos en: ${new Date().toLocaleString()}`);
    fs.readFile('proximos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer proximos.json:', err);
            res.status(500).send('Error al leer el archivo de próximos');
            logError(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/noticias', (req, res) => {
    console.log(`Solicitud a la ruta /noticias en: ${new Date().toLocaleString()}`);
    fs.readFile('noticias.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer noticias.json:', err);
            res.status(500).send('Error al leer el archivo de noticias');
            logError(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/pelotas', (req, res) => {
    console.log(`Solicitud a la ruta /pelotas en: ${new Date().toLocaleString()}`);
    fs.readFile('pelotaris.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer noticias.json:', err);
            res.status(500).send('Error al leer el archivo de noticias');
            logError(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get('/frontones', (req, res) => {
    console.log(`Solicitud a la ruta /frontones en: ${new Date().toLocaleString()}`);
    fs.readFile('frontones.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer noticias.json:', err);
            res.status(500).send('Error al leer el archivo de noticias');
            logError(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});




// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const logError = (error) => {
    const timestamp = new Date().toLocaleString(); // Hora local
    const errorMessage = `${timestamp} - ${error}\n`;
    fs.appendFile('errores.txt', errorMessage, (err) => {
        if (err) {
            console.error('Error al registrar el error en el archivo:', err);
        }
    });
};



