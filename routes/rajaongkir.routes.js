const express = require("express");
const router = express.Router();
const { init } = require("rajaongkir-node-js");
const request = init("b376e6bdfb065af71fef0be0928d9b0d", "starter");
//const RajaOngkir = require('rajaongkir-nodejs').Starter('API KEY');

router.get("/provinsi", (req, res) => {
  const province = request.get("/province");
  province.then(prov => {
    let js = JSON.parse(prov);
    res.send(js);
  });

  router.get("/kota", (req, res) => {
    const city = request.get("/city");
    city.then(kota => {
      let js = JSON.parse(kota);
      res.send(js);
    });
  });
});

router.get("/cost", (req, res) => {
  if (!req.query.origin) {
    return res.send("no query");
  }
  const cost = request.post("/cost", req.query);
  cost
    .then(item => {
      let js = JSON.parse(item);
      res.send(js);
    })
    .catch(err => console.log(err));
});

module.exports = router;
