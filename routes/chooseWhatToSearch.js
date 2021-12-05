const express = require('express');
const router = express.Router();
//const userData = require('../data/users');

router.get('/', async (req, res) => {
    res.status(200).render('pages/chooseWhatToSearch', {});
});

module.exports = router;