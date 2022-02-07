/*chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab){
    var imageString;
    getNewImage(imageString);
    
    let message = {
        url: imageString;
    };
    chrome.tabs.sendMessage(tab.id, message);
}

function getNewImage(string) {
    // 抓取背景圖片
    var url = "https://api.unsplash.com/photos/?client_id=7c26f58e5d970612b7cb394d40c74b0e4232b12ee41dc456ec85fa034f14ca46&per_page=30";
    //var url = "https://api.unsplash.com/photos/?client_id=812193ef71ca946e361ed541979a0cfd91e9419a19235fd05f51ea14233f020a&per_page=30";
    var utm = "&utm_source=Photo-app&utm_medium=referral";
    
    
    function makeRequest() {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var response = JSON.parse(this.responseText);
            console.log(response);
            
            // 隨機從回傳的陣列中指定一 index
            var index = (Math.floor(Math.random() * response.length) + 1);
            
            // 將該圖片取代原圖片
            string = response[index].urls.full;
        };
    
        xhr.open("GET", url, true);
        xhr.send();
    }
    
    makeRequest();
}
*/