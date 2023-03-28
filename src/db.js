const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  database: 'consulta_credito',
  username: 'postgres',
  password: 'postgres',
  // storage: './src/database.sqlite',
  logging: false,
});

const clienteModel = (sequelizeCliente, DataTypes) => {
  const Cliente = sequelizeCliente.define('Clientes', {
    CPF: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Cliente;
};

const consultaModel = (sequelizeConsulta, DataTypes) => {
  const Consulta = sequelizeConsulta.define('Consultas', {
    Valor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    NumPrestacoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Juros: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Montante: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    Prestacoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Consulta;
};

const produto = sequelize.define('Produtos', {
  Codigo: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  Descricao: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  Preco: {
    type: Sequelize.DataTypes.DOUBLE,
    allowNull: false,
  },
});

const cliente = clienteModel(sequelize, Sequelize.DataTypes);
const consulta = consultaModel(sequelize, Sequelize.DataTypes);

cliente.hasMany(consulta, { as: 'Consultas' });
consulta.belongsTo(cliente);

sequelize.sync();

module.exports = {
  cliente,
  consulta,
  produto,
  sequelize,
};
