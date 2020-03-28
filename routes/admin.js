var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Transfer = require('../models/transfer');

var passport = require('passport');

var Web3 = require('web3')
var conf = require("../config/web3");
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = conf.mnemonic;
var provider = new HDWalletProvider(mnemonic, conf.infura);
var web3 = new Web3(provider);
const WillContract = new web3.eth.Contract(conf.abi, conf.address);
web3.eth.getAccounts().then(accounts => {
  WillContract.options.from = accounts[0];
});




router.use(function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    if (req.user.local.role === 'user') return res.redirect('/users/')
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
});


router.get('/', async function (req, res, next) {
  var users = await User.find({}).where('local.role').equals('user').exec();
  var blockDetails = await web3.eth.getBlock('latest');
  var transfers = await Transfer.find({});

  res.render('admin-dashboard', {
    user: req.user,
    users,
    transfers,
    blockDetails
  });
});

router.get('/wills/:id', async function (req, res, next) {
  var user = await User.findById(req.params.id);
  var wills = await WillContract.methods.getWills(user.local.email).call();

  wills.sort(function (a, b) { return a[1] - b[1] }).map(will => will[1] = (new Date(will[1] * 1000)).toLocaleDateString("en-US"));
  res.render('admin-will', {
    user: user,
    wills
  });
});

router.get('/ban-toggle/:id', async function (req, res, next) {
  var id = req.params.id;
  var user = await User.findById(id);
  user.isBanned = !user.isBanned;
  await user.save();
  res.redirect('/admin/')
});


module.exports = router;
