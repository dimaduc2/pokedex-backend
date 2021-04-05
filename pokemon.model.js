const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//tạo 1 Schema Model (giả)
let pokedexModel = new Schema(
  {
    name: String,
    image: String,
  },
  {collection: 'pokemon'}          //tên của collection trong MongoDB
);
pokedexModel.index({name:'text', image:'text'})
module.exports = mongoose.model('pokemon', pokedexModel);