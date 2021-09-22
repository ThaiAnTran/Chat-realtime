var socket=io("http://localhost:3000/")

var user ="";
socket.on("server-send-dk-thanhcong",function(data){
    $("#login").hide(2000);
    $("#formchat").show(2000);
    user=data;
    $("#username").html("<span >"+data+"</span> ");
})
socket.on("server-send-dk-thatbai",function(data){
    alert(`${data} da ton tai`)
})
// hiển thị danh sách phòng
socket.on("server-send-phong",function(data){
    $("#listphong").html("");
    data.forEach(i => {
        $("#listphong").html($("#listphong").html()+`
            <li><div class="d-flex bd-highlight">
                
                <a href="#" onclick=ChonPhong(\'${i}\')  > 
                        <div class="user_info"  >
                        <span >${i}</span>
                        <p>${i} is online</p>
                    </div>
                </a>
            </div></li>
            `
        )  
    });
})
//hiển thị danh sách nguoif dùng
socket.on("server-send-danhsach-user",function(data){
    $("#dsuser").html("");
    //console.log(data);
    for(var i =0;i<data.length;i++){
        if(user!=data[i].Username){
            $("#dsuser").html($("#dsuser").html()+`
                <li><div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <a href="#" onclick=Click(\'${data[i].Username}\')  > 
                         <div class="user_info"  >
                            <span >${data[i].Username}</span>
                            <p>${data[i].Username} is online</p>
                        </div>
                    </a>
                </div></li>
                `
            )
        }
    }

})

// trả về người dùng được chọn để inbox
socket.on("server-send-user-socket",function(data){
    //console.log("du liệ là:"+data);
    $("#chat_with_user").html(`<span>${data}</span>`)
    $("#btnGui").click(function(){
        socket.emit("user-send-noidung-chat",{
            nguoinhan:data,
            noidung:$("#noidung").val()
        })
         
    })
    
    // trả về nội dung do socket gửi
    var time=new Date();
    socket.on("sever-send-noidung-thanhcong",function(data){
        $("#toiNhan").append(` 
        <div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    ${data} 
                    <span class="msg_time">${time.getHours()}:${time.getMinutes()}, Today</span>
                </div>
                <br>
        </div>
        `)
        })
    // trả về nội dung người khác gửi tới
    socket.on("sever-send-noidung-chat",function(data){
        //console.log(data);
        $("#toiNhan").append(`
        <div class="d-flex justify-content-end mb-4" >
            <div class="msg_cotainer_send"  >
                    ${data} 
                <span class="msg_time_send">${time.getHours()}:${time.getMinutes()}, Today</span>
            </div>
            <div class="img_cont_msg">
            <img src="/images/thuong2.jpg" class="rounded-circle user_img_msg">
            </div>
            <br>
        </div>
        `)
    })
})
// trả về phòng
socket.on("server-send-phong-socket",function(data){
    $("#phonghientai").html("");
    //console.log(data); 
    $("#phonghientai").html($("#phonghientai").html()+`
        <li><div class="d-flex bd-highlight">
            
            <a href="#" onclick=ChonPhong(\'${data}\')  > 
                    <div class="user_info"  >
                    <span >${data}</span>
                    <p>${data} is online</p>
                </div>
            </a>
        </div></li>
        `
    )  
})
    
$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
    $('#action_menu_btn_user').click(function () {
        $('.action_menu_user').toggle();
    });
    $("#addgroup").click(function(){
        $('#formAddgroup').toggle();
    })
    $("#login").show();
    $("#formchat").hide();
    // đăng nhập
    $("#btnLogin").click(function(){
        if($("#txtUsername").val()==""){
            alert("không được để trống");
    
        }
        else{
            
        socket.emit("client-send-username-dk",
            $("#txtUsername").val()
        );
        }
    })   
    // tạo nhóm
    $("#addNhom").click(function(){
        socket.emit("client-send-taonhom",$("#txtNhom").val())
         
    })
});
 
function Click(i){
    //console.log("ấc");
    //console.log("mã là: "+i);
    $("#toiNhan").html("")
    socket.emit("client-send-user-inbox",i)
}
function ChonPhong(i){
    $("#toiNhan").html("")
     socket.emit("client-send-chon-nhomchat",i)
}
 