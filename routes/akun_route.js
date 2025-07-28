var express = require('express');
var router = express.Router();
const akunController = require("../controllers/akun_controllers")

router.get(
  '/akun',  
  akunController.readData
);

router.post(
  '/akun',  
  akunController.createData
);

router.put(
  '/akun',  
  akunController.updateData
);

router.delete(
  '/akun',  
  akunController.deleteData
);

module.exports = router;
