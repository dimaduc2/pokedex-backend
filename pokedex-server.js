// đây là Express - Web Server cho website pokedex
const express = require('express');		    //phải mượn Express
const pokedexRoutes = express.Router();	    //tạo Router để nhận tất cả câu hỏi

const app = express();
app.use(express.json())

const cors = require('cors');
app.use(cors());

app.use('/', pokedexRoutes);		        //bảo Router chỉ nhận câu hỏi bắt đầu ‘/hanhDong

let pokedexModel = require('./pokemon.model');

const mongoose = require('mongoose');     //phải mượn Mongoose

const PORT = 5400;

mongoose.connect('mongodb+srv://dima:dimaduc@cluster0.ybo8t.mongodb.net/pokedex-db?retryWrites=true&w=majority', { useNewUrlParser: true })
        .catch(error => console.log('không kết nối được với mongoDB: ' + error));
        // nếu không kết nối được thì thông báo lỗi
const connection = mongoose.connection; //  <=> giữa server và DB

// sau đó, mở kết nối để 2 bên nói chuyện
// hiện ra, thông báo là nói chuyện đc rồi
connection.once('open', function() {
  console.log("Đã nói chuyện với MongoDB");  
  
 })



// server bắt đầu nghe và đợi câu hỏi ở phòng PORT 500
app.listen(PORT, function() {		          //chạy Web Server ở địa chỉ phòng này
  console.log("đã bắt đầu server của pokemon đang đợi câu hỏi và ở phòng Port: " + PORT); 
});


pokedexRoutes.route('/').get(function(req, res) {
  res.send('câu trả lời / của router');
  console.log('câu trả lời / của router')
})

app.get('/', (req, res) => {
  res.send('câu trả lời / của app')
  console.log('câu trả lời / của app');
})


pokedexRoutes.route('/inNhieuLan/').get(function(req, res) {
  let ten = req.query.ten;
  let soLan = req.query.soLan;
  // res.send('Có ' + soLan+ ' lần tên ' + ten)
  var text = "";
  var i;
  for(i = 0; i < soLan; i++){
    text += ten+'<br/>';
  }
  res.send(text);
  console.log(text);
})

// pokedexRoutes.route('/pokemon/:name').get(function(req, res) {
//   console.log(req.params.name)
//   pokedexModel.find({name: req.params.name}, function(err, ketQuaTimPokemon){
//     console.log(ketQuaTimPokemon)
//     res.json(ketQuaTimPokemon)
//   })
// })

pokedexRoutes.route('/pokemon/:id').get(function(req, res) {
  console.log(req.params.id)
  pokedexModel.findById(req.params.id, function(err, ketQuaTimPokemonId){
    console.log(ketQuaTimPokemonId)
    res.json(ketQuaTimPokemonId)
  })
})

// pokedexRoutes.route('/pokemon').get(function(req, res) {
//   console.log(req.query.type)
//   pokedexModel.find({type: req.query.type}, function(err, ketQuaTimPokemon){
//     console.log(ketQuaTimPokemon)
//     res.json(ketQuaTimPokemon)
//   })
// })




pokedexRoutes.route('/pokemon').get(function(req, res) {
  let typePokemon = req.query.type;
  let thuTuPokemon = req.query.thuTu;
  if(typePokemon==='all'){
    console.log(thuTuPokemon)
    pokedexModel.find({}, function(err, timPokedexs){
      if (err) {
        console.log(err);
        res.json('Không kết nối với MongoDB')
      }
      else {
        console.log('đã tìm thấy ' + timPokedexs.length)
        res.json(timPokedexs)
      }
    }).sort({[thuTuPokemon]:1, name:1})
  }
  else{
    console.log('Tìm sức mạnh tất cả của Pokemon là '+typePokemon)
    pokedexModel.find({type: typePokemon}, function(err, ketQuaTimPokemon){
      // console.log('Đã tìm ra Pokemon liên quan '+typePokemon+' là: '+ketQuaTimPokemon)
      res.json(ketQuaTimPokemon)
    })
  }
})

pokedexRoutes.route('/pokemon/:idMuonXoa').delete(function(req, res) {
  let id = req.params.idMuonXoa;
  console.log(id)
  pokedexModel.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log(err);
    }
    else{
      console.log('Đã xóa ' + id);
      // pokedexModel.find({}, function(err, timPokedexs){
      //   res.json(timPokedexs)
      // }).sort({ [req.query.thuTu]:1, name:1})
        res.json('Đã xóa')
    }
  })
})

pokedexRoutes.route('/pokemon/').post(function(req, res) {
  
  console.log(req.body)
  // res.json(req.body.name+'\n'+req.body.number)
  
  let pokedexMoi = new pokedexModel(req.body);
  pokedexMoi.save()
            .then(pokedexMoi => {
              // console.log('đã cho thêm tên pokemon mới: ' + pokedexMoi.name);
              res.json('Đã thêm mới là '+req.body.name+'\n'+'và số là '+req.body.number)
            })
            .catch(err => {
              console.log('Không lưu vào được Database')
              res.json('err DB')
            })

  // let tenMoi = req.query.tenMoi;
  // console.log(ten)

  // ten.push(tenMoi)
  // console.log(ten)
})

pokedexRoutes.route('/pokemon/:idMuonSua').put(function(req, res) {
  let id = req.params.idMuonSua;
  // console.log('da xua '+id)
  // console.log(req.body)
  pokedexModel.findById(id, function(err, pokedemonDaSua){
    pokedemonDaSua.name=req.body.name
    pokedemonDaSua.number=req.body.number
    pokedemonDaSua.hp=req.body.hp
    pokedemonDaSua.attack=req.body.attack
    pokedemonDaSua.defense=req.body.defense
    pokedemonDaSua.sp_atk=req.body.sp_atk
    pokedemonDaSua.sp_def=req.body.sp_def
    pokedemonDaSua.speed=req.body.speed
    pokedemonDaSua.heightM=req.body.heightM
    pokedemonDaSua.weightKG=req.body.weightKG
    pokedemonDaSua.evo_from=req.body.evo_from
    pokedemonDaSua.evo_to=req.body.evo_to
    pokedemonDaSua.save()
    res.json('Đã sửa')
  })
  // pokedexModel.find({_id: id}, function(err, ketQuaTimPokedexs){
  //   console.log('Đã tìm pokemon đã chọn '+ketQuaTimPokedexs)
  // })
})
