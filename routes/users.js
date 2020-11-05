const express = require('express');
const router = express.Router();
const User = require('../models/users')
const catchErrors = require('../lib/async-error');

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}


function validateForm(form, options) {
  var id = form.id || "";
  var name = form.name || "";
  var address = form.address || "";
  var birth = form.name || "";
  var email = form.email || "";
  var phone = form.email || "";

  id = id.trim();
  name = name.trim();
  address = address.trim();
  birth = birth.trim();
  name = name.trim();
  email = email.trim();

  if (!id) {
    return 'id is required.';
  }

  if (!name) {
    return 'Name is required.';
  }

  if (!address) {
    return 'address is required.';
  }

  if (!birth) {
    return 'birth is required.';
  }

  if (!phone) {
    return 'phone is required.';
  }

  if (!email) {
    return 'Email is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.password_confirmation) {
    return 'Passsword do not match.';
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', (req, res, next) => {
  res.render('users/new', {messages: req.flash()});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.render('users/edit', {user: user});
}));


router.post('/', catchErrors(async (req, res, next) => {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var id = await User.findOne({id: req.body.id});
  console.log('USER???', id);
  if (id) {
    req.flash('danger', 'user id already exists.');
    return res.redirect('back');
  }
  user = {
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    birth: req.body.birth,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };
  await User.saveUser(user);
  req.flash('success', 'Registered successfully. Please sign in.');
  res.redirect('/');
}));
module.exports = router;
