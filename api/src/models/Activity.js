const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty:{
        type: DataTypes.INTEGER,
        validate:{
            min: 1,
            max: 5
        },
        allowNull: false
    },
    duration:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    seasons:{ // estaciones del año
        type: DataTypes.STRING,
        allowNull: false
        //type: DataTypes.ENUM("Verano", "Otoño", "Invierno", "Primavera")
        
    },
  });
};