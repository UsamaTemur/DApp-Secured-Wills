var express = require('express');
var multer = require('multer');
var router = express.Router();
var path = require('path');
var Web3 = require('web3')
var conf = require("../config/web3");
var HDWalletProvider = require("truffle-hdwallet-provider");
var ipfsAPI = require('ipfs-http-client');
var fs = require('fs');
const Transfer = require('../models/transfer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

var User = require('../models/user');

const MAX_SIZE = 52428800;
//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

var mnemonic = conf.mnemonic;
var provider = new HDWalletProvider(mnemonic, conf.infura);
var web3 = new Web3(provider);
const WillContract = new web3.eth.Contract(conf.abi, conf.address);
web3.eth.getAccounts().then(accounts => {
  WillContract.options.from = accounts[0];
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(' ').join('-'))
  }
})

var upload = multer({
  storage: storage, fileFilter: function (req, file, cb) {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only pdf files are allowed!'));
    }
    cb(null, true);
  }
})



function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    if (req.user.local.role === 'admin') return res.redirect('/admin/')
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
};






/* GET users listing. */
router.get('/', isLoggedIn, async function (req, res, next) {
  var wills = await WillContract.methods.getWills(req.user.local.email).call();
  if (!wills) {
    wills = [];
  }
  wills.sort(function (a, b) { return a[1] - b[1] }).map(will => will[1] = (new Date(will[1] * 1000)).toLocaleDateString("en-US"));
  res.render('user-dashboard', {
    user: req.user,
    wills
  });
});

router.post('/', isLoggedIn, upload.single('will'), async function (req, res, next) {
  const data = fs.readFileSync(req.file.path);
  const dataBuffer = ipfs.types.Buffer.from(data);

  try {
    let results = await ipfs.add(dataBuffer);
    await WillContract.methods.addWill(req.user.local.email, results[0].hash, req.body.title).send();
    res.redirect('/users/');
  } catch (error) {
    console.log(error);
    res.status(500).json('Error: ', JSON.stringify(error));
  }
});


//Getting the uploaded file via hash code.
router.get('/will-ipfs/:id', function (req, res) {

  //This hash is returned hash of addFile router.
  const validCID = req.params.id;

  ipfs.get(validCID, function (err, files) {
    res.contentType("application/pdf");
    res.send(files[0].content);
  })
})

//Getting the uploaded file via hash code.
router.post('/transfer/', isLoggedIn, async function (req, res, next) {
  const toEmail = req.body.toEmail;
  const title = req.body.ttitle;
  const hash = req.body.thash;
  console.log(hash, title);
  if (toEmail) {
    var user = await User.find({}).where('local.email').equals(toEmail).exec();
    if (user.length > 0) {
      await WillContract.methods.transferWill(req.user.local.email, toEmail, hash, title).send();

      const transfer = new Transfer({
        willHash: hash,
        toEmail,
        fromEmail: req.user.local.email,
      });

      await transfer.save();

      await sgMail.send({
        to: req.user.local.email,
        from: 'admin@willblockchain.com',
        subject: 'Will Transfer Successful',
        html: 'Transfering will from your account to ' + toEmail + '<br><br>'
      });

      await sgMail.send({
        to: toEmail,
        from: 'admin@willblockchain.com',
        subject: 'Will Transfer',
        html: 'Will transfered from ' + req.user.local.email + ' to your account. Please login to view the will <br><br>'
      });

      res.redirect('/users/');
    } else {
      var err = new Error('User Not Found');
      err.status = 402;
      next(err);
    }
  }
});

module.exports = router;
