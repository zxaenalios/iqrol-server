const { Op } = require("sequelize");
const uuid = require("uuid");
const akun = require("../models/akun_model")

const readData = async function (req, res) {
  try {
    const model = akun
    const start = req.query.start
    const end = req.query.end
    const nama = req.query.nama
    const id = req.query.id
    const peran = req.query.peran
    const search = req.query.search
    const whereClause = {};

    // Filter createdAt berdasarkan start dan end
    if (start && end) {
      whereClause.createdAt = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    } else if (start) {
      whereClause.createdAt = {
        [Op.gte]: new Date(start),
      };
    } else if (end) {
      whereClause.createdAt = {
        [Op.lte]: new Date(end),
      };
    }

    // Filter nama
    if (nama) {
      whereClause.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // Filter id
    if (id) {
      whereClause.id = id;
    }

    // Filter peran
    if (peran) {
      whereClause.peran = peran;
    }

    // Filter search (misalnya ke field message atau description)
    if (search) {
      whereClause[Op.or] = [
        { tanggalLahir: { [Op.like]: `%${search}%` } },
        { tempatLahir: { [Op.like]: `%${search}%` } },
        { alamatRumah: { [Op.like]: `%${search}%` } },
        { sekolah: { [Op.like]: `%${search}%` } },
        { alamatSekolah: { [Op.like]: `%${search}%` } },
        { nomorHandphone: { [Op.like]: `%${search}%` } },''
      ];
    }

    // ambil semua data akun
    const response = await model.findAll({
      where: whereClause
    })
    if (response) {
      res.status(200).send({
        error: 1,
        message: {
          count: response.length,
          name: "akun",
          list: response
        }
      })
    } else {
      throw Error ("error get data akun")
    }
  } catch (error) {
    console.error({
      status: 400,
      error: error.message
    })
    res.status(400).send({
      error: 1,
      message: error.message
    })
  }
}

const createData = async function (req, res) {
  // inisialisasi
  const body = req.body
  const model = akun
  const id = uuid.v7()
  const bodyWithUuid = {
    id: id,
    ...body
  }

  try {
    // simpan data di PostgreSQL
    const create = await model.create(bodyWithUuid)
    // handling error tambah data di PostgreSQL
    if (!create) throw Error(`error create data akun`)
    // kirim response success
    res.status(200).send({
      error: 0,
      message: `success create data akun`,
    })
  } catch (error) {
    if (error.name === 'SequelizeConnectionAcquireTimeoutError') {
      // error timeout di database
      console.error({
        status: 503,
        error: `connection timeout postgresql`
      })
      res.status(503).json({
        error: 1,
        message: `connection timeout postgresql`
      })
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      // error jika id yang akan ditambahkan sudah ada di database (konflik)
      console.error({
        status: 409,
        error: `conflict data akun already exist`
      })
      res.status(409).json({
        error: 1,
        message: `conflict data akun already exist`
      })
    } else {
      console.error({
        status: 400,
        error: error.message
      })
      res.status(400).json({
        error: 1,
        message: error.message
      })
    }
  }
}


const updateData = async function (req, res) {
  // insialisasi
  const model = akun
  const id = req.body.id
  const body = req.body
  const bodyPostgreSQL = body
  try {
    // update data di PostgreSQL
    const [affectedRows, updatedRow] = await model.update(bodyPostgreSQL, {
      where: { id: id },
      returning: true,
      plain: false
    })
    // handling error update data di PostgreSQL
    if (affectedRows == 0) throw Error(`error update data akun`)
    res.status(200).send({
      error: 0,
      message: `success update data akun`,
    })
  } catch (error) {
    if (error.name === 'SequelizeConnectionAcquireTimeoutError') {
      console.error({
        status: 503,
        error: `connection timeout akun`
      })
      res.status(503).json({
        error: 1,
        message: `connection timeout akun`
      })
    } else {
      console.error({
        status: 400,
        error: error.message
      })
      res.status(400).json({
        error: 1,
        message: error.message
      })
    }
  }
}


const deleteData = async function (req, res) {
  // insialisasi
  const model = akun
  const body = req.body
  const ids = body.ids;
  
  try {
    // cek data terminal di PostgreSQL
    const response = await model.findAll({
      where: {
        id: {
          [Op.or]: ids,
        },
      },
    });

    // jika tidak ada di PostgreSQL akan mengembalikan response error
    const avaliableData = response.map(item => item.id);
    const unavailableData = ids.filter(item => !avaliableData.includes(item));
    if (unavailableData.length > 0) throw Error(`data not exist for ids: ${unavailableData}`)
    // hapus data terminal di Redis dan PpostgreSQL
    await model.destroy({ where: { id: ids } });
    // kirim response success
    res.status(200).send({
      error: 0,
      message: `success delete data akun`,
    })
  } catch (error) {
    if (error.name === 'SequelizeConnectionAcquireTimeoutError') {
      console.error({
        status: 503,
        error: `connection timeout postgresql`
      })
      res.status(503).json({
        error: 1,
        message: `connection timeout postgresql`
      })
    } else {
      console.error({
        status: 400,
        error: error.message
      })
      res.status(400).json({
        error: 1,
        message: error.message
      })
    }
  }
}

module.exports = { readData, createData, updateData, deleteData }