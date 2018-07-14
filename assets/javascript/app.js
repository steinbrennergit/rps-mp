/*
### Instructions

* Create a game that suits this user story:

  * Only two users can play at the same time.

  * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

  * The game will track each player's wins and losses.

  * Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

  * Styling and theme are completely up to you. Get Creative!

  * Deploy your assignment to Github Pages.
*/

// Initialize Firebase - replace with your own config object!
firebase.initializeApp(dbConfig);
const db = firebase.database();
const players = db.ref("/players");
const chat = db.ref("/chat");
/*******************************/

var onePlaying = false;
var twoPlaying = false;

var playerOne = false;
var playerTwo = false;

var playerOneRef = null;
var playerTwoRef = null;

var scoreOne = 0;
var scoreTwo = 0;

function hideInput() {
    $("#name").addClass("hide");
    $("#ok").addClass("hide");
    $("label").addClass("hide");
}

function showInput() {
    $("#name").removeClass("hide");
    $("#ok").removeClass("hide");
    $("label").removeClass("hide");
}

function scrollChatToBottom() {
    var div = document.getElementById("chat-box");
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function setPlayer(p) {
    if (p.player === 1) {
        playerOneRef = p;
        onePlaying = true;
        scoreOne = p.score;
        $("#p1-name").text(p.name);
    } else {
        playerTwoRef = p;
        twoPlaying = true;
        scoreTwo = p.score;
        $("#p2-name").text(p.name);
    }
}

function emptyPlayer(n) {
    if (n === 1) {
        playerOneRef = null;
        playerOne = false;
        scoreOne = 0;
        $("#p1-name").text("Waiting for Player 1");
    } else {
        playerTwoRef = null;
        playerTwo = false;
        scoreTwo = 0;
        $("#p2-name").text("Waiting for Player 2");
    }

    chat.remove();
    $("#chat-box").empty();
}

var game = {
    init: function () {
        console.log("Ready to play!");
    }
};

$("#chat-send").on("click", function () {
    event.preventDefault();

    let msg = $("#chat-input").val().trim();

    if (!playerOne && !playerTwo || msg === "") {
        $("#chat-input").val("");
        return;
    }

    if (playerOne) {
        msg = playerOneRef.name + ": " + msg;
    } else if (playerTwo) {
        msg = playerTwoRef.name + ": " + msg;
    }

    chat.push({ text: msg })
    $("#chat-input").val("");
    
});

$("#ok").on("click", function () {
    event.preventDefault();

    let nameInput = $("#name").val().trim();
    $("#name").val("");

    console.log("Player one: " + playerOne + ", Player two: " + playerTwo);

    if (nameInput === "") {
        console.log("No name input given")
        return;
    } else if (onePlaying && twoPlaying) {
        console.log("Both seats occupied")
        hideInput();
        return;
    } else if (onePlaying && !playerOne) {
        console.log("First seat occupied, and client is not the first seat")
        let con = players.push({ name: nameInput, player: 2, score: 0 });
        con.onDisconnect().remove();
        playerTwo = true;
    } else if (!onePlaying && !playerTwo) {
        console.log("First seat is open, and client is not the second seat")
        let con = players.push({ name: nameInput, player: 1, score: 0 });
        con.onDisconnect().remove();
        playerOne = true;
    }

    if (onePlaying && twoPlaying && (playerOne || playerTwo)) {
        game.init();
    }

    hideInput();
});

chat.on("child_added", function (snap) {
    console.log(snap.val());
    let newMsg = $("<p>");
    newMsg.text(snap.val().text);
    $("#chat-box").append(newMsg);
    scrollChatToBottom();
}, function (error) { console.log(error); })

players.on("value", function (snap) {
    let players = snap.val();

    onePlaying = false;
    twoPlaying = false;

    for (id in players) {
        if (onePlaying === false && players[id].player === 1) {
            setPlayer(players[id]);
        } else if (twoPlaying === false && players[id].player === 2) {
            setPlayer(players[id]);
        } else {
            players[id].remove();
        }
    }

    if (onePlaying && twoPlaying) {
        hideInput();
    } else {
        if (!onePlaying) {
            emptyPlayer(1);
        }
        if (!twoPlaying) {
            emptyPlayer(2);
        }
        if (!playerOne && !playerTwo) {
            showInput();
        }
    }
}, function (error) { console.log(error); });

$(document).on("click", ".action-button", function () {

});


/**********************************************************/

function debug() {
    console.log("This client is player one:", playerOne);
    console.log("This client is player two:", playerTwo);
    console.log("The first seat is occupied:", onePlaying);
    console.log("The second seat is occupied:", twoPlaying);
    console.log("'Player one' reference:", playerOneRef);
    console.log("'Player two' reference:", playerTwoRef);
}

$("#debug").on("click", debug);

/**********************************************************/