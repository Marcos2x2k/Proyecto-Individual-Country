const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  
  sequelize.define('country', {
    id:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageflag:{
      type: DataTypes.STRING,
      allowNull: true
    },
    capital:{
      type: DataTypes.STRING,
      defaultValue: 'No capital',
      allowNull: false
    },
    subregion:{
      type: DataTypes.STRING,
      allowNull: true
    },
    area:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    population:{
      type: DataTypes.FLOAT,
      allowNull: true
    },
  });
};


// { //SI QUISIERA Q OBVIE LOS ARCHIVOS CREATEAT Y UPDATEAD
//   timestamps: false
// });
