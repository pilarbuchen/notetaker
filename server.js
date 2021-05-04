const fs = require('fs');
const express = require('express');
const PORT = process.env.PORT || 3007;
const app = express();
const path = require('path');
const { dataText } = require("./miniature-eureka/Develop/db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./miniature-eureka/Develop/public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./miniature-eureka/Develop/db/db.json','utf8', function(err, results) {
        console.log('results', JSON.parse(results))
        res.json(JSON.parse(results))
    })
})

app.get('/api/notes/:id', (req, res) => {

    fs.readFile('./miniature-eureka/Develop/db/db.json','utf8', function(err, results) {
        req.body.id = JSON.parse(results).length.toString();

        const result = findById(req.params.id, dataText);
        if (result) {
            
            res.json(result);
        } else {
            res.send(404);
        }
    })
   
});

app.post('/api/notes', (req, res) => {
    console.log('Req. body!!!',req.body )

    fs.readFile('./miniature-eureka/Develop/db/db.json','utf8', function(err, results) {
        req.body.id = JSON.parse(results).length.toString();


        const newText = createText(req.body, JSON.parse(results))
        res.json(newText);
    })
});

function createText(body, textArray) {
    const text = body;
    textArray.push(text);
    fs.writeFileSync(
        path.join(__dirname, './miniature-eureka/Develop/db/db.json'),
        JSON.stringify(textArray , null, 2)
    );
    return text;
}

function findById(id, textArray) {
    const result = textArray.filter(data => data.id === id)[0];
    return result;
}

app.delete('/api/notes/:id', (req, res) => {
  console.log('id to delete', req.params.id)

//   var newNotes = [  {
//     "id": "0",
//     "title": "Hey",
//     "text": "Test text"
//   }]

  
  fs.readFile('./miniature-eureka/Develop/db/db.json','utf8', function(err, results) {
      var oldNotes = JSON.parse(results)
      var newNotes = []
    for (let i = 0; i < oldNotes.length; i++) {
        if(oldNotes[i].id !== req.params.id){
          newNotes.push(oldNotes[i])
        }
        
    }

    fs.writeFileSync(
        path.join(__dirname, './miniature-eureka/Develop/db/db.json'),
        JSON.stringify(newNotes), function(err) {
           
        }   
    );
    res.json(newNotes)
  })


  //console.log('Notes minus the one we detele', newNotes)
 


})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'miniature-eureka/Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'miniature-eureka/Develop/public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });