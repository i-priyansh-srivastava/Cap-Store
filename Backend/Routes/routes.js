const express = require('express');
const router = express.Router();

const {loginUser , signInUser} = require('../Controller/Auth');


router.post('/auth/login', loginUser);
router.post('/auth/signin', signInUser);


module.exports = router;