const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//tạo 1 Schema Model (giả)
let pokeBallModel = new Schema(
  {
    name: String,
    image: String,


    
  },
  {collection: 'Pokeball'}          //tên của collection trong MongoDB
);
pokeBallModel.index({name:'text', image:'text'})
module.exports = mongoose.model('Pokeball', pokeBallModel);