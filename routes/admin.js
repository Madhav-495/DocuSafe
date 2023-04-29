const express = require('express')
const path = require('path')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Moralis = require('moralis').default
const session = require('express-session')
const flash = require('connect-flash')
router.use(flash())
router.use(session({
    secret: 'MADHAVMADHAVMADHAV',
    resave: false,
    saveUninitialized: false
}));
async function main(filepath, filedata) {
    const uploadarray = [
        {
            path: filepath,
            content: fs.readFileSync(filedata, { encoding: 'base64' })
        }


    ]
    try {
        await Moralis.start({
            apiKey: "WLoq4IR3FE2QVbSi5cKGXz9gjYuwUeNeIEtJH5f6hWl9cBi5NIM5YV8cTk01IDCl"
        });

        const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi: uploadarray });

        return response.raw[0].path;
    } catch (e) {
        console.error(e);
    }
}
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
})
const upload = multer({ storage: storage })
const fs = require('fs')

const studentdata = require('../models/student')
const Admin = require('../models/admin')
const Adminauthenticated = require('../config/auth_admin')

router.get('/login', (req, res) => {
    res.render('admin/login', {
        user: req.user
    })
})
router.get('/upload', Adminauthenticated, (req, res) => {

    res.render('admin/upload', { check1: req.flash('success1') })
})
router.post('/upload', async (req, res) => {
    const user = req.user;
    const fileurl = await main(req.file.path, req.file.path)
    const { fileName, fileDescription, hash } = req.body;
    const registrationNumber = req.body.registrationNumber
    var hashed = {
        name: fileName,
        description: fileDescription,
        url: fileurl.split('/public')[0] + '/public' + `/${req.file.filename}`
    }
    const student_info = await studentdata.findOne({ registrationNumber: registrationNumber });

    student_info.hashes.unshift(hashed);
    await student_info.save();
    // console.log("Radha")
    req.flash('success1', 'document uploaded successfully')


    res.render('admin/upload', { check1: "File Uploaded Successfully" })

})
router.post("/login", async (req, res) => {

    try {

        const userdata = await Admin.findOne({ email: req.body.email })

        if (userdata) {
            const checkpassword = (req.body.password === userdata.password);
            console.log("yes")
            if (checkpassword) {

                const token = await userdata.generateAuthToken();
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true,
                })

                res.redirect('/admin/upload')


            }
            else {
                req.flash('error1', 'Password is not correct')
                
                res.redirect('/admin/login')
            }
        }
        else {
            
            req.flash('error', 'Email not registered')
            res.redirect('/admin/login')
        }
    } catch (error) {
        console.log(error);
    }
});
router.get("/logout", Adminauthenticated, async (req, res) => {
    req.user.tokens = [];
    res.clearCookie('jwtoken');
    await req.user.save()
    res.redirect('/admin/login')
});
module.exports = router;