const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
let app = express();


let test = async (search) => {
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
    return array
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
    return await test('Jeremy Loops');
  },
};
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/:search', (req,res) => {
  let {search} = req.params
  test(search)
});

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');