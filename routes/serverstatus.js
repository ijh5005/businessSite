var express = require('express');
var router = express.Router();

router.get('/error', (req, res, next) => {
  res.send({
    errorCount: 0
  });
});

module.exports = router;
