// đây là Express - Web Server cho website pokedex
const express = require('express');		    //phải mượn Express
const pokedexRoutes = express.Router();	    //tạo Router để nhận tất cả câu hỏi

const app = express();
app.use(express.json())

const cors = require('cors');
app.use(cors());

app.use('/', pokedexRoutes);		        //bảo Router chỉ nhận câu hỏi bắt đầu ‘/hanhDong

let pokedexModel = require('./pokemon.model');
let pokeBallModel = require('./pokeball.model');

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




pokedexRoutes.route('/pokeball').get(function(req, res) {
  // let nameBall = req.query.nameBall
  // req.params
  // console.log(nameBall)
  // pokeBallModel.find({}, function(err, tatCaThongTinPokeBall){
  //   res.json(tatCaThongTinPokeBall = 'tất cả thông tin PokeBall')
  // })
  pokeBallModel.find({}, function(err, timPokeball){
    if (err) {
      console.log(err);
      res.json('Không kết nối với MongoDB')
    }
    else {
      console.log('đã tìm thấy ' + timPokeball.length + ' PokeBall')
      res.json(timPokeball)
    }
  })
  .sort({name:1})

})



pokedexRoutes.route('/pokemon').get(function(req, res) {
  let typePokemon = req.query.type;
  let thuTuPokemon = req.query.thuTu;
  let thuTuXuoiNguoc = req.query.xuoiNguoc;

  // Nếu muốn tìm tất cả Pokemon 
  if(typePokemon==='all' || typePokemon==='All'){
    console.log(thuTuPokemon)
    // thì bảo MongoDB tìm tất cả không điều kiện
    // pokedexModel.find({}, function(err, timPokedexs){
    //                   if (err) {
    //                     console.log(err);
    //                     res.json('Không kết nối với MongoDB')
    //                   }
    //                   else {
    //                     console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
    //                     res.json(timPokedexs)
    //                   }
    //             }).sort({[thuTuPokemon]:1,})

    console.log('Ở trong có số '+thuTuXuoiNguoc)
    if(thuTuXuoiNguoc==='1'){
      console.log('1 là xuôi pokemon=xfgfgvghbgh')
      pokedexModel.find({}, function(err, timPokedexs){
        if (err) {
          console.log(err);
          res.json('Không kết nối với MongoDB')
        }
        else {
          console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
          res.json(timPokedexs)
        }
      }).sort({[thuTuPokemon]:1,})
    }
    else{
      console.log('-1 là ngược pokemon112356')
      pokedexModel.find({}, function(err, timPokedexs){
        if (err) {
          console.log(err);
          res.json('Không kết nối với MongoDB')
        }
        else {
          console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
          res.json(timPokedexs)
        }
      }).sort({[thuTuPokemon]:-1,})
    }

  }
  // Nếu tìm những Pokemon liên quan đến 1 sức mạnh
  else{
    console.log('Tìm Pokemon theo thứ tự ' + thuTuPokemon + ' và Tìm Pokemon liên quan sức mạnh ' + typePokemon)
    pokedexModel.find({type: typePokemon}, function(err, ketQuaTimPokemon){
      // console.log('Đã tìm ra Pokemon liên quan '+typePokemon+' là: '+ketQuaTimPokemon)
      res.json(ketQuaTimPokemon)
    }).sort({[thuTuPokemon]:1,})

    // if(thuTuXuoiNguoc==='1'){
    //   pokedexModel.find({type: typePokemon}, function(err, timPokedexs){
    //     if (err) {
    //       console.log(err);
    //       res.json('Không kết nối với MongoDB')
    //     }
    //     else {
    //       console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
    //       res.json(timPokedexs)
    //     }
    //   }).sort({[thuTuPokemon]:1,})
    // }
    // else{
    //   pokedexModel.find({type: typePokemon}, function(err, timPokedexs){
    //     if (err) {
    //       console.log(err);
    //       res.json('Không kết nối với MongoDB')
    //     }
    //     else {
    //       console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
    //       res.json(timPokedexs)
    //     }
    //   }).sort({[thuTuPokemon]:-1,})
    // }

  }
})



