// Requiring path to so we can use relative routes to our HTML files
const app = require("express");
const router = app.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


router.post("/api/login", (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      // If they cannot find a user
      bcrypt.compare(req.body.password, user.dataValues.password, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: "Somthing wrong!"
          });
        }
        if (result) {
          const token = jwt.sign({
            email: user.dataValues.email,
            id: user.dataValues.id,
            lastName: user.dataValues.lastName,
            firstName: user.dataValues.firstName,
            imageUrl: user.dataValues.imageUrl
          },
            'SecretPasswordNoOneWillEverGuess',
            {
              expiresIn: "1h"
            }
          )
          return res.status(200)
            .json({
              message: "Auth Successful",
              token: token,
              id: user.dataValues.id,
              lastName: user.dataValues.lastName,
              firstName: user.dataValues.firstName,
              imageUrl: user.dataValues.imageUrl
            })
        }
        res.status(401).send({
          message: "Wrong password!"
        })
      })
    }).catch(() => { res.status(401).send({ message: "User not found!" }); });
})


module.exports = router;
