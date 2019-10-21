const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// let Todo = new Schema({
//     todo_description: {
//         type: String
//     },
//     todo_responsible: {
//         type: String
//     },
//     todo_priority: {
//         type: String
//     },
//     todo_completed: {
//         type: Boolean
//     }
// });

// module.exports = mongoose.model('Todo', Todo);

let Song = new Schema({
    artist: {
        type: String
    },
    song: {
        type: [String]
    }
});
module.exports = mongoose.model('Song', Song);
