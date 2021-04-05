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

pokedexRoutes.route('/cong/').get(function(req, res) {
  let so1 = req.query.so1;
  let so2 = req.query.so2;
  res.json({'ketQua': Number(so1) +' + '+ Number(so2) +' = '+ (Number(so1) + Number(so2))})
  // res.send('đã nhận câu hỏi cộng 2 số: '+so1+' và '+so2+' ra '+( Number(so1) + Number(so2) ));
  console.log('đã nhận câu hỏi cộng 2 số: '+so1+' và '+so2+' ra '+( Number(so1) + Number(so2) ));
})
pokedexRoutes.route('/tru/').get(function(req, res) {
  let so1 = req.query.so1;
  let so2 = req.query.so2;
  res.json({'ketQua': Number(so1) +' - '+ Number(so2) +' = '+ (Number(so1) - Number(so2))})
  // res.send('đã nhận câu hỏi trừ 2 số: '+so1+' và '+so2+' ra '+( Number(so1) - Number(so2) ));
  console.log('đã nhận câu hỏi trừ 2 số: '+so1+' và '+so2+' ra '+( Number(so1) - Number(so2) ));
})
pokedexRoutes.route('/nhan/').get(function(req, res) {
  let so1 = req.query.so1;
  let so2 = req.query.so2;
  res.json({'ketQua': Number(so1) +' * '+ Number(so2) +' = '+ (Number(so1) * Number(so2))})
  // res.send('đã nhận câu hỏi nhân 2 số: '+so1+' và '+so2+' ra '+( Number(so1) * Number(so2) ));
  console.log('đã nhận câu hỏi nhân 2 số: '+so1+' và '+so2+' ra '+( Number(so1) * Number(so2) ));
})
pokedexRoutes.route('/chia/').get(function(req, res) {
  let so1 = req.query.so1;
  let so2 = req.query.so2;
  res.json({'ketQua': Number(so1) +' / '+ Number(so2) +' = '+ (Number(so1) / Number(so2))})
  // res.send('đã nhận câu hỏi chia 2 số: '+so1+' và '+so2+' ra '+( Number(so1) / Number(so2) ));
  console.log('đã nhận câu hỏi chia 2 số: '+so1+' và '+so2+' ra '+( Number(so1) / Number(so2) ));
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

// var ten = ['Pichu', 'Pikachu', 'Raichu'];

pokedexRoutes.route('/timTen/').get(function(req, res) {
  // let soArrayCuaTen = req.query.soArrayCuaTen;
  // res.send(ten[soArrayCuaTen])
  // if(0>soArrayCuaTen || soArrayCuaTen>=ten.length){
  //   res.json({'ketQuaTenArray':'không có gì'})
  // }
  // else{
  //   res.json({'ketQuaTenArray':ten[soArrayCuaTen]})
  // }

  pokedexModel.find({}, function(err, timPokedex){
    let soArrayCuaTen = req.query.soArrayCuaTen;
    if(0>soArrayCuaTen || soArrayCuaTen>=timPokedex.length){
      // res.json({'ketQuaTenArray':'không có gì'})
      console.log({'ketQuaTenArray':'không có gì'})
    }
    else{
      res.json({'ketQuaTenArray':timPokedex[soArrayCuaTen]})
      console.log({'ketQuaTenArray':timPokedex[soArrayCuaTen]})
    }
  
  })
  


})
pokedexRoutes.route('/timTatCaTen/').get(function(req, res) {
  // res.json({'ketQuaTatCaTenArray':ten})
  // res.send(ten[soArrayCuaTen])
  pokedexModel.find({}, function(err, timPokedex){
    if (err) {
      console.log(err);
    }
    else {
      console.log('đã tìm thấy ' + timPokedex.length + ' Pokemon là: ' + timPokedex)
      res.json(timPokedex)
    }
  })
})

pokedexRoutes.route('/themTen/').get(function(req, res) {
  let tenMoi = req.query.tenMoi;
  console.log(ten)
  ten.push(tenMoi)
  console.log(ten)  
})

