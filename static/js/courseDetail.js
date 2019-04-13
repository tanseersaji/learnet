
let course={};
let chapters={};
let player;

    let chapterList = document.getElementById('chapter-list');
    let chapterContainer = document.getElementById('course-preview-container');
    let videoTitle = document.getElementById('video-title');
    let courseTitle = document.getElementById('course-title');
    let videoFr  = document.getElementById('video-fr'); 
    let quizContainer = document.getElementById('quiz-container');
    let quizQuestion = document.getElementById('quiz-question');
    let quizOptions = document.getElementById('quiz-options');
    let quizSubmit = document.getElementById('quiz-submit');

    
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 
fetch('http://localhost:8080/ln-admin/api/get/course')
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    
      course = data.course;
      chapters = data.chapters;
      chapterContainer.style.display ='flex';
      init(course,chapters,player)
  })
  const init=(course,chapters)=>{
    chapterList.innerHTML = chapters.map((data,key)=>{
        if(data.chapterType === "Video"){
            
            if(key === 0){
                frames['video-fr'].style.display = "block"; 
                  quizContainer.style.display ="none";
                return  `<li  onClick="videoClick(\'${key}'\)" class=\"selected\">${data.title}</li>`
            }
            else {
                return  `<li  onClick="videoClick(\'${key}')" >${data.title}</li>`
            }
           
        }
        if(data.chapterType === "Quiz"){
             
            if(key=== 0){
                    frames['video-fr'].style.display = "none";       
                quizContainer.style.display ="block";
                return  `<li onClick="quizClick(\'${key}'\)" class="selected">${data.title}</li>`
            }
            else{
                return  `<li onClick="quizClick(\'${key}\')">${data.title}</li>`
            }
        }
    }).join('');
        courseTitle.innerHTML = course.title;
        videoTitle.innerHTML = chapters[0].title;
        if(chapters.length>1){
            document.getElementById("previous").style.visibility = "hidden";
            document.getElementById("next").style.visibility = "visible";
        }else{
            document.getElementById("previous").style.visibility = "hidden";
            document.getElementById("next").style.visibility = "hidden";
        }
        onYouTubeIframeAPIReady();
  }

  function onYouTubeIframeAPIReady() {
   if(chapters[0]!==undefined){
    player = new YT.Player('video-fr', {
        videoId: chapters[0].video[0].watchId ,
        height: '100%',
        width : '100%',
        playerVars: { 
        'showinfo':0,
        'autoplay': 0,
        'controls': 1, 
        'rel' : 0,
        'frameborder':0,
        'modestbranding':false

    },
    });
   }
    
}

  function renderQuiz(key){
     
    frames['video-fr'].style.display = "none";       
    quizContainer.style.display ="block";
    let currentQuiz = chapters[key].quiz[0];
    let question = currentQuiz.questionText;
    let options = currentQuiz.options;
    let solution = currentQuiz.solution;

    quizQuestion.innerText = question;
  quizOptions.innerHTML =  options.map(opt=>{
        return  `<li id="${opt}" onClick="checkAnswer(\'${opt}\',\'${solution}\',\'${key}\')">${opt}</li>`
    }).join('');

    

}
function checkAnswer(opt,solution,key){
    let element = document.getElementById(opt);
     
    let flag =0;
     for(let i = 0; i <chapters[key].quiz[0].options.length; i++){
        if(quizOptions.children[i].classList.contains("quiz-success") || 
            quizOptions.children[i].classList.contains("quiz-faliure")){
            
            flag = 1;
        }
    }  
  
    if(flag == 0){
        if(element.textContent == solution){
            element.classList.add("quiz-success");
            element.classList.add("quiz-text-light");
        }  
        else{
            element.classList.add("quiz-faliure");
            element.classList.add("quiz-text-light");

             setTimeout(showCorrectAns(solution), 1);
        } 
    }

    
}
function showCorrectAns(solution){
for(i = 0; i < quizOptions.children.length; i++){
    if(quizOptions.children[i].textContent ==solution){
        quizOptions.children[i].classList.add("quiz-success");
        quizOptions.children[i].classList.add("quiz-text-light");
    }
}
}
const videoClick = (key)=>{
    frames['video-fr'].style.display = "block"; 
    quizContainer.style.display ="none";
    let currentVideo = chapters[key]
    let contentList = document.getElementById('content-list')

      if (key == 0) {
    document.getElementById("previous").style.visibility = "hidden";
    document.getElementById("next").style.visibility = "visible";
} else if (key == (chapters.length-1) ){
    document.getElementById("next").style.visibility = "hidden";
    document.getElementById("previous").style.visibility = "visible";
} else {
    document.getElementById("next").style.visibility = "visible";
    document.getElementById("previous").style.visibility = "visible";
}
    for (let i = 0; i < contentList.children[0].children.length; i++) {  
         contentList.children[0].children[i].className = "";
    }
    event.target.className = "selected"
      player.loadVideoById(currentVideo.video[0].watchId);
    videoTitle.innerHTML =currentVideo.title
            
        if($(window).width() <= 800){
   $("#navigator").hide("slide",500);
   $("#ui-dismiss").hide("fade",500);
}
}

