/* Cookie Handler */

/*重複點擊防呆*/
var src_count = [];

function setCookie(key, value, expireTime){
    var date = new Date();
    date.setTime(date.getTime() + (expireTime * 24 * 60 * 60 * 1000));
    
    var expires = "expires=" + date.toGMTString();
    document.cookie = key + "=" + value + "; " + expires;
}

function getCookie(key){
    var name = key + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        
        if (c.indexOf(name)==0){
            return c.substring(name.length,c.length); 
        }
    }
    return "";
}

$(document).ready(function() {

    /* Load the Cookie msg */
    read_User_Setting();
    
    /* Initialize Animation */
    new WOW().init();
    
    /* According selected category to create News in Home Page */
    create_Home_Page();
    
    /* Implement when Navbar is used */
    navbar_Action();
    
    /* When search_bar || btn is onclicked */
    home_Page_Action(); 
    
    report_msg();
    
    create_chart_1();
    create_chart_2();
});

/* Load the Cookie msg */
function read_User_Setting(){
    var greet_msg = getCookie("greet_msg");
    
    /* If Cookie is still uncreated, giving default value */
    if(greet_msg == ""){
        setCookie("bg_img", "", 9999);
        setCookie("greet_msg", "WELCOME TO TABNEWS", 9999);
        setCookie("toolTip", "true", 9999);
        setCookie("category_1", "國際", 9999);
        setCookie("category_2", "社會", 9999);
        setCookie("category_3", "體育", 9999);
        chrome.storage.local.set({"bg_img" : "../defaultImage/default_background.jpg"}, function(){
        });
        
        $("#page_list").empty();
        location.reload();
    }
    var background_image = getCookie("bg_img");
    /* Cookie has limited storage. Therefore, using Chrome API to store base64 img msg */
    chrome.storage.local.get(null, function(items){
        for (key in items) {
            if (key == "bg_img"){
                    document.getElementById("introduction").style.backgroundImage = "url(" + items[key] + ")";
            }
        }
    });
    
    document.getElementById("greeting").placeholder = greet_msg;
    document.getElementById("set_greet_message").value = greet_msg;
    
    if (getCookie("toolTip") == "true"){
        document.getElementById("toolTip").checked = true;
        
        var home = document.getElementById("homePageBlock");
        var time = document.getElementById("time_screen");
        var google_search = document.getElementById("searchBlock");
        var news_search = document.getElementById("searchBar");
        var setting = document.getElementById("settingBlock");
        var report = document.getElementById("reportBlock");
        
        home.setAttribute("data-toggle", "tooltip");
        home.setAttribute("data-placement", "bottom");
        home.setAttribute("title", "主畫面");
        
        time.setAttribute("data-toggle", "tooltip");
        time.setAttribute("data-placement", "bottom");
        time.setAttribute("title", "時間");
        
        google_search.setAttribute("data-toggle", "tooltip");
        google_search.setAttribute("data-placement", "bottom");
        google_search.setAttribute("title", "google 搜尋");
        
        news_search.setAttribute("data-toggle", "tooltip");
        news_search.setAttribute("data-placement", "bottom");
        news_search.setAttribute("title", "新聞搜尋");
        
        setting.setAttribute("data-toggle", "tooltip");
        setting.setAttribute("data-placement", "bottom");
        setting.setAttribute("title", "設定");
        
        report.setAttribute("data-toggle", "tooltip");
        report.setAttribute("data-placement", "bottom");
        report.setAttribute("title", "問題回報");
        
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
    else{
         document.getElementById("toolTip").checked = false;
    }
    document.getElementById("image_str").innerText = getCookie("img_str");
    document.getElementById("category_1").selectedIndex = get_categoryIndex(getCookie("category_1"));
    document.getElementById("category_2").selectedIndex = get_categoryIndex(getCookie("category_2"));
    document.getElementById("category_3").selectedIndex = get_categoryIndex(getCookie("category_3"));

    /* Navbar search_bar is used for searching news */
    news_search_action();
}

/* Implement when Navbar is used */
function navbar_Action(){
    /* Setting Page */
    var category_1 = document.getElementById("category_1");
    var category_2 = document.getElementById("category_2");
    var category_3 = document.getElementById("category_3");
    var category_1_text = category_1.options[category_1.selectedIndex].text;
    var category_2_text = category_2.options[category_2.selectedIndex].text;
    var category_3_text = category_3.options[category_3.selectedIndex].text;
    var txt = "";

    category_1.onchange = category_1_onchange;
    function category_1_onchange(){
        category_1_text = category_1.options[category_1.selectedIndex].text;
    }
    
    category_2.onchange = category_2_onchange;
    function category_2_onchange(){
        category_2_text = category_2.options[category_2.selectedIndex].text;
    }
    
    
    category_3.onchange = category_3_onchange;
    function category_3_onchange(){
        category_3_text = category_3.options[category_3.selectedIndex].text;
    }   
    
    /* Implement when "Reset" image button onclicked */
    var reset_img = document.getElementById("reset_image");
    reset_img.onclick = resetImage;
    function resetImage(){
        txt = "../defaultImage/default_background.jpg";
        document.getElementById("image_str").innerText = "預設圖片";
    }
    
    document.getElementById("setting_image").onchange = function(event){
        var fr = new FileReader();
        
        fr.onload = function (e){
            txt = e.target.result;
        }
        fr.readAsDataURL(event.srcElement.files[0]);
        var short_img_str = document.getElementById("image_str").innerText;
        if (short_img_str.length > 35){
            document.getElementById("image_str").innerText = short_img_str.substring(0, 35) + "...";
        }
    }
    
    /* Implment the action when "Confirm" btn is onclicked */
    var checkBox = document.getElementById("toolTip");
    var confirm = $("#confirm-setting");
    confirm.on("click", function(){
        /* Remind user that there is a category has been selected */
        if((category_1_text == category_2_text) || (category_2_text == category_3_text) || (category_1_text == category_3_text)){
            
            var alert_msg = document.getElementById("alert-setting");
            alert_msg.innerText = "輸入重複的種類";
            alert_msg.style.visibility = "visible";
            setTimeout(function(){
                alert_msg.style.visibility = "hidden";
            }, 3000);
           
        }
        else{
            // Storing base64 msg
            if (txt != ""){
                chrome.storage.local.set({"bg_img" : txt}, function(){});
            }
            setCookie("img_str", document.getElementById("image_str").innerText, 9999);
            setCookie("greet_msg", document.getElementById("set_greet_message").value, 9999);
            
            if (checkBox.checked == true){
                setCookie("toolTip", "true", 9999);
            }
            else{
                setCookie("toolTip", "false", 9999);
            }
            
            setCookie("category_1", category_1_text, 9999);
            setCookie("category_2", category_2_text, 9999);
            setCookie("category_3", category_3_text, 9999);
            $("#page_list").empty();
            location.reload();
        }
    });
}

/* Navbar search_bar is used for searching news */
function news_search_action(){
    var nav_search_bar = document.getElementById("searchBar");
    nav_search_bar.onkeypress = getInputKeyword;
    function getInputKeyword(event){
        if (event.keyCode == 13){
            var value = nav_search_bar.value;
            if (value != ""){
                get_Search_News(value);
            }
        }
    }
    
    $("#newsSearch").click(function(){
        var value = document.getElementById("greeting").value;
        if(value != ""){
            get_Search_News(value);
        }
    });
    
    $("#searchButton").click(function(){
        var value = nav_search_bar.value;
        if (value != ""){
            get_Search_News(value);
        }
    });
}

/* Home Page 設定 */
function home_Page_Action(){
    
    /* google 搜尋框 */
    var search_bar = document.getElementById("greeting");
    search_bar.onkeypress = getInputString;
    function getInputString(event){     
        if (event.keyCode == 13){
            var value = search_bar.value;
            if (value != ""){
                var search_str = "https://www.google.com/search?q=" + value;
                window.location.href = search_str;    
            }
        }
    }
    $("#googleSearch").click(function(){
        var value = search_bar.value;
        if (value != ""){
            var search_str = "https://www.google.com/search?q=" + value;
            window.location.href = search_str;    
        }
    });
    
    /* 選單 highlight 選擇項目 */
    var category = $(".category a");
    
    category.on("mouseover", function(){
        /* 當滑鼠經過，標題放大效果 */
        $(this).addClass("active");
    });
    
    category.on("mouseout", function(){
        /* 當滑鼠離開，標題恢復原樣 */
        category.removeClass("active");
    });
    
    category.on("click", function(){
        /* 建立相應種類名稱頁面 */
        
        create_Category_Page($(this).text());
    });
    
    /* 主畫面按鈕 */
    var home = $(".home-page");
    home.on("click", function(){
        category.removeClass("active");
        $("#page_list").empty();
        location.reload();
    });
}

function create_Home_Page(){
    var category_1_cookie = getCookie("category_1");
    var category_2_cookie = getCookie("category_2");
    var category_3_cookie = getCookie("category_3");
    
    /* category_1 title */
    document.getElementById("category_1_title").innerText = category_1_cookie;
    document.getElementById("category_2_title").innerText = category_2_cookie;
    document.getElementById("category_3_title").innerText = category_3_cookie;
    /* category_1 link */
    $("#category_1_link").on("click", function(){
        create_Category_Page(category_1_cookie);
    });
    
    $("#category_2_link").on("click", function(){
        create_Category_Page(category_2_cookie);
    });
    
    $("#category_3_link").on("click", function(){
        create_Category_Page(category_3_cookie);
    });
    
    /* 取得 category_1 中最新 5 則新聞 */
    get_Top5_News(category_1_cookie, "category_1");
    get_Top5_News(category_2_cookie, "category_2");
    get_Top5_News(category_3_cookie, "category_3");
}

/* 製作主頁面推薦新聞列表 */
function get_Top5_News(category, category_str){
    
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/home_page.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/home_page.php";
    var requestData = {category: category};
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function(response){
            // 回傳 json 資料
            var jsonObject = JSON.parse(response);

            document.getElementById(category_str + "_1_title").innerText = jsonObject[0]["news_title"];
            document.getElementById(category_str + "_2_title").innerText = jsonObject[1]["news_title"];
            document.getElementById(category_str + "_3_title").innerText = jsonObject[2]["news_title"];
            document.getElementById(category_str + "_4_title").innerText = jsonObject[3]["news_title"];
            
            create_News_Modal(category_str +"_1_modal", jsonObject[0]);
            create_News_Modal(category_str +"_2_modal", jsonObject[1]);
            create_News_Modal(category_str +"_3_modal", jsonObject[2]);
            create_News_Modal(category_str +"_4_modal", jsonObject[3]);
         
            function error_img(){
                this.onerror = null;
                this.src = "../defaultImage/no_image_replace.jpg";
            }
            
            //if(check_news_img(jsonObject[0]['news_img']) == "true"){
                document.getElementById(category_str + "_1_img").onerror = error_img;
                document.getElementById(category_str + "_1_img").src = jsonObject[0]['news_img'];
            //}
            /*else{
                // 預設該新聞網圖片
                document.getElementById(category_str + "_1_img").src = "../defaultImage/no_image_replace.jpg";
            }*/
            
            //if(check_news_img(jsonObject[1]['news_img']) == "true"){
            document.getElementById(category_str + "_2_img").onerror = error_img;
                document.getElementById(category_str + "_2_img").src = jsonObject[1]['news_img'];
            //}
            /*else{
                // 預設該新聞網圖片
                document.getElementById(category_str + "_2_img").src = "../defaultImage/no_image_replace.jpg";
            }*/
            
            //if(check_news_img(jsonObject[2]['news_img']) == "true"){
            document.getElementById(category_str + "_3_img").onerror = error_img;
                document.getElementById(category_str + "_3_img").src = jsonObject[2]['news_img'];
            //}
            /*else{
                // 預設該新聞網圖片
                document.getElementById(category_str + "_3_img").src = "../defaultImage/no_image_replace.jpg";
            }*/
            
            //if(check_news_img(jsonObject[3]['news_img']) == "true"){
            document.getElementById(category_str + "_4_img").onerror = error_img;
                document.getElementById(category_str + "_4_img").src = jsonObject[3]['news_img'];
            //}
            /*else{
                // 預設該新聞網圖片
                document.getElementById(category_str + "_4_img").src = "../defaultImage/no_image_replace.jpg";
            }*/
        },
        error: function(response){
            // 網路未正常連結
            $("#networkWarning").modal("show");
        }
    });
}

