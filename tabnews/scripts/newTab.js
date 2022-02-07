/*function getNewImage() {
    // 抓取背景圖片
    var url = "https://api.unsplash.com/photos/?client_id=7c26f58e5d970612b7cb394d40c74b0e4232b12ee41dc456ec85fa034f14ca46&per_page=50";

    var utm = "&utm_source=Photo-app&utm_medium=referral";
    
    
    function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            
            
            var response = JSON.parse(this.responseText);
            
            // response 為有 30 個 url 的陣列
            console.log(response);
            
            // 隨機從回傳的陣列中指定一 index
            var index = (Math.floor(Math.random() * response.length) + 1);
            
            // 選定圖片之 index 及其網址
            var string = response[index].urls.full;
            
            var preload_image = document.getElementById("preload");
            
            preload_image.src = string;
            
            preload_image.addEventListener("load", function(){
                document.getElementById("contain").style.backgroundImage = "url('" + preload_image.src + "')"; 
            });
            $("#filter").fadeOut("slow", function(){
                    $("#filter").css({"display" : "none"});
            });
        };
    
        xhr.open("GET", url, true);
        xhr.send();
    }
    
    makeRequest();
}*/


function getCurrentTime() {
    var date = new Date();
    var year = date.getYear() + 1900;
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    
    var monthString, dayString, hourString, minuteString;
    
    if(month < 10){
        monthString = "0" + month.toString();
    } else{
        monthString = month.toString();
    }
    
    if(day < 10){
        dayString = '0' + day.toString();
    } else{
        dayString = day.toString();
    }
    
    if(hour < 10){
        hourString = '0' + hour.toString();
    } else{
        hourString = hour.toString();
    }
    
    if(minute < 10){
        minuteString = '0' + minute.toString();
    } else{
        minuteString = minute.toString();
    }
    
    
    window.document.getElementById("time_screen").innerText = hourString + ' : ' + minuteString;
}

// onLoad 時執行的事件
function loadEvent(){
    setInterval(getCurrentTime, 1000);
    //getNewImage();
}

// 同時讀取 NewImage 與 獲取時間
window.onload = loadEvent;


