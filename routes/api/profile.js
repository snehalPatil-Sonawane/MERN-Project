const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

router.get('/', (req, res) => res.json({ msg: 'profile Works' }));