function get_Search_News(search_str){
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/total_search_page.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/total_search_page.php";
    var requestData = {search: search_str};
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function(response){
            var searchNewsCnt = JSON.parse(response);
            create_Pagination(searchNewsCnt, search_str, "search");
            create_Search_News(search_str, 1)
        }
    });
}
    

function create_Search_News(search_str, page){
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/search_single_page.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/search_single_page.php";
    var requestData = {
        search: search_str,
        page: page
    };
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function(response){
            var jsonObject = JSON.parse(response);

            $("#content_container").empty();
            $("#modal_generator").empty();
            var title_container = document.getElementById("category_title");
            var title_block = document.createElement("div");
            title_block.className = "block";
            title_container.innerText = '"' + search_str + '" 的結果';
            
            news_Card_Group(0, jsonObject[0], jsonObject[1], jsonObject[2], search_str, "");
            news_Card_Group(1, jsonObject[3], jsonObject[4], jsonObject[5], search_str, "");
            news_Card_Group(2, jsonObject[6], jsonObject[7], jsonObject[8], search_str, "");
            news_Card_Group(3, jsonObject[9], jsonObject[10], jsonObject[11], search_str, "");
            news_Card_Group(4, jsonObject[12], jsonObject[13], jsonObject[14], search_str, "");
        }
    });
}

