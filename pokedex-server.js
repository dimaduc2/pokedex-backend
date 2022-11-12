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

const mysql = require('mysql2')
const connection2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dimaduc',
  database: 'pokedex'
})





connection2.connect(err => {
  if (err) {
    console.log('Server không nói chuyện với SQL được')
  } else {
    console.log('Server đã kết nối với SQL được')
  }
})

pokedexRoutes.route('/timPokeBallSQL/').get(function(req, res) {
  let speed = req.query.speed;
  connection2.query('SELECT * FROM pokeball', (err, rows, fields) => {
    if (err) throw err
    // console.log(rows[0])
    res.send(rows)
  })
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
    }
    else {
      console.log('đã tìm thấy ' + timPokeball.length + ' PokeBall')
      res.json(timPokeball)
    }
  })
  .sort({name:1})

})

pokedexRoutes.route('/timPokeMonSQL/').get(function(req, res) {
  let type = req.query.type;
  console.log('Sức Mạnh: '+type)
  connection2.query('SELECT * FROM pokemon WHERE "'+type+'" MEMBER OF (type)', (err, rows, fields) => {
    if (err) throw err
    console.log(rows.length)
    res.send(rows)
  })
})

pokedexRoutes.route('/pokemon').get(function(req, res) {
  let dbChon = req.query.dbChon
  console.log('sdfsuifhisdfuhru')
  console.log('Đã chọn DB: '+dbChon)
  // MySQL
  if(dbChon==='MySQL'){
    let thuTu = req.query.thuTu;
    let xuoiNguoc = req.query.xuoiNguoc;
    let type = req.query.type;
    console.log(thuTu+' và '+xuoiNguoc+' và sức Mạnh: '+type)
    if(type==='All'){
      connection2.query('SELECT * FROM pokemon                                   ORDER BY ' + thuTu + ' ' + xuoiNguoc, (err, rows, fields) => {
        // if (err) throw err
        // res.send(rows)
        if(err){
          // console.log('Không kết nối được MySQL')
          res.status(503).send('Không kết nối được MySQL')
        }else{
          res.send(rows)
        }
      })
    }
    else{
      connection2.query('SELECT * FROM pokemon WHERE "'+type+'" MEMBER OF (type) ORDER BY ' + thuTu + ' ' + xuoiNguoc, (err, rows, fields) => {
        if (err) throw err
        // console.log(rows[0])
        res.send(rows)
      }) 
    }
  }
  // Mongo
  else if(dbChon==='Mongo'){
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
      //                   }
      //                   else {
      //                     console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
      //                     res.json(timPokedexs)
      //                   }
      //             }).sort({[thuTuPokemon]:1,})

      console.log('Ở trong có số '+thuTuXuoiNguoc)
      if(thuTuXuoiNguoc==='ASC'){
        console.log('1 là xuôi pokemon=xfgfgvghbgh')
        pokedexModel.find({}, function(err, timPokedexs){
          if (err) {
            console.log(err);
            res.status(503).send('Không kết nối được MongoDB')
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
            res.status(503).send('Không kết nối được MongoDB')
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
      // pokedexModel.find({type: typePokemon}, function(err, ketQuaTimPokemon){
      //   // console.log('Đã tìm ra Pokemon liên quan '+typePokemon+' là: '+ketQuaTimPokemon)
      //   res.json(ketQuaTimPokemon)
      // }).sort({[thuTuPokemon]:1,})

      if(thuTuXuoiNguoc==='ASC'){
        pokedexModel.find({type: typePokemon}, function(err, timPokedexs){
          if (err) {
            console.log(err);
            res.status(503).send('Không kết nối được MongoDB')
          }
          else {
            console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
            res.json(timPokedexs)
          }
        }).sort({[thuTuPokemon]:1,})
      }
      else{
        pokedexModel.find({type: typePokemon}, function(err, timPokedexs){
          if (err) {
            console.log(err);
            res.status(503).send('Không kết nối được MongoDB')
          }
          else {
            console.log('đã tìm thấy ' + timPokedexs.length + ' Pokemon')
            res.json(timPokedexs)
          }
        }).sort({[thuTuPokemon]:-1,})
      }

    }
  }
})



pokedexRoutes.route('/timMotPokemon').get(function(req, res) {
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    let ten = req.query.ten
    // connection2.query('SELECT * FROM pokemon WHERE name LIKE "'+ten+'"', (err, rows, fields) => {
    connection2.query('SELECT * FROM pokedex.pokemon WHERE name LIKE "'+ten+'" OR evo_from LIKE "'+ten+'" OR "'+ten+'" MEMBER OF (evo_to)', (err, ketQuaTim, fields) => {
      if (err) throw err
      // console.log(ketQuaTim[0], ketQuaTim[1], ketQuaTim[2])
      var cauTraLoiRoRang={'PKDuocChon': {}, 'PKEvoFrom': {}, 'PKEvoTo': []}
      for(var i=0; i<ketQuaTim.length; i++){
        if(ketQuaTim[i].name===ten){
          // nếu ten có tên Charizard trong ketQuaTim ở đâu thì sẽ đưa thông tin của Charizard vào cauTraLoiRoRang.PKDuocChon
          cauTraLoiRoRang.PKDuocChon=ketQuaTim[i]
          // break
        }
        if(ketQuaTim[i].evo_to.includes(ten)){
          cauTraLoiRoRang.PKEvoFrom=ketQuaTim[i]
        }
        if(ketQuaTim[i].evo_from===ten){
          cauTraLoiRoRang.PKEvoTo.push(ketQuaTim[i])
        }
      }
      console.log(cauTraLoiRoRang)
      res.send(cauTraLoiRoRang)
    })
  }
  // Mongo
  else if(dbChon==='Mongo'){
    let ten = req.query.ten
    console.log(ten)
    pokedexModel.find({$or: [{name: ten}, {evo_from: ten}, {evo_to: ten}]}, function(err, timDuocPokemon){
      // res.json(timDuocPokemon)
      var cauTraLoiRoRang={'PKDuocChon': {}, 'PKEvoFrom': {}, 'PKEvoTo': []}

      for(var i=0; i<timDuocPokemon.length; i++){
        if(timDuocPokemon[i].name===ten){
          cauTraLoiRoRang.PKDuocChon=timDuocPokemon[i]
        }
        if(timDuocPokemon[i].evo_to.includes(ten)){
          cauTraLoiRoRang.PKEvoFrom=timDuocPokemon[i]
        }
        // for(var j=0; j<timDuocPokemon[i].evo_to.length; j++){
        //   if(timDuocPokemon[i].evo_to[j] === ten){
        //     cauTraLoiRoRang.pokemonEvoFrom=timDuocPokemon[i]
        //   }
        // }
        if(timDuocPokemon[i].evo_from===ten){
          cauTraLoiRoRang.PKEvoTo.push(timDuocPokemon[i])
        }
      }
      console.log(cauTraLoiRoRang)
      res.json(cauTraLoiRoRang)
    })
  }
})









// pokedexRoutes.route('/timMotPokemonSQL').get(function(req, res) {
//   let ten = req.query.ten
//   // connection2.query('SELECT * FROM pokemon WHERE name LIKE "'+ten+'"', (err, rows, fields) => {
//   connection2.query('SELECT * FROM pokedex.pokemon WHERE name LIKE "'+ten+'" OR evo_from LIKE "'+ten+'" OR "'+ten+'" MEMBER OF (evo_to)', (err, ketQuaTim, fields) => {
//     if (err) throw err
//     // console.log(ketQuaTim[0], ketQuaTim[1], ketQuaTim[2])
//     var cauTraLoiRoRang={'PKDuocChon': {}, 'PKEvoFrom': {}, 'PKEvoTo': []}
//     for(var i=0; i<ketQuaTim.length; i++){
//       if(ketQuaTim[i].name===ten){
//         // nếu ten có tên Charizard trong ketQuaTim ở đâu thì sẽ đưa thông tin của Charizard vào cauTraLoiRoRang.PKDuocChon
//         cauTraLoiRoRang.PKDuocChon=ketQuaTim[i]
//         // break
//       }
//       if(ketQuaTim[i].evo_to.includes(ten)){
//         cauTraLoiRoRang.PKEvoFrom=ketQuaTim[i]
//       }
//       if(ketQuaTim[i].evo_from===ten){
//         cauTraLoiRoRang.PKEvoTo.push(ketQuaTim[i])
//       }
//     }
//     console.log(cauTraLoiRoRang)
//     res.send(cauTraLoiRoRang)
//   })
// })

// pokedexRoutes.route('/timMotPokemon').get(function(req, res) {
//   let ten = req.query.ten
//   // console.log(ten)timMotPokemon
//   pokedexModel.find({$or: [{name: ten}, {evo_from: ten}, {evo_to: ten}]}, function(err, timDuocPokemon){
//     // res.json(timDuocPokemon)
//     var cauTraLoiRoRang={'pokemonTimThay': {}, 'pokemonEvoFrom': {}, 'pokemonEvoTo': []}

//     for(var i=0; i<timDuocPokemon.length; i++){
//       if(timDuocPokemon[i].name===ten){
//         cauTraLoiRoRang.pokemonTimThay=timDuocPokemon[i]
//       }
//       if(timDuocPokemon[i].evo_to.includes(ten)){
//         cauTraLoiRoRang.pokemonEvoFrom=timDuocPokemon[i]
//       }
//       // for(var j=0; j<timDuocPokemon[i].evo_to.length; j++){
//       //   if(timDuocPokemon[i].evo_to[j] === ten){
//       //     cauTraLoiRoRang.pokemonEvoFrom=timDuocPokemon[i]
//       //   }
//       // }
//       if(timDuocPokemon[i].evo_from===ten){
//         cauTraLoiRoRang.pokemonEvoTo.push(timDuocPokemon[i])
//       }
//     }
//     res.json(cauTraLoiRoRang)
//   })

//   // pokedexModel.find({name: ten}, function(err, timDuocPokemon){
//   //   if(timDuocPokemon[0].evo_from){
//   //     pokedexModel.find({name: timDuocPokemon[0].evo_from}, function(err, timDuocTenEvoFrom){
//   //       console.log(timDuocTenEvoFrom)
//   //       timDuocPokemon.push({image: timDuocTenEvoFrom[0].image, name: timDuocTenEvoFrom[0].name})
//   //       if(timDuocPokemon[0].evo_to.length>0){
//   //         pokedexModel.find({name: timDuocPokemon[0].evo_to}, function(err, timDuocTenEvoTo){
//   //           console.log(timDuocTenEvoTo)
//   //           for(var i=0; i<timDuocPokemon[0].evo_to.length; i++){
//   //             timDuocPokemon.push({image: timDuocTenEvoTo[i].image, name: timDuocTenEvoTo[i].name})
//   //           }
//   //           res.json(timDuocPokemon)
//   //         })
//   //       }else{
//   //         timDuocPokemon.push('')
//   //         res.json(timDuocPokemon)
//   //       }
//   //     })
//   //   }
//   //   else{
//   //     pokedexModel.find({name: timDuocPokemon[0].evo_to}, function(err, timDuocTenEvoTo){
//   //       console.log(timDuocTenEvoTo)
//   //       timDuocPokemon.push('')
//   //       if(timDuocPokemon[0].evo_to.length===0){
//   //         timDuocPokemon.push('')
//   //       }else{
//   //         for(var i=0; i<timDuocPokemon[0].evo_to.length; i++){
//   //           timDuocPokemon.push({image: timDuocTenEvoTo[i].image, name: timDuocTenEvoTo[i].name})
//   //         }
//   //       }
//   //       res.json(timDuocPokemon)
//   //     })
//   //   }
//   // })
    
// })

pokedexRoutes.route('/timThongTinSucKhoePokemon').get(function(req, res) {
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    let thongTinTim = req.query.thongTinTim
    let dauTim = req.query.dauTim
    let soTim = req.query.soTim
                        
    connection2.query('SELECT image, name, number, type, hp, attack, defense, sp_atk, sp_def, speed, heightM, weightKG, evo_from, evo_to FROM pokedex.pokemon WHERE '+thongTinTim + dauTim + soTim, (err, rows, fields) => {
      if (err) {
        console.log(err);
        // res.status(503).send('Không tìm được, do Server không nói chuyện được với Database MySQL')
      }
      else{
        // console.log('Đã tìm: ' + JSON.stringify(rows));
        res.send(rows)
      }
    })
  }
  // Mongo
  else if(dbChon==='Mongo'){
    let thongTinTim = req.query.thongTinTim
    let dauTim = req.query.dauTim
    let soTim = req.query.soTim
    // console.log(thongTinTim + ' ' + dauTim + ' ' + soTim)
    if(dauTim==='='){
      pokedexModel.find({[thongTinTim]: {$eq: soTim}}, function(err, ketQuaTimPokemon){ // bằng
        console.log(ketQuaTimPokemon)
        res.json(ketQuaTimPokemon)
      })
    }
    else if(dauTim==='<'){
      pokedexModel.find({[thongTinTim]: {$lt: soTim}}, function(err, ketQuaTimPokemon){ // nhỏ
        console.log(ketQuaTimPokemon)
        res.json(ketQuaTimPokemon)
      })
    }
    else if(dauTim==='>'){
      pokedexModel.find({[thongTinTim]: {$gt: soTim}}, function(err, ketQuaTimPokemon){ // lớn
        console.log(ketQuaTimPokemon)
        res.json(ketQuaTimPokemon)
      })
    }
  }
})

pokedexRoutes.route('/timPokemon').get(function(req, res) {
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    let tenCanTim = req.query.tenCanTim
    // connection2.query('SELECT name, evo_to, evo_from  FROM pokedex.pokemon WHERE "'+tenCanTim+'" MEMBER OF (evo_to)')
    connection2.query('SELECT image, name, number, type, hp, attack, defense, sp_atk, sp_def, speed, heightM, weightKG, evo_from, evo_to  FROM pokedex.pokemon WHERE name = "' + tenCanTim + '" OR evo_from = "' + tenCanTim + '" OR "'+tenCanTim+'" MEMBER OF (evo_to)', (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(503).send('Không tìm được, do Server không nói chuyện được với Database MySQL')
        console.log('Không tìm được, do Server không nói chuyện được với Database MySQL');
      }
      // if (err) throw err
      else{
        console.log('Đã tìm: ' + JSON.stringify(rows));
        res.send(rows)
      }
    })

  }
  // Mongo
  else if(dbChon==='Mongo'){
    let tenCanTim = req.query.tenCanTim
    let dieuKien = {}
    if(isNaN(tenCanTim)===true){
      dieuKien={$or: [{name : tenCanTim}, {evo_from : tenCanTim}, {evo_to : tenCanTim}]}
    }else{
      dieuKien={$or: [{hp : Number(tenCanTim)}, {attack : Number(tenCanTim)}, {defense : Number(tenCanTim)}, 
              {sp_atk : Number(tenCanTim)}, {sp_def : Number(tenCanTim)}, {speed : Number(tenCanTim)}]}
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
  }

  // let tenCanTim = req.query.tenCanTim
  // let dieuKien = {}
  // if(isNaN(tenCanTim)===true){
  //   dieuKien={$or: [{name : tenCanTim}, {evo_from : tenCanTim}, {evo_to : tenCanTim}]}
  // }else{
  //   dieuKien={$or: [{hp : Number(tenCanTim)}, {attack : Number(tenCanTim)}, {defense : Number(tenCanTim)}, 
  //           {sp_atk : Number(tenCanTim)}, {sp_def : Number(tenCanTim)}, {speed : Number(tenCanTim)}]}
  // }
  // pokedexModel.find(dieuKien, function(err, timDuocTen){
  //   if(timDuocTen.length===0){
  //   console.log('Không có tên trong danh sách')
  //   res.json(timDuocTen)
  //   }else{
  //     console.log(timDuocTen)
  //   res.json(timDuocTen)
  //   }
  // })


  
  // if(isNaN(tenCanTim)===true){

  //   pokedexModel.find({$or: [
    
  //     {name : tenCanTim}, {evo_from : tenCanTim}, {evo_to : tenCanTim}
    
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
      
  //     {hp : Number(tenCanTim)}, {attack : Number(tenCanTim)}, {defense : Number(tenCanTim)}, 
  //     {sp_atk : Number(tenCanTim)}, {sp_def : Number(tenCanTim)}, {speed : Number(tenCanTim)}
      
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

var daCoUaThich = []
pokedexRoutes.route('/tenUaThich').get(function(req, res) {
  let ten = req.query.ten
  console.log('Ten'+ten+'123')
  if(ten){
    daCoUaThich.push(ten)
  }
  res.json(daCoUaThich)
})


// 946
pokedexRoutes.route('/suaArrayMyQSL').get(function(req, res) {
  // connection2.query('SELECT evo_to FROM pokedex.pokemon WHERE id > 984 AND id < 988',(err, rows, fields) => {  
  var soId = 896
  var themSoId = 50
  connection2.query('SELECT type, evo_to, id FROM pokedex.pokemon WHERE id >= '+soId+' AND id < ' + (soId+themSoId),(err, rows, fields) => {
    var tatCaEvaTo = []
    var tatCaType = []
    console.log(rows[0])

    for(let j = 0; j < rows.length; j++){
      // console.log(rows[j].evo_to)
      console.log('Tât cả Pokemon: '+JSON.stringify(rows[j]))
      var evo_toArray = rows[j].evo_to
      console.log('id: ' + JSON.stringify(rows[j].id))
      console.log('evo_to: ' + JSON.stringify(rows[j].evo_to))

      for (let i = 0; i < evo_toArray.length; i++) {
        if(evo_toArray[i]===""){
          evo_toArray.splice(i, 1);
          i--
          // console.log('i = '+i)
          // evo_toArray.splice(i, evo_toArray.length-i);
          // console.log("Vừa xóa 1 cái chống rỗng ở vị trí: " + i)
          // console.log(evo_toArray)
          // break;
        }
      }
      tatCaEvaTo.push(evo_toArray);
  
      var typeArray = rows[j].type
      for (let i = 0; i < typeArray.length; i++) {
        if(typeArray[i]===""){
          typeArray.splice(i, 1);
          i--
          console.log('i = '+i)
        }
      }
      tatCaType.push(typeArray)


    }
    // console.log('Sửa 8 con: '+tatCaEvaTo)
    
    // connection2.query(`UPDATE pokedex.pokemon SET evo_to=  '`+JSON.stringify(evo_toArray)+`' WHERE id > 74 AND id < 78`,(err, rows, fields) => {
    // connection2.query(
    //   // Cách 1
    //   // `UPDATE pokedex.pokemon SET evo_to= '`+
    //   // JSON.stringify(evo_toArray)+`' WHERE id = 985; UPDATE pokedex.pokemon SET evo_to= '`+
    //   // JSON.stringify(evo_toArray)+`' WHERE id = 986; UPDATE pokedex.pokemon SET evo_to= '`+
    //   // JSON.stringify(evo_toArray)+`' WHERE id = 987;`
    //   // Cách 2
    //   // `UPDATE pokedex.pokemon m JOIN (SELECT 985 as id, 90 as _number UNION ALL SELECT 986, 80 UNION ALL SELECT 987, 70) vals ON m.id = vals.id SET number = _number`
    //   // Cách 3
    //   `INSERT INTO pokedex.pokemon (id,evo_to) VALUES (985,'`+JSON.stringify(tatCaEvaTo[0])+`'), (986,'`+JSON.stringify(tatCaEvaTo[1])+`'), (987,'`+JSON.stringify(tatCaEvaTo[2])+`') ON DUPLICATE KEY UPDATE evo_to = VALUES(evo_to);`

    //     ,(err, rows, fields) => {
    //   if(err){
    //     console.log(err)
    //   }

    // })
    
    var thongTinQuery = ``
    console.log('tatCaEvaTo: '+ JSON.stringify(tatCaEvaTo))
    console.log('tatCaType: '+JSON.stringify(tatCaType))
    

    for(let i = 0; i < tatCaEvaTo.length; i++){
      if(i === tatCaEvaTo.length-1){
        thongTinQuery += `(`+(rows[i].id)+`,'`+JSON.stringify(tatCaEvaTo[i])+`','`+JSON.stringify(tatCaType[i])+`')`
      }else{
        thongTinQuery += `(`+(rows[i].id)+`,'`+JSON.stringify(tatCaEvaTo[i])+`','`+JSON.stringify(tatCaType[i])+`'),`
      }
    }

    console.log('Thong tin Query là: '+thongTinQuery)
    connection2.query(
      `INSERT INTO pokedex.pokemon (id,evo_to,type) VALUES`+thongTinQuery+` ON DUPLICATE KEY UPDATE evo_to = VALUES(evo_to), type = VALUES(type);`
      ,(err, rows, fields) => {
        if(err){
          console.log(err)
        }
      }
    )
  })
  
})

pokedexRoutes.route('/suaPokemon/:id').put(function(req, res) {
  console.log('Đã sửa Pokemon')
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    let id = req.params.id
    console.log('Đang sửa id: ' + id + ' và name: ' + req.body.name)
    connection2.query(
      'UPDATE pokedex.pokemon ' + 
      'SET name='+'"'+req.body.name+'"'
      +', number='+req.body.number
      +', image='+'"'+req.body.image+'"'
      +', hp='+req.body.hp
      +', attack='+req.body.attack
      +', defense='+req.body.defense
      +', sp_atk='+req.body.sp_atk
      +', sp_def='+req.body.sp_def
      +', speed='+req.body.speed
      +', heightM='+req.body.heightM
      +', weightKG='+req.body.weightKG
      +', evo_from='+'"'+req.body.evo_from+'"'
      +', type='+`'`+JSON.stringify(req.body.type)+`'`
      +', evo_to='+`'`+JSON.stringify(req.body.evo_to)+`'`
      +'WHERE id LIKE ' + id
      ,     
      (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(503).send('Không thêm được, do Server không nói chuyện được với Database')
      }
      else{
        console.log('Đã sửa name: ' + req.body.name+' và number: '+req.body.number+' và hp: '+req.body.hp);
        // res.json('Đã thêm ' + req.body.name+' và '+req.body.number)
      }
    })
  }
  // Mongo
  else if(dbChon==='Mongo'){
    let id = req.params.id
    console.log('Đang tìm Pokemon có id này: '+ id + ' và ' + req.body.name)
    let pokedexMoi = new pokedexModel(req.body);
    pokedexModel.findByIdAndUpdate(id, req.body, function (err, docs) {
      if (err){
        console.log(err)
      }
      else{
          console.log("Thay đổi thành công", docs);
          res.json("Thay đổi thành công")
      }
    })
  }
})

