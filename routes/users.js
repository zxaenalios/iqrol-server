var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).send({
    error: 0,
    message: {
      count: 1,
      name: "users",
      list: [
        {
          "name": "ali imron",
          "age": "28",
          "address": "Kudus"
        }
      ]

    }
  });
});

module.exports = router;
