const express = require('express');
const fs = require('fs');
const router = express.Router();




router.use(express.json());

// const drinksPath = './drinks.json';

// // Check if the drinks file exists, and create it if it doesn't
// if (!fs.existsSync(drinksPath)) {
//   fs.writeFileSync(drinksPath, '[]');
// }

const directoryName = 'jsonData'
const drinksPath = `./${directoryName}/drinks.json`;


// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(`./${directoryName}`)) {
  fs.mkdirSync(`./${directoryName}`);
}

// Check if the drinks file exists, and create it if it doesn't
if (!fs.existsSync(drinksPath)) {
  fs.writeFileSync(drinksPath, '[]');
}
// isLoggedIn
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

// isLoggedOut
function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}


// GET all drinks
router.get('/drinks', (req, res, next) => {
  const drinks = JSON.parse(fs.readFileSync(drinksPath));
  // check if there is nothing in json file
  if (drinks.length === 0) {
    res.status(404).json({ message: 'No drinks found' });
  }
  res.json(drinks);
});

// GET a specific drink by ID
router.get('/drinks/:id', (req, res, next) => {
  const id = req.params.id;
  const drinks = JSON.parse(fs.readFileSync(drinksPath));
  const drink = drinks.find(d => d.id === parseInt(id));
  if (drink) {
    res.json(drink);
  } else {
    res.status(404).json({ message: `Drink with ID ${id} not found` });
  }
});

// POST a new drink
router.post('/drinks', (req, res, next) => {
  const drinks = JSON.parse(fs.readFileSync(drinksPath));
  const newDrink = req.body;
  newDrink.id = drinks.length + 1;
  drinks.push(newDrink);
  fs.writeFileSync(drinksPath, JSON.stringify(drinks));
  res.status(201).json(newDrink);
});

// DELETE a specific drink by ID
router.delete('/drinks/:id', (req, res, next) => {
  const id = req.params.id;
  let drinks = JSON.parse(fs.readFileSync(drinksPath));
  drinks = drinks.filter(d => d.id !== parseInt(id));
  fs.writeFileSync(drinksPath, JSON.stringify(drinks));
  res.sendStatus(204);
});




// GET the form for a new drink
router.get('/add', (req, res, next) => {
  res.render('forms');
});


// POST a new drink
router.post('/drinks', (req, res, next) => {
  const drinks = JSON.parse(fs.readFileSync(drinksPath));
  const newDrink = req.body;
  newDrink.id = drinks.length + 1;
  drinks.push(newDrink);
  fs.writeFileSync(drinksPath, JSON.stringify(drinks));
  res.status(201).json(newDrink);
});



// autenticated
// router.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.status(401).json({ message: 'You are not logged in' });
//   }
// });



// export

module.exports = router;
