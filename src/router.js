const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username,password} = req.body
    if (!username) return res.status(400).json({error: 'no username'})
    if (!password) return res.status(400).json({error: 'no password'})
    const hash = await bcrypt.hash(password, 10)
    const result = await prisma.user.create({
        data: {
            username: username,
            password: hash
        }
    })
    res.json(result)
});

router.post('/login', async (req, res) => {4
    const {username,password} = req.body
    if (!username) return res.status(400).json({error: 'no username'})
    if (!password) return res.status(400).json({error: 'no password'})
    const hash = await bcrypt.hash(password,10)
    const result = await prisma.user.findUnique({
        where: {
            username: username
        }
        })
    if (!result) return res.status(404).json({error: 'user not found'})
    const auth = await bcrypt.compare(password,result.password)
    if (!auth) return res.status(400).json({error: 'invalid password'})
    const token = await jwt.sign(username,'secret')
    res.json({token: token})

});

module.exports = router;
