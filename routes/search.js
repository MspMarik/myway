const express = require('express');
const router = express.Router();
//const userData = require('../data/users');

router.get('/searchforartists', async (req, res) => {
    res.status(200).render('pages/search', {});
});

router.get('/searchforalbums', async (req, res) => {
    res.status(200).render('pages/search', {});
});

router.get('/searchforsongs', async (req, res) => {
    res.status(200).render('pages/search', {});
});
module.exports = router;