function create_Category_Page(category_str){
    $("#content_container").empty();
    $("#modal_generator").empty();
    var title_container = document.getElementById("category_title");
    var title_block = document.createElement("div");
    title_block.className = "block";
    title_container.innerText = category_str;

    if(category_str == "熱門"){
        create_Hot_News(category_str);
    }
    else{
        get_Category_News(category_str);
    }
}

function get_Category_News(category_str){
    var requestUrl;
    
    if (category_str == "今日"){
        requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/total_all_news.php";
        //requestUrl = "http://localhost:8080/tabnews_server/total_all_news.php";
    }
    else{
        requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/total_category_news.php";
        //var requestUrl = "http://localhost:8080/tabnews_server/total_category_news.php";
    }
    
    var requestData = {
        category: category_str
    };
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function(response){
            var categoryNewsNum = JSON.parse(response);
            
            // 建立 category_news
            create_Category_News(category_str, 1);
            
            // 建立頁碼表
            create_Pagination(categoryNewsNum, category_str, "category");
        }
    });
}

function create_Category_News(category_str, page){
    var requestUrl;
    
    if (category_str == "今日"){
        requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/all_news_page.php";
        //var requestUrl = "http://localhost:8080/tabnews_server/all_news_page.php";
    }
    else{
        requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/category_page.php";
        //var requestUrl = "http://localhost:8080/tabnews_server/category_page.php";
    }
    
    var requestData = {
        category: category_str,
        page: page
    };
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function(response){
            var jsonObject = JSON.parse(response);
            console.log(category_str);
            news_Card_Group(0, jsonObject[0], jsonObject[1], jsonObject[2], "", category_str);
            news_Card_Group(1, jsonObject[3], jsonObject[4], jsonObject[5], "", category_str);
            news_Card_Group(2, jsonObject[6], jsonObject[7], jsonObject[8], "", category_str);
            news_Card_Group(3, jsonObject[9], jsonObject[10], jsonObject[11], "", category_str);
            news_Card_Group(4, jsonObject[12], jsonObject[13], jsonObject[14], "", category_str);
        }
    });
}

