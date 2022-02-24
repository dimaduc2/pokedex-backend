const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//tạo 1 Schema Model (giả)
let pokedexModel = new Schema(
  {
    name: String,
    image: String,
    number: Number,
    type: [String],
    hp: Number,
    attack: Number,
    defense: Number,
    sp_atk: Number,
    sp_def: Number,
    speed: Number,
    heightM: Number,
    weightKG: Number,
    evo_from: String,
    evo_to: [String],
  },
  {collection: 'Pokemon2'}          //tên của collection trong MongoDB
);
pokedexModel.index({name:'text', image:'text'})
module.exports = mongoose.model('pokemon', pokedexModel);