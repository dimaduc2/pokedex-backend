// đây là Express - Web Server cho website pokedex
const express = require('express');		    //phải mượn Express
const pokedexRoutes = express.Router();	    //tạo Router để nhận tất cả câu hỏi

const app = express();
app.use(express.json())

const cors = require('cors');
app.use(cors());

app.use('/pokedex', pokedexRoutes);		        //bảo Router chỉ nhận câu hỏi bắt đầu ‘/hanhDong

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

pokedexRoutes.route('/timTatCaTen/').get(function(req, res) {
console.log(req.query.thuTu)
  pokedexModel.find({}, function(err, timPokedexs){
    if (err) {
      console.log(err);
      res.json('Không kết nối với MongoDB')
    }
    else {
      console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon là: ' )
      res.json(timPokedexs)
    }
  }).sort({[req.query.thuTu]:1, name:1})
})

pokedexRoutes.route('/xoa/').get(function(req, res) {
  let id = req.query.idMuonXoa;
  console.log(id)
  pokedexModel.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log(err);
    }
    else{
      console.log('đã xóa ' + id);
      // pokedexModel.find({}, function(err, timPokedexs){
      //   res.json(timPokedexs)
      // }).sort({ [req.query.thuTu]:1, name:1})
    }
  })
})

pokedexRoutes.route('/themPokemon/').post(function(req, res) {

  console.log(req.body)
  // res.json(req.body.name+'\n'+req.body.number)
  

  let pokedexMoi = new pokedexModel(req.body);
  
  pokedexMoi.save()
            .then(pokedexMoi => {
              console.log('đã cho thêm tên pokemon mới: ' + pokedexMoi.name);
              res.json(req.body.name+'\n'+req.body.number)
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



