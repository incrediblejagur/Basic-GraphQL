const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const mongoose = require('mongoose')
const Song = require('./model')
let app = express();

const url = 'mongodb://localhost:27017/testdb'

mongoose.connect(url ,{useUnifiedTopology: true,useNewUrlParser: true}); // establishing the connection
mongoose.connection
.once('open', () => console.log('Connection established'))
.on('error', (error) => {
    console.log('Warning : ' + error); 
});


let getArtistSongs = async () => {
  let a = Song.find({artist:'Jeremy Loops'});
    a.exec((err,docs) => {
    console.log(docs[0].song)
    return docs[0].song;
  })
}

// let mongoAdd = () => {
//   let todo = new jack({breed:'a',age:'5'});

// // let todo = new Dogs({todo_description:'a',todo_responsible:'b',todo_priority:'c',todo_completed:true});
// todo.save()
//     .then(todo => {
//       console.log('added')
//     })
//     .catch(err => {
//       console.log('error')
//     });
//   }
//   mongoAdd()

let getFromItunesAPI = async (search) => {
  let array = [];
   await axios
    .get('https://itunes.apple.com/search?term='+search)
    .then(function (response) {
    let data = response.data.results
    for(let item of data){
      if(item.kind === 'song'){
        array.push(item.trackName)
      }
    }
    });
    let todo = new Song({artist:search,song:array});
    todo.save()
}


// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Query {
    hello: String
    song: [String]
  }
`);

// The root provides a resolver function for each API endpoint
let root = {
  hello: () => 'Hello World',
  song: async () => {
    return await getArtistSongs();
  },
};
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/:search', (req,res) => {
  let {search} = req.params
  getFromItunesAPI(search)
});

// app.get('/', (req,res) => {
//   res.sendFile('./public/index.html')
// })

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');