pokedexRoutes.route('/timPokemon').get(function(req, res) {
  let thongTinCanTim = req.query.thongTinCanTim
  let dieuKien = {}
  
  if(isNaN(thongTinCanTim)===true){
    dieuKien={$or: [{name : thongTinCanTim}, {evo_from : thongTinCanTim}, {evo_to : thongTinCanTim}]}
  }else{
    dieuKien={$or: [{hp : Number(thongTinCanTim)}, {attack : Number(thongTinCanTim)}, {defense : Number(thongTinCanTim)}, 
      {sp_atk : Number(thongTinCanTim)}, {sp_def : Number(thongTinCanTim)}, {speed : Number(thongTinCanTim)}]}
  }

  pokedexModel.find(dieuKien, function(err, timDuocTen){
    if(timDuocTen.length===0){
    console.log('Không có tên trong danh sách')
    res.json(timDuocTen)
    }else{
      console.log(timDuocTen)
    res.json(timDuocTen)
    }
  })

  



  // if(isNaN(thongTinCanTim)===true){

  //   pokedexModel.find({$or: [
    
  //     {name : thongTinCanTim}, {evo_from : thongTinCanTim}, {evo_to : thongTinCanTim}
    
  //   ]}, function(err, timDuocTen){
  //     if(timDuocTen.length===0){
  //     console.log('Không có tên trong danh sách')
  //     res.json(timDuocTen)
  //     }else{
  //       console.log(timDuocTen)
  //     res.json(timDuocTen)
  //     }
  //   })

  // }
  // else{

  //   pokedexModel.find({$or: [
      
  //     {hp : Number(thongTinCanTim)}, {attack : Number(thongTinCanTim)}, {defense : Number(thongTinCanTim)}, 
  //     {sp_atk : Number(thongTinCanTim)}, {sp_def : Number(thongTinCanTim)}, {speed : Number(thongTinCanTim)}
      
  //   ]}, function(err, timDuocTen){
  //     if(timDuocTen.length===0){
  //     console.log('Không có tên trong danh sách')
  //     res.json(timDuocTen)
  //     }else{
  //       console.log(timDuocTen)
  //     res.json(timDuocTen)
  //     }
  //   })

  // }







})



pokedexRoutes.route('/pokemonLen').get(function(req, res) {
  let lenTren = req.query.lenTren;
  console.log(lenTren)
})
pokedexRoutes.route('/pokemonXuong').get(function(req, res) {
  let xuongDuoi = req.query.xuongDuoi;
  console.log(xuongDuoi)
})

pokedexRoutes.route('/pokemon/:idMuonXoa').delete(function(req, res) {
  let id = req.params.idMuonXoa;
  console.log('Đã xóa '+id)
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




pokedexRoutes.route('/pokeball/:idMuonXoa').delete(function(req, res) {
  let id = req.params.idMuonXoa;
  console.log('Đã xóa '+id)
  pokeBallModel.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log(err);
    }
    else{
      console.log('Đã xóa ' + id);
      res.json('Đã xóa')
    }
  })
  // res.json('Đã xóa')
})

pokedexRoutes.route('/pokeball/').post(function(req, res) {
  console.log('Đã thêm '+req.body)
  let pokeballMoi = new pokeBallModel(req.body);
  pokeballMoi.save()
            .then(pokeballMoi => {
              // console.log('đã cho thêm tên pokemon mới: ' + pokeballMoi.name);
              res.json('Đã thêm mới là '+req.body.name+'\n'+'và số là '+req.body.number)
            })
            .catch(err => {
              console.log('Không lưu vào được Database')
              // res.json('err DB')
            })
})

pokedexRoutes.route('/pokeball/:idMuonSua').put(function(req, res) {
    let id = req.params.idMuonSua
    console.log('Tên Pokeball là: '+req.body.name)
    console.log('Đã sửa '+id)
    res.json('Đã sửa')
})