pokedexRoutes.route('/themPokemonMoi/').post(function(req, res) {
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    console.log('Sẽ thêm Pokenmon mới là: '+req.body.name+' và số của nó là: '+req.body.number+' trong Database')
    //   let pokedexMoi = new pokedexModel(req.body);
    console.log(req.body.type)
    console.log(JSON.stringify(req.body.type))
    connection2.query(
    'INSERT INTO pokedex.pokemon (name, number, image, hp, attack, defense, sp_atk, sp_def, speed, heightM, weightKG, evo_from, type, evo_to) VALUES ('+
    '"'+req.body.name+'"'+', '+req.body.number+', '+'"'+req.body.image+'"'+', '+req.body.hp+', '+req.body.attack+', '+req.body.defense+', '+req.body.sp_atk+', '+
    req.body.sp_def+', '+req.body.speed+', '+req.body.heightM+', '+req.body.weightKG+', '+'"'+req.body.evo_from+'"'+', '+`'`+
    JSON.stringify(req.body.type)+`'`+', '+`'`+JSON.stringify(req.body.evo_to)+`'`
    +')'
    , (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(503).send('Không thêm được, do Server không nói chuyện được với Database')
      }
      else{
        console.log('Đã thêm ' + req.body.name+' và '+req.body.number);
        res.json('Đã thêm ' + req.body.name+' và '+req.body.number)
      }
    })
  }
  // Mongo
  else if(dbChon==='Mongo'){
    console.log('Đã thêm Pokenmon mới: '+req.body.type)
    let pokedexMoi = new pokedexModel(req.body);
    pokedexMoi.save()
    .then(pokedexMoi => {
      if (err) {
        console.log('503: Không lưu vào được Database')
        res.status(503).send('Không lưu vào được Database')
      }
      else{
        console.log('đã cho thêm tên pokemon mới: ' + pokedexMoi);
        res.json('Đã cho thêm pokemon mới: ' + pokedexMoi)
      }
    })
    // .then(pokedexMoi => {
    //   console.log('đã cho thêm tên pokemon mới: ' + pokedexMoi);
    //   res.json('Đã cho thêm pokemon mới: ' + pokedexMoi)
    // })
    // .catch(err => {
    //   console.log('503: Không lưu vào được Database')
    //   res.status(503).send('Không lưu vào được Database')
    // })
  }
})

