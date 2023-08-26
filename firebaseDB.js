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
  score = {id:level,score:time};
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
  
  let bestEasy=Infinity;
  let bestMedium=Infinity;
  let bestHard=Infinity;
  
  let ref = DB.ref('scores');
  scores = data.val();
  keys = Object.keys(scores);
  for (let k of keys){    
    if (scores[k].score < easyHS && scores[k].id == 'Easy'){
      easyHS = scores[k].score;
      bestEasy = scores[k].score;
    }
    if (scores[k].score < mediumHS && scores[k].id == 'Medium'){
      mediumHS = scores[k].score;
      bestMedium = scores[k].score;
    }
    if (scores[k].score < hardHS && scores[k].id == 'Hard'){
      hardHS = scores[k].score;
      bestHard = scores[k].score;
    }
  }
  
  
  for (let k of keys){
    if (scores[k].score > bestEasy && scores[k].id == 'Easy'){
      ref.child(k).remove();
    }
    else if (scores[k].score > bestMedium && scores[k].id == 'Medium'){
      ref.child(k).remove();
    }
    else if (scores[k].score > bestHard && scores[k].id == 'Hard'){
      ref.child(k).remove();
    }
  }
  
  
}

function errData(err){
  easyHS=999;
  mediumHS=999;
  hardHS=999;
}