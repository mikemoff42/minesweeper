let DB,easyHS,mediumHS,hardHS;
function initFirebase() {
  let firebaseConfig = {
    apiKey: "AIzaSyB088-HXMZGLa1riTIDCgymk9zBnkWtNlU",
    authDomain: "minesweeper-f14d4.firebaseapp.com",
    projectId: "minesweeper-f14d4",
    storageBucket: "minesweeper-f14d4.appspot.com",
    messagingSenderId: "337468960581",
    appId: "1:337468960581:web:5e2f25c08b7ebb98a4d82c",
  }
  firebase.initializeApp(firebaseConfig);
  DB = firebase.database();
  getCurrentHighScores();
}

function highScore(level,time) {
  newRecord=true;
  let ref = DB.ref('scores');
  score = {id:level, score: time};
  ref.push(score);
}

function getCurrentHighScores() {
  let ref = DB.ref('scores');
  ref.on('value', GetHighScores, errData);
}

function GetHighScores(data){
  easyHS=999;
  mediumHS=999;
  hardHS=999;
  
  scores = data.val();
  keys = Object.keys(scores);
  for (let k of keys){    
    if (scores[k].score < easyHS && scores[k].id == 'Easy'){
      easyHS = scores[k].score;
    }
    if (scores[k].score < mediumHS && scores[k].id == 'Medium'){
      mediumHS = scores[k].score;
    }
    if (scores[k].score < hardHS && scores[k].id == 'Hard'){
      hardHS = scores[k].score;
    }
  }
  
}

function errData(err){
  //console.log(err);
  easyHS=999;
  mediumHS=999;
  hardHS=999;
}