function create_News_Modal(id, singleNews){
    var block = document.getElementById("modal_generator");
    var modal_block = document.createElement("div");
    modal_block.className = "modal fade";
    modal_block.id = id;
    modal_block.tabIndex = -1;
    modal_block.setAttribute("aria-hidden", "true");
    var bar_color = get_bar_color(singleNews["news_category"]);
    var news_top_bar = document.createElement("div");
    news_top_bar.style.background = bar_color;
    news_top_bar.style.paddingTop = "1px";
    news_top_bar.style.height = "1.5vh";
    
    var modal_center = document.createElement("div");
    modal_center.className = "modal-dialog modal-dialog-centered modal-xl";
    
    var modal_content = document.createElement("div");
    modal_content.className = "modal-content";
    
    var modal_body = create_Modal_News_Detail(id, singleNews);
    var news_bottom_bar = document.createElement("div");
    news_bottom_bar.style.background = bar_color;
    news_bottom_bar.style.paddingBottom = "1px";
    news_bottom_bar.style.height = "1.5vh";
    
    modal_content.append(news_top_bar);
    modal_content.append(modal_body);
    modal_content.append(news_bottom_bar);
    
    modal_center.append(modal_content);
    modal_block.append(modal_center);
    block.append(modal_block);
}

function news_Card_Group(row, news_1, news_2, news_3, search_str, category_str){
    var content_container = document.getElementById("content_container");
    var section = document.createElement("section");
    section.className = "magazine-section my-5";
    
    var card_deck = document.createElement("div");
    card_deck.className = "card-deck justify-content-center";
    
    if (news_1 != undefined){
        card_deck.append(news_Card(row + "_0", news_1, search_str, category_str));
    }
    
    if (news_2 != undefined){
        card_deck.append(news_Card(row + "_1", news_2, search_str, category_str));
    }
    
    if (news_3 != undefined){
        card_deck.append(news_Card(row + "_2", news_3, search_str, category_str));
    }
    
    section.append(card_deck);
    content_container.append(section);
}

function news_Card(id, single_news, search_str, category_str){
    
    var card_container = document.createElement("div");
    card_container.className = "card col-md-4 col-sm-12 mb-lg-0 mb-5 card_news";
    card_container.id = id;
    card_container.setAttribute("data-target", "#modal_" + id);
    card_container.setAttribute("data-toggle", "modal");
    card_container.onclick = Click_Return_Handler;
    
    function Click_Return_Handler(){
        click_return(single_news["id"]);
    }
    
    var image_container = document.createElement("div");
    image_container.className = "view overlay zoom";

    var image = document.createElement("img");
    image.className = "card-img-top";
    
    image.onerror = error_img;
    function error_img(){
        this.onerror = null;
        this.src = "../defaultImage/no_image_replace.jpg";
    }
    
  //  if(check_news_img(single_news['news_img']) == "true"){
        image.src = single_news['news_img'];
    //}
  //  else{
        // 預設該新聞網圖片
  //      image.src = "../defaultImage/no_image_replace.jpg";
  //  }
    
    image.setAttribute("alt", "Card image cap");
    image.style.height = "300px";
    image.style.objectFit = "none";
    image.style.objectPosition = "center";
    
    var wave = document.createElement("a");
    var wave_block = document.createElement("div");
    wave_block.className = "mask rgba-white-slight";
    wave.append(wave_block);
    
    image_container.append(image);
    image_container.append(wave);
    
    var card_body = document.createElement("div");
    card_body.className = "card-body";
    
    if (search_str != "" || category_str == "今日" || category_str == "熱門"){
        card_body.append(show_category_in_card(single_news["news_category"]));
    }
    
    /* 判斷標題是否有 相符搜尋字串 */
    if (single_news["news_title"].includes(search_str) == true && search_str != ""){
        card_body.append(highlight_title(search_str, single_news["news_title"]));
    }
    else{
        var news_title = document.createElement("h4");
        news_title.className = "card-title";
        news_title.innerText = single_news['news_title'];
    
        card_body.append(news_title);
    }
    
    /* 若 search_str 有字串，則 highlight 搜尋字串部分 */
    if (search_str != ""){
        card_body.append(highlight_content(search_str, single_news["news_content"]));
    }
    
    card_container.append(image_container);
    card_container.append(card_body);
    
    create_News_Modal("modal_" + id, single_news);
    return card_container;
}

function show_category_in_card(category_str){
    var category_div = document.createElement("div");
    
    category_div.className = "mb-3";
    category_div.innerText = category_str;
    
    return category_div;
}

