window.onload = function() { Rotate("album"); };

var easeInOutCubic= function(pos){
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
    return 0.5 * (Math.pow((pos-2),3) + 2);
  };

  var transition = function(el){
    var options = arguments[1] || {},
    begin =  options.begin,//开始位置
    change = options.change,//变化量
    duration = options.duration || 500,//缓动效果持续时间
    ftp = options.ftp || 50,
    onEnd = options.onEnd || function(){},
    ease = options.ease,//要使用的缓动公式
    end = begin + change,//结束位置
    startTime = new Date().getTime();//开始执行的时间
    (function(){
      setTimeout(function(){
        var newTime = new Date().getTime(),//当前帧开始的时间
        timestamp = newTime - startTime,//逝去时间
        delta = ease(timestamp / duration);
        el.style.left = Math.ceil(begin + delta * change) + "px";
        if(duration <= timestamp){
          el.style.left = end + "px";
          onEnd();
        }else{
          setTimeout(arguments.callee,1000/ftp);
        }
      },1000/ftp);  
    })();
  };
  var Rotate = function(id){
    try{document.execCommand("BackgroundImageCache", false, true);}catch(e){};
    var container = document.getElementById(id),
    slide = container.getElementsByTagName("li")[0],
    paginater = container.getElementsByTagName("span")[0],
    links = paginater.getElementsByTagName("a"),
    images = slide.getElementsByTagName("img"),
    length = links.length, aBefore = length, aIndex;
    slide.innerHTML += slide.innerHTML;
    var tip = document.createElement("li");
    tip.style.cssText = "position:absolute;left:0px; text-align:left; font-size:14px; font-weight:bold; bottom:-40px;height:20px;width:380px;padding:10px;color:#fff;background:#fff;";
    slide.parentNode.appendChild(tip);
    if(!+"\v1"){
      tip.style.color = "#369";
      tip.style.filter = "alpha(opacity=67)";
    }else{
      tip.style.cssText += "background: rgba(164, 173, 183, .65);";
    }
    var item  = slide.getElementsByTagName("a"),
    critical = item[length].offsetLeft,//临界值
    distance = critical/length,
    delta = - distance;
    (function(){//实现自动轮换图片
      setTimeout(function(){
        delta = delta - distance;
        if(delta <  -critical){
          delta = - distance;
        }
        aIndex = - delta/distance;
        tip.innerHTML = images[aIndex-1].getAttribute("alt");
        tip.style.bottom = "-40px";
        links[aBefore-1].className = "";
        links[aIndex-1].className = "hover";
        aBefore = aIndex;
        transition(slide,{begin:delta,change:distance,ease:easeInOutCubic,onEnd:function(){
           move(tip);
        }});
        setTimeout(arguments.callee,3000);
      },5000);
    })();
  };
  
  var move = function(el){
    var begin = parseFloat(el.style.bottom),speed = 1;
    el.bottom = begin;
    (function(){
      setTimeout(function(){
        el.style.bottom = el.bottom + speed + "px";//移动
        el.bottom += speed;
        speed *= 1.5;//下一次移动的距离
        if(el.bottom >= 0){
          el.style.bottom = "0px";
        }else{
          setTimeout(arguments.callee,25);//每移动一次停留25毫秒
        }
      },25);
    })();
  };