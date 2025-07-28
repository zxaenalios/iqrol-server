const { DataTypes } = require("sequelize");
const sequelize = require("../configs/postgresqlConnection_config");

const Akun = sequelize.define("akun", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  tanggalLahir: {
    type: DataTypes.DATE,
  },
  tempatLahir: {
    type: DataTypes.STRING,
  },
  alamatRumah: {
    type: DataTypes.STRING,
  },
  sekolah: {
    type: DataTypes.STRING,
  },
  alamatSekolah: {
    type: DataTypes.STRING,
  },
  nomorHandphone: {
    type: DataTypes.STRING,
  },
  peran: {
    type: DataTypes.ENUM('pelajar','pengajar','admin','superadmin'),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Akun;