function create_Modal_News_Detail(id, singleNews){
    var modal_body = document.createElement("div");
    modal_body.className = "modal-body";
    
    var block = document.createElement("div");
    block.className = "block";
    
    var news_title = document.createElement("h2");
    news_title.className = "h2-responsive font-weight-bold text-center my-3";
    news_title.innerText = singleNews["news_title"];
    
    var hr = document.createElement("hr");
    hr.style.border = "0";
    hr.style.height = "1px";
    hr.style.background = "#333";
    hr.style.backgroundImage = "linear-gradient(to right, #ccc, #333, #ccc)";
    
    var container_block = document.createElement("div");
    container_block.className = "container-fluid";
    container_block.style.maxWidth = "85%";
    
    var image_block = document.createElement("div");
    image_block.className = "text-center";
    var image = document.createElement("img");
    image.className = "img-fluid z-depth-1 rounded";
    
    image.onerror = error_img;
    function error_img(){
        this.onerror = null;
        this.src = "../defaultImage/no_image_replace.jpg";
    }
    
    // 檢查圖片是否存在
//    if(check_news_img(singleNews['news_img']) == "true"){
    image.src = singleNews['news_img'];
 //   }
 //   else{
        // 預設該新聞網圖片
 //       image.src = "../defaultImage/no_image_replace.jpg";
//    }
    
    image_block.append(image);
    var times_block = document.createElement("div");
    times_block.style.margin = "15px";
    
    var times_img = document.createElement("img");
    times_img.style.paddingBottom = "7px";
    times_img.style.paddingRight = "3px";
    times_img.src = "../icons/clock.png";
    
    var news_times = document.createElement("span");
    news_times.className = "news-times";
    news_times.innerText = singleNews["news_times"];
    
    times_block.append(times_img);
    times_block.append(news_times);
    
    var news_accordion = create_accordion(singleNews);
    
    var news_keywords = create_tags(id, singleNews["keywords"]);
    
    container_block.append(image_block);
    container_block.append(times_block);
    container_block.append(news_accordion);
    container_block.append(news_keywords);
    
    modal_body.append(news_title);
    modal_body.append(hr);
    modal_body.append(container_block);
    
    
    return modal_body;
}

function create_Pagination(newsCnt, category_str, mode){
    $("#page_list").empty();
    
    // 預設一個頁面置入 15 則新聞
    var page_cnt = Math.ceil(newsCnt / 15);

    if (page_cnt > 10){
        shorten_page_num(newsCnt, category_str, mode, 1, 10, 1);
    }
    else{
        shorten_page_num(newsCnt, category_str, mode, 1, page_cnt, 1);
    }
}

function shorten_page_num(newsCnt, category_str, mode, startPage, endPage, activePage){
    var li = document.createElement("li");
    var a = document.createElement("a");
    var span_1 = document.createElement("span");
    var span_2 = document.createElement("span");
    var page_list = document.getElementById("page_list");
    var page_cnt = Math.ceil(newsCnt / 15);
    
    for(i = startPage; i <= endPage; i++){
        li = document.createElement("li");
        
        if (i == activePage){
            li.className = "page-item active";
        }
        else {
            li.className = "page-item";
        }
        a = document.createElement("a");
        a.className = "page-link page-num";
        a.href = "#stickyNav";
        page_str = i + "_page";
        a.id = page_str;
        a.innerText = i;
        li.append(a);
        page_list.append(li);
    }
    
    $("#page_list li").click(function(){
        $("#content_container").empty();
        $("#modal_generator").empty();
        if (mode == "category"){
            create_Category_News(category_str, $(this).text());
        }
        else if (mode == "search"){
            create_Search_News(category_str, $(this).text());
        } 
        $("#page_list").empty();
        /* 重新製造頁碼 */
        var current_page = $(this).text();
        
        if(parseInt(current_page) + 4 <= page_cnt){
            if (parseInt(current_page) - 4 >= 1){
                shorten_page_num(newsCnt, category_str, mode, parseInt(current_page) - 4, parseInt(current_page) + 4, current_page);
            }
            else{
                shorten_page_num(newsCnt, category_str, mode, 1, parseInt(current_page) + 4, current_page);
            }
        }
        else{
            if (parseInt(current_page) - 4 >= 1){
                shorten_page_num(newsCnt, category_str, mode, parseInt(current_page) - 4, page_cnt, current_page)
            }
            else{
                shorten_page_num(newsCnt, category_str, mode, 1, page_cnt, current_page);
            }
        }
    });
}

function get_categoryIndex(category_str){
    var category_value = 0;
    switch (category_str){
        case "國際":
            category_value = 1;
            break;
        case "社會":
            category_value = 2;
            break;
        case "體育":
            category_value = 3;
            break;
        case "生活":
            category_value = 4;
            break;
        case "娛樂":
            category_value = 5;
            break;
        case "文教":
            category_value = 6;
            break;
        case "科技":
            category_value = 7;
            break;
        case "政經":
            category_value = 8;
            break;
        case "環境":
            category_value = 9;
            break;
        case "法律":
            category_value = 10;
            break;
        default:
            category_value = 0;
            break;
    }
    
    return category_value;
}

