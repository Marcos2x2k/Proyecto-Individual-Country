const express = require('express');
const router = express.Router();
// const router = Router();
// const { Router } = require('express');

router.use(express.json())
const axios = require('axios');


// aca defino models y me los traigo de la BD
const { Country, Activity } = require('../db.js')
//const {API_KEY} = process.env; no uso APIKey en esta llamada de API

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// const countriesRouter = require('./countries.js');
// const activitiesRouter = require('./activities.js');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// router.use('/countries', countriesRouter);
// router.use('/activities', activitiesRouter);

const getApiData = async () => {
    try {
        const data = await axios.get('https://restcountries.com/v2/all');
        // .data devuelve la data del get
        const json = data.data;
        for (var i = 0; i < json.length; i++) {
            const [Country, created] = await Country.findOrCreate({
            where: {
                name: json[i].name
            },
            defaults: {
                id: json[i].alpha3Code,
                name: json[i].name,
                flag: json[i].flag,
                region: json[i].region,
                capital: json[i].capital,
                subregion: json[i].subregion,
                area: json[i].area,
                population: json[i].population
            }
            }) 
        }
    } catch(e) {
        console.log(e);
    }
}

// Acá autoinvoco la función para obtener los datos de la API.
getApiData();

const getApiInfo = async () => {
    try{
        const apiHtml = await axios.get('https://restcountries.com/v2/all')
        console.log("lo que trae la API", apiHtml)
        .data devuelve la data del get 
        const apiInfo = apiHtml.data.map(p => {
           return{           
           name: p.name,
           id: p.alpha3Code,
           flag: p.flag,
           region: p.region,
           capital: p.capital,
           subregion: p.subregion,
           area: p.area,
           population: p.population,
           }           
        });
        console.log("lo que trae Api INFO", apiInfo)
        return apiInfo;
    }    
    catch (error){
        console.log("Error en getApiInfo",error)
    }
}

const getDbInfo = async () =>{
    const infoDb = await Country.findAll({
        include:{
            model: Activity,
            attributes: ['name'],
            through:{
                attributes:[],
            }
        }
    })
}

const getAllCountries = async () => {
    try{
        const apiInfo = await getApiInfo();
        const dbInfo = await getDbInfo();
        const totalInfo = apiInfo.concat(dbInfo)
        return totalInfo;
    }
    catch (error){
        console.log("Error en getAllCountries", error)
    }
}

//****** RUTAS BACK ********

router.get('/countries', async (req, res) => { // en countries seria con /
    const name = req.query.name;
    const countryAll = await getAllCountries();
    if (name){
        //con tolowerCase hace que la busqueda en minus/mayusc no afecte al resultado
        const countriesName = await countryAll.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
        countriesName.length? // pregunto si trajo algo
            res.status(200).send(countriesName) :
            res.status(400).send('No existe resultado para la busqueda actual')
    } else {
        res.status(200).send(countryAll)
    }
});


router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    }catch(e){
        res.status(500).send('Server error.')
    }
})

router.get('/countries/:id', async (req, res) =>{
    const id = req.params.id;
    const countriesTotal = await getAllCountries();

    if (id){
        const countriesId = await countriesTotal.filter(p => p.id === id)
        console.log(countriesId)
        countriesId.length ?
            res.status(200).send(countriesId) :
            res.status(400).send("No existe el Country requerido")
    }
})

router.post('/newActivities', async (req, res) => {
    const {name, difficulty, duration, countriesId} = req.body;
    let {seasons} = req.body;
    if ( name && difficulty && duration && countriesId && seasons) {
        try {
            const country = await getAllCountries();
            const activity = await Activity.findOrCreate({
                where:{
                    name: name,
                    difficulty: difficulty,
                    duration: duration,
                    seasons: seasons,
                }
            });
            // Por cada countriesId que recibo, busco el país que lo tiene, y creo el registro en la tabla
            // relacional
            for (var i = 0; i < countriesId.length; i++) {
                const country = await country.find({
                    where: {
                        id: countriesId[i]
                    }
                });
                await activity[0].addCountry(country);
                // activity es un array. El primer elemento es un objeto llamado activity, que tiene los 
                // valores es a ese objeto que le agregamos el país para la tabla relacional.
            }
            res.json('Actividad agregada Exitosamente');
        }catch(e) {
            console.log(e)
            res.status(500).json('Server error.')
        }
    } else {
        res.status(500).json('Tu Actividad no pudo ser Creada');
    }
})

module.exports = router;
