const express = require('express');
const router = express.Router();
//const userData = require('../data/users');

//go over with mark/ walker to implement search stuff

router.get('/myartists', async (req, res) => {
    res.status(200).render('pages/mypage', {});
});

router.get('/myalbums', async (req, res) => {
    res.status(200).render('pages/mypage', {});
});

router.get('/mysongs', async (req, res) => {
    res.status(200).render('pages/mypage', {});
});
module.exports = router;