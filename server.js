const express = require("express");
const app = express();
const db = require("./database");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

app.use(cors());
app.use(helmet());

// Adjust the Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow resources from the same origin
      scriptSrc: ["'self'"], // Allow scripts from the same origin
      styleSrc: ["'self'"], // Allow styles from the same origin
      imgSrc: ["'self'", "http://localhost:3000"], // Allow images from localhost
      fontSrc: ["'self'"], // Allow fonts from the same origin
      connectSrc: ["'self'"], // Allow connections to the same origin
    },
  })
);

app.use(bodyParser.json());
app.use(express.static("public")); // Serves your HTML, CSS, JS files

// Route to get all characters
app.get("/api/characters", (req, res) => {
  db.all("SELECT * FROM characters", (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// Route to add a new character
app.post("/api/characters", (req, res) => {
  const { name, race, class: charClass, stats } = req.body;

  // Check if a character with the same name already exists
  const checkQuery = "SELECT * FROM characters WHERE LOWER(name) = LOWER(?)";
  db.get(checkQuery, [name], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    if (row) {
      // If a character with the same name exists, send a 409 Conflict response
      res.status(409).json({ error: "A character with this name already exists." });
      return;
    }

    // If no duplicate, insert the new character
    const insertQuery = "INSERT INTO characters (name, race, class, stats) VALUES (?, ?, ?, ?)";
    db.run(insertQuery, [name, race, charClass, stats], function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).json({ id: this.lastID, name, race, class: charClass, stats });
      }
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle character deletion
app.delete("/api/characters", (req, res) => {
  const deleteQuery = "DELETE FROM characters";
  db.run(deleteQuery, function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json({ message: "All characters deleted successfully.", changes: this.changes });
    }
  });
});