function quizClick(key){
let currentChapter = chapters[key];
player.stopVideo();
 renderQuiz(key);
  let contentList = document.getElementById('content-list')
 
      if (key == 0) {
        document.getElementById("previous").style.visibility = "hidden";
        document.getElementById("next").style.visibility = "visible";
    } 
    else if (key == (chapters.length-1) ){
    document.getElementById("next").style.visibility = "hidden";
    document.getElementById("previous").style.visibility = "visible";
  } 
  else {
    document.getElementById("next").style.visibility = "visible";
    document.getElementById("previous").style.visibility = "visible";
  }
    for (let i = 0; i < contentList.children[0].children.length; i++) {  
         contentList.children[0].children[i].className = "";
    }
    event.target.className = "selected";   
    videoTitle.innerHTML =currentChapter.title;
   
     if($(window).width() <= 800){
   $("#navigator").hide("slide",500);
   $("#ui-dismiss").hide("fade",500);}
}

function collapse() {
if($(window).width() <= 800){
   $("#navigator").toggle("slide",500);
   $("#ui-dismiss").toggle("fade");
   $("#ui-dismiss").click(function () {
    $("#navigator").hide("slide",500);
    $("#ui-dismiss").hide("fade",500);
});
   $("body").css("overflow","hidden");
}
else{
$("#navigator").toggle("fold",500);
}

}

function next() {
    var name = document.querySelector(".selected");
    console.log(chapters.length)
    let i;
     for (i = 0; i < chapters.length; i++) {
            
            if (name.innerText === chapters[i].title) {
                
                if ((i + 1) == (chapters.length - 1)) {
                    
                    document.getElementById("next").style.visibility = "hidden";
                    document.getElementById("previous").style.visibility = "visible";
                } else {
                    document.getElementById("next").style.visibility = "visible";
                    document.getElementById("previous").style.visibility = "visible";
                }
                
                videoTitle.innerText = chapters[i+1].title;
                name.nextSibling.className = "selected";
                name.className = "";
                  if(chapters[i+1].chapterType==="Video"){              
                    frames['video-fr'].style.display = "block"; 
                    quizContainer.style.display ="none";
                    player.loadVideoById(chapters[i+1].video[0].watchId); 
                  }     
                    else{
                         player.stopVideo();
                         renderQuiz(i+1)
                    }
            }
}}
function previous(){
    
    var name = document.querySelector(".selected");
for (i = 0; i < chapters.length; i++) {
    if (name.innerText === chapters[i].title) {
        if ((i - 1) === 0) {
            document.getElementById("previous").style.visibility = "hidden";
            document.getElementById("next").style.visibility = "visible";
        } else {
            document.getElementById("next").style.visibility = "visible";
            document.getElementById("previous").style.visibility = "visible";
        }
                 videoTitle.innerText = chapters[i-1].title;
                name.previousSibling.className = "selected";
                name.className = "";
                if(chapters[i-1].chapterType==="Video"){                    
                    frames['video-fr'].style.display = "block"; 
                       quizContainer.style.display ="none";   
                    player.loadVideoById(chapters[i-1].video[0].watchId);
                }
                else{
                    frames['video-fr'].style.display = "none";
                     player.stopVideo();
                     renderQuiz(i-1)
                }
}}}