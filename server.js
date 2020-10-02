const path = require("path");
const express = require("express");
// var notes = require('./db/db.json');
const app = express();
const fs = require('fs');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");

const PORT = process.env.PORT || 7095;

//========= Sets up the Express app to handle data parsing========
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// API Routes

//============= POST /api/notes================
// declares notes
var notes = [];
fs.readFile("db/db.json","utf8", (err, data) => {
    // adds data from db.json to the notes array
    notes = JSON.parse(data);
    
});
// Sets up the /api/notes get route
app.get("/api/notes", function(req, res) {
   //returns all saved notes as JSON.
    res.json(notes);
});


app.post("/api/notes", function(req, res) {
   // Receives a new note, adds it to db.json, then returns the new note
// this determines the id for the new note, if the array is empty, it receives 1
    if(notes.length === 0){

        req.body.id = 1;
    }else{
    //   else, the id is 1 + the ID from the end of the array
    for (i = 0; i < notes.length; i++) {
        
          req.body.id = (notes[i]["id"]+ 1);
    }
}
    // add the new note to the array of note objects
    let newNote = (req.body);
    console.log(newNote);
    notes.push(newNote);
    console.log(notes);
    // writes it to the file
    fs.writeFile("db/db.json",JSON.stringify(notes),err => {
        if (err) throw err;
        // updates the page with the new note
        res.json(newNote);
    });

});
// sets up the route to delete notes
app.delete("/api/notes/:id", function(req, res) {
    
    
      notesTest = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    //   filters out the note the user is deleting
      notes = notesTest.filter(function(note) {
        return note.id != req.params.id;
      });
// writes the file without the note
      fs.writeFile("db/db.json", JSON.stringify(notes),err => {
        if (err) throw err;
       
        return true;
      
      });
    //   this updates the page without the deleted note
      let newNote = (req.body);
      // change it back to an array of objects & send it back to the browser (client)
      res.json(newNote);
    
  });


// HTML Routes
app.use(express.static("public"));
// Route to /notes
app.get("/notes", (req,res) =>{
res.sendFile(path.join(__dirname, "public/notes.html"));
})

// Route to the Index
app.get("*", (req,res) =>{
    res.sendFile(path.join(__dirname, "public/index.html"));
    })

app.listen(PORT, () => {
console.log(`server is running on http://localhost:${PORT}/`);
});




    