function get_bar_color(category_str){
    var bar_color = "";
    
    switch (category_str){
        case "國際":
            bar_color = "#e57373";
            break;
        case "社會":
            bar_color = "#BA68C8";
            break;
        case "體育":
            bar_color = "#64B5F6";
            break;
        case "生活":
            bar_color = "#4DD0E1";
            break;
        case "娛樂":
            bar_color = "#81C784";
            break;
        case "文教":
            bar_color = "#DCE775";
            break;
        case "科技":
            bar_color = "#FFD600";
            break;
        case "政經":
            bar_color = "#FFB74D";
            break;
        case "環境":
            bar_color = "#B0BEC5";
            break;
        case "法律":
            bar_color = "#8D6E63";
            break;
        default:
            bar_color = "#000000";
            break;
    }
    
    return bar_color;
}

function highlight_title(search_str, news_title){
    var str_index = news_title.indexOf(search_str);
    var title_block = document.createElement("div");
    
    var indexArray = [];
    var tmpIndex;
    while(str_index != -1 && str_index < news_title.length){
        indexArray.push(str_index);
        tmpIndex = str_index + search_str.length;
        str_index = news_title.indexOf(search_str, tmpIndex);
    }
    
    var startIndex = 0;
    var before_str;
    var hightlight_str;
    var rest_num = news_title.length;
    for(i = 0; i < indexArray.length; i++){
        before_str = document.createElement("span");
        before_str.innerText = news_title.substr(startIndex, indexArray[i] - startIndex);
        before_str.className = "h4";
        title_block.append(before_str);
        
        hightlight_str = document.createElement("span");
        hightlight_str.innerText = search_str;
        hightlight_str.style.fontWeight = "bold";
        hightlight_str.style.color = "red";
        hightlight_str.className = "h4";
        title_block.append(hightlight_str);
        
        rest_num -= (indexArray[i] - startIndex + search_str.length);
        startIndex = indexArray[i] + search_str.length;
    }
    if(rest_num > 0){
        before_str = document.createElement("span");
        before_str.innerText = news_title.substr(startIndex, rest_num);
        before_str.className = "h4";
        title_block.append(before_str);
    }
    
    return title_block;
}


/* 目前只能找到一個關鍵詞 */
function highlight_content(search_str, news_content){
    var str_index = news_content.indexOf(search_str);
    var short_content_block = document.createElement("div");
    
    if (str_index == -1){
        var null_string = document.createElement("span");
        null_string.innerText = "";
        short_content_block.append(null_string);
    }
    else {
        var indexArray = [];
        var tmpIndex;
        while (str_index != -1 && str_index < news_content.length){
            indexArray.push(str_index);
            tmpIndex = str_index + search_str.length;
            str_index = news_content.indexOf(search_str, tmpIndex);
        }
        
        var min_distance = Number.MAX_VALUE;
        var min_index_1 = -1;
        var min_index_2 = -1;
        
        for (i = 0; i < indexArray.length; i++){
            for (j = i + 1; j < indexArray.length; j++){
                if (Math.abs((indexArray[j] - indexArray[i]) - 30) < min_distance){
                    min_distance = Math.abs((indexArray[j] - indexArray[i]) - 30);
                    if (min_distance < 30){
                        min_index_1 = i;
                        min_index_2 = j;
                    }
                }
            }
        }
        var index = 0;
        var startIndex = -1;
        var commaIndex = -1;
        var us_comma = -1;
        var find_period = false;
        var find_comma = false;
        
        if (min_index_1 == -1 && min_index_2 == -1){
            index = indexArray[0];
        }
        else{
            index = indexArray[min_index_1];
        }
        
        for(backspace = 1; backspace < 25 && (index - backspace) >= 0; backspace ++){
                if(news_content[index - backspace] == "。" || news_content[index - backspace] == "\n"){
                    find_period = true;
                    break;
                }
                else if((min_index_1 != -1) && ((index - backspace) == indexArray[min_index_1 - 1])){
                    min_index_1 -= 1;
                }
                else if(news_content[index - backspace] == "，"){
                    find_comma = true;
                    commaIndex = backspace;
                }
                else if(news_content[index - backspace] == "," || news_content[index - backspace] == "."){
                    us_comma = backspace;
                }
                
        }
        // 印 20 個字
        if (find_period == true){
            startIndex = index - backspace + 1;
        }
        else if((index - backspace) == 0){
            startIndex = 0;
        }
        else if(find_comma == true){
            startIndex = index - commaIndex + 1;
        }
        else if(us_comma != -1){
            startIndex = index - us_comma + 1;
        }
        else{
            startIndex = index - 25;    
        }
        var before_search_str;
        var highlight_str;
        var rest_print_num = 45;
        
        if (news_content.length - startIndex < 20){
            before_search_str = document.createElement("span");
            before_search_str.innerText = news_content.substr(startIndex, indexArray[0] - startIndex);
            short_content_block.append(before_search_str);
                    
            highlight_str = document.createElement("span");
            highlight_str.innerText = search_str;
            highlight_str.style.fontWeight = "bold";
            highlight_str.style.color = "red";
            short_content_block.append(highlight_str);

            rest_print_num -= (indexArray[0] - startIndex + search_str.length);
            startIndex = indexArray[0] + search_str.length;
                
            before_search_str = document.createElement("span");
            if (rest_print_num > 0){
                    before_search_str.innerText = news_content.substr(startIndex, rest_print_num) ;
            }
            short_content_block.append(before_search_str);
            
            }
            else{
                
                if (min_index_1 == -1 && min_index_2 == -1){
                    before_search_str = document.createElement("span");
                    before_search_str.innerText = news_content.substr(startIndex, indexArray[0] - startIndex);
                    short_content_block.append(before_search_str);
                    
                    highlight_str = document.createElement("span");
                    highlight_str.innerText = search_str;
                    highlight_str.style.fontWeight = "bold";
                    highlight_str.style.color = "red";
                    short_content_block.append(highlight_str);

                    rest_print_num -= (indexArray[0] - startIndex + search_str.length);
                    startIndex = indexArray[0] + search_str.length;
                    
                    before_search_str = document.createElement("span");
                    if (rest_print_num > 0){
                        before_search_str.innerText = news_content.substr(startIndex, rest_print_num) + "...";
                    }
                    else{
                        before_search_str.innerText = "...";
                    }
                    short_content_block.append(before_search_str);
                }
                else{
                    for (i = min_index_1; i <= min_index_2; i++){
                        before_search_str = document.createElement("span");
                        before_search_str.innerText = news_content.substr(startIndex, indexArray[i] - startIndex);
                        short_content_block.append(before_search_str);
                        
                        highlight_str = document.createElement("span");
                        highlight_str.innerText = search_str;
                        highlight_str.style.fontWeight = "bold";
                        highlight_str.style.color = "red";
                        
                        short_content_block.append(highlight_str);
                        
                        rest_print_num -= (indexArray[i] - startIndex + search_str.length);
                        startIndex = indexArray[i] + search_str.length;
                    }
                    before_search_str = document.createElement("span");
                    if (rest_print_num > 0){
                        before_search_str.innerText = news_content.substr(startIndex, rest_print_num) + "..."; 
                    }
                    else{
                        before_search_str.innerText = "...";
                    }
                    short_content_block.append(before_search_str);
                }
            }
    }
    
    return short_content_block;
}

