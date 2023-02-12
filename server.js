const express = require("express");
const Mongoose = require("mongoose");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const User = require("./model/User");
const Termek = require("./model/Termek");
const PORT = 3005;
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
  origin: 'http://86.59.230.107:3005',
};

app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.raw({limit: '50mb'}))
app.use("/api/auth", require("./Auth/route"));

connectDB();

async function getTheData() {
  return new Promise((resolve) => {
    Termek.find({})
      .then((termeks) => {
        data = termeks.map((termek) => {
          const container = {};
          container.nev = termek.nev;
          container.ar = termek.ar;
          container.kep = termek.kep;

          return container;
        });
        resolve({ data: data });
      })
      .catch((err) =>
        resolve({ message: "Not successful", error: err.message })
      );
  });
}



app.get("/", async function (req, res) {
  try {
    await getTheData();
  } catch (error) {
    console.error(error);
  }
  res.render("home", {
    data: data,
  });
});

// app.post('/upload', (req, res) => {
//   console.log('Van post!')
//   const nev = req.body.nev;
//   const ar = req.body.ar;
//   const kep = req.body.kep;

//   const termekSchema = new Mongoose.Schema({
//     nev: String,
//     ar: Number,
//     kep: String
//   });

//   Termek.findOne({ nev: nev }, (err, talaltTermek) => {
//     if (talaltTermek) {
//       return res.status(400).send("Már létezik ilyen termék");
//     } else {
//       let ujTermek = new Termek({
//         nev: nev,
//         ar: ar,
//         kep: kep,
//       });

//       ujTermek.save((err) => {
//         if (err) {
//           console.log(err)
//           return res.status(500).send("Hiba a termék mentése közben");
//         }
//         console.log('Sikeres mentés!')
//         return res.status(200).send("Sikeres mentés");
//       });
//     }
//   });
// });

const { check, validationResult } = require("express-validator");

app.post('/upload', [
  check('nev').not().isEmpty().withMessage('A termék neve kötelező'),
  check('ar').not().isEmpty().withMessage('Az ár kötelező'),
  check('ar').isNumeric().withMessage('Az árnak számnak kell lennie'),
  check('kep').not().isEmpty().withMessage('A kép kötelező')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log('Van post!')
  const nev = req.body.nev;
  const ar = req.body.ar;
  const kep = req.body.kep;

  Termek.findOne({ nev: nev }, (err, talaltTermek) => {
    if (talaltTermek) {
      return res.status(400).send("Már létezik ilyen termék");
    } else {
      let ujTermek = new Termek({
        nev: nev,
        ar: ar,
        kep: kep,
      });

      ujTermek.save((err) => {
        if (err) {
          return res.status(500).send("Hiba a termék mentése közben");
        }
        console.log('Sikeres mentés!')
        return res.status(200).send("Sikeres mentés");
      });
    }
  });
});



// app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
// app.get("/basic", userAuth, (req, res) => res.render("user"));


const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
