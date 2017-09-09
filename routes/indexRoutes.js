const express = require('express');
const indexRoutes = express.Router();

indexRoutes.get("/", (req, res) => {
    res.render('home', req.session);
});

module.exports = indexRoutes;