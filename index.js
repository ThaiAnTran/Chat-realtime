const express=require("express");
const app = express();
const port =3000;
const server = require("http").Server(app);

server.listen(port,function(){
    console.log("chạy host:  http://localhost:"+port);
})

app.use(express.static("public"));
app.set("views","views");
app.set("view engine","ejs");

var io = require("socket.io")(server);

var arrayUser =[];
io.on("connection",function(socket){
        console.log("user connect: "+socket.id);
        // đăng ký tài khoản người dùng
    socket.on("client-send-username-dk",function(data){
        //console.log(arrayUser.length);
            socket.Username=data;
        if(arrayUser.length<=0){
            arrayUser.push(new userNew(socket.id,data));
            
            socket.emit("server-send-dk-thanhcong",data); 
            
            //console.log(arrayUser[i].IdUser); 
            // show danh sach ngươi dùng
            io.sockets.emit("server-send-danhsach-user",arrayUser)
        }else{
                
            for(var i=0;i<arrayUser.length;i++){
                
                if(arrayUser[i].Username!=data){

                    arrayUser.push(new userNew(socket.id,data));
                    socket.Username=data;
                    socket.emit("server-send-dk-thanhcong",data); 
                    
                    //console.log(arrayUser[i].IdUser); 
                    // show danh sach ngươi dùng
                    io.sockets.emit("server-send-danhsach-user",arrayUser);
                    break;
                    
                }else{
                   // console.log("vô đây chi");
                    socket.emit("server-send-dk-thatbai",data);
                    break;
                }
            }
        }
    });
    //click chọn user để nhắn tin
    socket.on("client-send-user-inbox",function(data){
        //
        //socket.join(data+"+"+socket.Username);
        socket.emit("server-send-user-socket",data); 
        //console.log(arrayUser);
        //console.log(Object.fromEntries(socket.adapter.rooms));
    
        // gửi nội dung
        socket.on("user-send-noidung-chat",function(data){
            //console.log(data);
            var nguoinhan=data.nguoinhan;
            var noidung=data.noidung;

            for(var i=0;i<arrayUser.length;i++){
                if(arrayUser[i].Username==nguoinhan){
                // console.log(arrayUser[i].Username+socket.Username);  
                    socket.join(arrayUser[i].Username+socket.Username) ;
                    var rooms=Object.fromEntries(socket.adapter.rooms);  
                    //console.log(rooms);
                    //io.sockets.in(socket.id).emit("sever-send-noidung-thanhcong",noidung)
                    socket.emit("sever-send-noidung-thanhcong",noidung)
                    io.to(arrayUser[i].IdUser).emit("sever-send-noidung-chat",noidung)
                }
            }
        })
    })
    // tạo nhóm
    var arrPhong=[];
    socket.on("client-send-taonhom",function(data){
        //console.log(data);
        socket.join(data);
        socket.TenPhong=data;
        arrPhong=[];
        var phongs=Object.fromEntries(socket.adapter.rooms);
        // duyệt lấy mảng id user
        var mang=[];
        for(var j =0;j<arrayUser.length;j++){
            mang.push(arrayUser[j].IdUser);
        }
        //console.log(mang);
        for(i in phongs){
            // kiểm tra tồn tại mã id trong mảng user ko
            // nếu có thì ko thêm vào danh sách phòng để danh sách phòng chỉ chứa tên mà client tạo
            var index= mang.indexOf(i);
            if(index<0){
                
            arrPhong.push(i)
            }
        }
       // console.log(arrPhong);
        //console.log(phongs);
        io.sockets.emit("server-send-phong",arrPhong);
        socket.emit("server-send-phong-socket", socket.TenPhong);
    })
    // send all rooms
    io.sockets.emit("server-send-phong",arrPhong);
    // click chọn nhóm để chat
    socket.on("client-send-chon-nhomchat",function(data){
        socket.join(data);
        socket.emit("server-send-user-socket",data);
        socket.on("user-send-noidung-chat",function(data){
            //console.log(data);
            var nguoinhan=data.nguoinhan;
            var noidung=data.noidung;

            socket.emit("sever-send-noidung-thanhcong",noidung)
            socket.broadcast.in(nguoinhan).emit("sever-send-noidung-chat",noidung)
            
        })
    }) 
    // kết thúc phiên đăng nhập
    socket.on("disconnect",function(){
        
        console.log("user disconnected: "+socket.id); 
        for(var i =0 ; i<arrayUser.length;i++){
                
            if (arrayUser[i].IdUser==socket.id) {
                arrayUser.splice(arrayUser[i].IdUsser, 1);
                socket.broadcast.emit("server-send-danhsach-user",arrayUser)
            } 
        }
    })
})

function userNew(IdUser,Username){
    this.IdUser=IdUser;
    this.Username = Username;
}

app.get("/",(req,res)=>{  
    res.render("home")
})