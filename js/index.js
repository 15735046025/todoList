var swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',//前后按钮
    },
    pagination: {
        el: '.swiper-pagination',//轮播点

    },speed:300,
    autoplay:{
        delay:3000
    },
    // pagination: {
    //     el: '.swiper-pagination',
    //     dynamicBullets: true,//轮播点始终居中
    // },
    // pagination: {
    //     el: '.swiper-pagination',
    //     type: 'progressbar',//进度条
    // },

});
var IScroll = new IScroll('.container', {
    scrollbars: true,
    shrinkScrollbars:"scale",
    click:true,
});
var state="project";
//点击新增
$(".add").click(function(){
    $(".mask").show();
    $(".submit").show();
    $(".update").hide();
    $(".inputarea").transition({y:0},500)
});
$(".cancel").click(function(){
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
});
$(".submit").click(function(){
    var val=$("#text").val();

    if(val===""){
        return;
    }
    $("#text").val("");

    var data=getData();

    var time=new Date().getTime();
    data.push({container:val,time,star:false,done:false});

    saveData(data);
    // console.log(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
});
$(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="project";
    render();
})
$(".done").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="done";
    render();
});
$(".update").click(function(){
    var val=$("#text").val();

    if(val===""){
        return;
    }
    $("#text").val("");

    var data=getData();
    var index=$(this).data("index");
    data[index].container=val;
    saveData(data);
    // console.log(data);
    render();
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    })
})
$(".itemlist")
    .on("click",".changestate",function(index,ele){
    var index=$(this).parent().attr("id");
    var data=getData();
    data[index].done=true;
    saveData(data);
    render();
})
    .on("click",".del",function(index,ele){
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1);
        saveData(data);
        render();
    })
    .on("click","span",function(){
    var index=$(this).parent().attr("id");
    var data=getData();
    data[index].star=!data[index].star;
    saveData(data);
    render();
})
    .on("click","p",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val(data[index].container);
        $(".submit").hide();
        $(".update").show().data("index",index);
        // saveData(data);
        // render();
    })
function getData(){
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data){
    localStorage.todo=JSON.stringify(data);
}
function render(){
    var data=getData();
    var str="";
    data.forEach(function(val,index){
        if(state==="project"&&val.done===false){
            str+="<li id="+index+"><p>"+val.container+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">★</span><div class='changestate'>完成</div></li>";
        }else if(state==="done"&&val.done===true){
            str+="<li id="+index+"><p>"+val.container+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">★</span><div class='del'>删除</div></li>";

        }
    });
    $(".itemlist").html(str);
    IScroll.refresh();
    addTouchEvent();
}
render();
function parseTime(time){
    var date=new Date();
    date.setTime(time);
    var year=date.getFullYear();
    var month=setZero(date.getMonth()+1);
    var day=setZero(date.getDay());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var sec=setZero(date.getSeconds());
    return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+sec;
}
function setZero(n){
    return n<10?"0"+n:n;
}
function  addTouchEvent() {
    $(".itemlist>li").each(function(index,ele){
        let hammerObj = new Hammer(ele);
        let sx,movex;
        let max=window.innerWidth/5;
        let state="start";
        let flag=true;//手指离开之后要不要有动画

        hammerObj.on("panstart",function(e){
            sx=e.center.x;
        });
        hammerObj.on("panmove",function(e){
            let cx=e.center.x;
            movex=cx-sx;
            if(movex>0&&state==="start"){
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){
                flag=false;
                return;
            }
            if(Math.abs(movex)>max){
                flag=false;
                state=state==="start"?"end":"start";
                if(state==="end"){
                    $(ele).css("x",-max);
                }else {
                    $(ele).css("x",0);
                }
                return;
            }
            if(state==="end"){
                movex=cx-sx-max;
            }
            flag=true;
            $(ele).css("x",movex);

        });
        hammerObj.on('panend',function(e){
            if(!flag){return}
            if(Math.abs(movex)>max/2){
                $(ele).transition({x:-max});
                state="end";
            }else{
                $(ele).transition({x:0});
                state="start";
            }

        })

    })
}