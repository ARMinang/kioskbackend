var express = require("express")
var {fetchSaldo} = require("../utils/fetchSaldo")
var router = express.Router()

router.post("/", (req, res) => {
  let kpj = req.body.input
  fetchSaldo(kpj)
    .then((payload) => {
      res.status(200).send(payload)
    })
    .catch((err) => {
      res.status(404).send(err.message)
    })
})

module.exports = router