// pokedexRoutes.route('/themPokemonMoi/').post(function(req, res) {
//   console.log('Đã thêm Pokenmon mới: '+req.body.type)
//   let pokedexMoi = new pokedexModel(req.body);
//   pokedexMoi.save()
//             .then(pokedexMoi => {
//               console.log('đã cho thêm tên pokemon mới: ' + pokedexMoi);
//               res.json('Đã cho thêm pokemon mới: ' + pokedexMoi)
//             })
//             .catch(err => {
//               console.log('503: Không lưu vào được Database')
//               res.status(503).send('Không lưu vào được Database')
//             })
// })

// pokedexRoutes.route('/themPokemonMoiSQL/').post(function(req, res) {
//   console.log('Sẽ thêm Pokenmon mới là: '+req.body.name+' và số của nó là: '+req.body.number+' trong Database')
//   //   let pokedexMoi = new pokedexModel(req.body);
//   console.log(req.body.type)
//   console.log(JSON.stringify(req.body.type))
//   connection2.query(
//   'INSERT INTO pokedex.pokemon (name, number, image, hp, attack, defense, sp_atk, sp_def, speed, heightM, weightKG, evo_from, type, evo_to) VALUES ('+
//   '"'+req.body.name+'"'+', '+req.body.number+', '+'"'+req.body.image+'"'+', '+req.body.hp+', '+req.body.attack+', '+req.body.defense+', '+req.body.sp_atk+', '+
//   req.body.sp_def+', '+req.body.speed+', '+req.body.heightM+', '+req.body.weightKG+', '+'"'+req.body.evo_from+'"'+', '+`'`+
//   JSON.stringify(req.body.type)+`'`+', '+`'`+JSON.stringify(req.body.evo_to)+`'`
//   +')'
//   , (err, rows, fields) => {
//     if (err) {
//       console.log(err);
//       res.status(503).send('Không thêm được, do Server không nói chuyện được với Database')
//     }
//     else{
//       console.log('Đã thêm ' + req.body.name+' và '+req.body.number);
//       res.json('Đã thêm ' + req.body.name+' và '+req.body.number)
//     }
//   })
// })