function create_accordion(single_news){
    var accordion_block = document.createElement("div");
    
    var summary_btn = document.createElement("a");
    summary_btn.id = "show_summary";
    summary_btn.className = "badge badge-pill badge-default waves-effect";
    summary_btn.innerText = "新聞摘要";
    summary_btn.style.fontSize = "18px";
    summary_btn.onclick = function(){
        content_block.innerText = single_news["summaries"];
    }
    
    var content_btn = document.createElement("a");
    content_btn.id = "show_detail";
    content_btn.className = "badge badge-pill badge-info waves-effect";
    content_btn.style.marginLeft = "10px";
    content_btn.innerText = "閱讀全文";
    content_btn.style.fontSize = "18px";
    content_btn.onclick = function(){
        content_block.innerText = single_news["news_content"];
    }
    
    var link_to_original_btn = document.createElement("a");
    link_to_original_btn.className = "badge badge-pill badge-warning waves-effect";
    link_to_original_btn.style.marginLeft = "10px";
    link_to_original_btn.innerText = "查看原文";
    link_to_original_btn.style.fontSize = "18px";
    link_to_original_btn.href = single_news["news_url"];
    link_to_original_btn.target = "_blank";
    
    var content_block = document.createElement("div");
    content_block.id = "news_content_screen";
    content_block.style.paddingTop = "10px";
    content_block.style.fontSize = "18px";
    // 改成兩個 \n 好像效果比較好
    content_block.innerText = single_news["summaries"];
    
    accordion_block.append(summary_btn);
    accordion_block.append(content_btn);
    accordion_block.append(link_to_original_btn);
    accordion_block.append(content_block);
    
    return accordion_block;
}

function create_tags(id, keywords){
    var tag_block = document.createElement("p");
    var current_index = 0;
    var comma_index = 0;
    var tag;
    
    while(comma_index < keywords.length){
        comma_index = keywords.indexOf("、", current_index);
        if(comma_index == -1){
            break;
        }
        
        // create single tag
        tag = document.createElement("a");
        tag.className = "badge badge-pill waves-effect align-middle";
        tag.innerText = keywords.substr(current_index, comma_index - current_index);
        tag.style.backgroundColor = "rgba(227, 88, 88, 0.72)";
        tag.style.fontSize = "15px";
        tag.style.marginLeft = "10px";
        tag.onclick = function(){
            $("#" + id).modal('hide');
            var str = this.innerText;
            setTimeout(function(){
                get_Search_News(str);
            }, 100);
        }
        tag_block.append(tag);
        current_index = comma_index + 1;
    }
    tag = document.createElement("a");
    tag.className = "badge badge-pill waves-effect align-middle";
    tag.innerText = keywords.substr(current_index, keywords.length - current_index);
    tag.style.backgroundColor = "rgba(227, 88, 88, 0.72)";
    tag.style.fontSize = "15px";
    tag.style.marginLeft = "10px";
    tag.onclick = function(){
        $("#" + id).modal('hide');
        var str = this.innerText;
        setTimeout(function(){
            get_Search_News(str);
        }, 100);  
    }
    
    tag_block.style.marginTop = "20px";
    tag_block.append(tag);
    
    return tag_block;
}

function report_msg(){
    document.getElementById("report_click").addEventListener("click", submitHandler);
}

