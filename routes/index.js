var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api', function(req, res, next) {
  let customers = [
    {
      id: 1,
      name: "Rob"
    },
    {
      id: 2,
      name: "Bob"
    }
  ]
  res.json(customers);
});

module.exports = router;