// pokedexRoutes.route('/themPokemonMoi').get(function(req, res) {
//   let tenMoi = req.query.tenMoi
//   let numberMoi = req.query.numberMoi
//   let typeMoi = req.query.typeMoi
//   let hpMoi = req.query.hpMoi
//   let attackMoi = req.query.attackMoi
//   let defenseMoi = req.query.defenseMoi
//   let sp_atkMoi = req.query.sp_atkMoi
//   let sp_defMoi = req.query.sp_defMoi
//   let speedMoi = req.query.speedMoi
//   let heightMMoi = req.query.heightMMoi
//   let weightKGMoi = req.query.weightKGMoi
//   let evo_FromMoi = req.query.evo_FromMoi
//   let evo_toMoi = req.query.evo_toMoi
//   console.log(tenMoi)
// })

pokedexRoutes.route('/xoaThongTin/:id').delete(function(req, res) {
  let dbChon = req.query.dbChon
  // MySQL
  if(dbChon==='MySQL'){
    let _id = req.params.id
    connection2.query('DELETE FROM pokedex.pokemon WHERE id = ' + _id, (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.status(503).send('Không xóa được, do Server không nói chuyện được với Database')
      }
      else{
        console.log('Đã xóa ' + _id);
        res.json('Đã xóa ' + _id)
      }
    })
  }
  // Mongo
  else if(dbChon==='Mongo'){
    let thuTu = req.query.thuTu
    let id = req.params.id
    pokedexModel.findByIdAndDelete(id, function (err) {
      if (err) {
        console.log(err);
      }
      else{
        console.log('Đã xóa ' + id);
        res.json('Đã xóa ' + id)
        // pokedexModel.find({}, function(err, danhSachSauKhiXoa){
        //   res.json(danhSachSauKhiXoa)
        // }).sort({[thuTu]:1,})
      }
    })
  }
})