function submitHandler() {
    var name =  document.getElementById('name').value;
    var email =  document.getElementById('email').value
    var subject =  document.getElementById('subject').value;
    var message =  document.getElementById('message').value;
    var status = document.getElementById("status");
    if (name == "" && email == "" && subject == "" && message == "") {
        status.innerText = "未填寫任何內容";
        status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
        
        return false;
    }
    if (name == "") {
        status.innerText = "姓名未填寫";
        status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
        return false;
    }
    if (email == "") {
        status.innerText = "Email未填寫";
        status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
        
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email)){
            status.innerText = "Email格式錯誤";
            status.style.visibility = "visible";
            setTimeout(function(){
                status.style.visibility = "hidden";
            }, 3000);
            return false;
        }
    }
    if (subject == "") {
        status.innerText = "主旨未填寫";
        status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
        return false;
    }
    if (message == "") {
        status.innerText = "內容未填寫";
        status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
        return false;
    }
    status.innerText = "啟動中...";
    status.style.visibility = "visible";
        setTimeout(function(){
                status.style.visibility = "hidden";
        }, 3000);
    
    var body =  ""+message+'%0A%0A%0A'+"From："+name+'%0A'+"Email："+email+'%0A';//%0A是換行 換了三行

    var to = "a126884561@gmail.com";
    var mailTo = document.createElement("a");
    mailTo.href="mailto:"+to+"?subject="+subject+"&body="+body;
    mailTo.click();
    status.innerText = "";
}

function create_Hot_News(category_str){
    $("#page_list").empty();

    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/create_Hot_News.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/create_Hot_News.php";
    
    $.ajax({
        type: "POST",
        url: requestUrl,
        success: function(response){
            var jsonObject = JSON.parse(response);

            news_Card_Group(0, jsonObject[0], jsonObject[1], jsonObject[2], "", category_str);
            news_Card_Group(1, jsonObject[3], jsonObject[4], jsonObject[5], "", category_str);
            news_Card_Group(2, jsonObject[6], jsonObject[7], jsonObject[8], "", category_str);
            news_Card_Group(3, jsonObject[9], jsonObject[10], jsonObject[11], "", category_str);
            news_Card_Group(4, jsonObject[12], jsonObject[13], jsonObject[14], "", category_str);
        }
    });
}

// 檢查該新聞圖片是否可用
function check_news_img(img_url){
    var status = 200;
    
    if(img_url == ""){
        return "false";
    }
    
    $.ajax({
        url: img_url,
        type: 'GET',
        async : false,
        error : function(response){
            status = response.status;
            // console.log(status);
        }
    });
    console.log(status);
    if(status == 404){
        return "false";
    }
    else{
        return "true";
    }
}


function click_return(id){
    if(Src_Count(id) == 0){
        return ;
    }
    //console.log("到這裡");
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/click_return.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/click_return.php";
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: {id: id},
        success: function(response){ 
        }
    })
}

function Src_Count(img_str){
    var src_count_length = src_count.length;
    for(var i = 0; i < src_count_length ; i++){
        if(img_str == src_count[i]){
            return 0;
        }
    }
    src_count.push(img_str);
}


function create_chart_1(){
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/chart_1.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/chart_1.php";
    var count_array;
    $.ajax({
        type: "POST",
        url: requestUrl,
        success: function(response){
            var count_array = JSON.parse(response);
            var ctx = document.getElementById("canvasPie-1").getContext("2d");
            
            info = {
                datasets: [{
                    data: [count_array[0], count_array[1], count_array[2],count_array[3],count_array[4],count_array[5],count_array[6],count_array[7]],
                    backgroundColor: [
                        '#e74c3c',
                        '#9b59b6',
                        '#3498db',
                        '#16a085',
                        '#95a5a6',
                        '#2ecc71',
                        '#2980b9',
                        '#f39c12',
                    ]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    '蘋果',
                    '華視',
                    '東森',
                    '自由',
                    '公視',
                    '三立',
                    'tvbs',
                    '聯合',
                ]

            };
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: info,
            });
        }
    })
}

function create_chart_2(){
    var requestUrl = "https://www2.cs.ccu.edu.tw/~lcha105u/tabnews_server/chart_2.php";
    //var requestUrl = "http://localhost:8080/tabnews_server/chart_2.php";
    var count_array;
    $.ajax({
        type: "POST",
        url: requestUrl,
        success: function(response){
            var count_array = JSON.parse(response);
            var ctx = document.getElementById("canvasPie-2").getContext("2d");
            
            info = {
                datasets: [{
                    data: [count_array[0], count_array[1], count_array[2], count_array[3], count_array[4],
                           count_array[5], count_array[6], count_array[7], count_array[8], count_array[9]], 
                    backgroundColor: [
                        '#e57373',
                        '#BA68C8',
                        '#64B5F6',
                        '#4DD0E1',
                        '#81C784',
                        '#DCE775',
                        '#FFD600',
                        '#FFB74D',       
                    ]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    '國際',
                    '社會',
                    '體育',
                    '生活',
                    '娛樂',
                    '文教',
                    '科技',
                    '財經',
                ]

            };
            var myPieChart = new Chart(ctx, {
                type: 'doughnut',
                data: info,
            });
        }
    })
}
