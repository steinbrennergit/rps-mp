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

// found at https://steinbrennergit.github.io/rps-multiplayer/
// repo at https://github.com/steinbrennergit/rps-multiplayer/

// Initialize Firebase - replace with your own config object!
/*******************************/
// Constant db references
firebase.initializeApp(dbConfig);
const db = firebase.database();
const players = db.ref("/players");
const chat = db.ref("/chat");
const choices = db.ref("/playerChoices");
const start = db.ref("/startgame");
/*******************************/
// Constant html references
const $timer_display = $("#timer-display");
const $timer = $("#timer");
const $res = $("#result");
const $box = $(".playbox");
const $p1 = $("#player-one");
const $p2 = $("#player-two");
const $p1btns = $(".p1");
const $p2btns = $(".p2");
const $p1score = $("#p1score");
const $p2score = $("#p2score");
const $p1W = $("#p1-wins");
const $p1L = $("#p1-losses");
const $p2W = $("#p2-wins");
const $p2L = $("#p2-losses");
/*******************************/

var intervalId = null;

var p1Choice = null;
var p2Choice = null;

var onePlaying = false;
var twoPlaying = false;

var playerOne = false;
var playerTwo = false;

var playerOneRef = null;
var playerTwoRef = null;

start.set({ playing: false });

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
        $("#p1-name").text(p.name);
    } else {
        playerTwoRef = p;
        twoPlaying = true;
        $("#p2-name").text(p.name);
    }
}

function emptyPlayer(n) {
    if (n === 1) {
        playerOneRef = null;
        playerOne = false;
        scoreOne = 0;
        $("#p1-name").text("Waiting for Player 1");
        $p1score.addClass("hide");
        $p2btns.addClass("hide");
    } else {
        playerTwoRef = null;
        playerTwo = false;
        scoreTwo = 0;
        $("#p2-name").text("Waiting for Player 2");
        $p2score.addClass("hide");
        $p1btns.addClass("hide");
    }

    chat.remove();
    $("#chat-box").empty();
}

// Pulled clock code from hmwk 5
var clock = {
    time: null,
    maxTime: null,

    // Clear the interval before starting a new timer
    stop: function () {
        $timer.addClass("hide");
        clearInterval(intervalId);
    },

    // Start takes the number of seconds to count down from
    start: function (n) {
        clock.maxTime = n;
        clock.time = clock.maxTime;
        intervalId = setInterval(clock.tick, 1000);
        $timer.removeClass("hide");
        clock.displayTime();
    },

    // Each tick counts down 1 second
    tick: function () {

        // Decrement time & update display
        clock.time--;
        clock.displayTime();

        // If clock reaches 0, call selectAnswer() without passing an arg, stop the clock
        if (clock.time === 0) {
            game.playTurn();
            clock.stop();
        }
    },

    // Update timer display in html
    displayTime: function () {
        $timer_display.text(clock.timeConverter());
    },

    // Fancy str manipulation to output the display
    timeConverter: function () {
        var minutes = Math.floor(clock.time / 60);
        var seconds = clock.time - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes === 0) {
            minutes = "00";
        }
        else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    },
};
// End of clock code

var game = {

    newTurn: function () {
        $res.empty();
        clock.start(20);
        if (playerOne) {
            $p1btns.removeClass("hide");
        } else if (playerTwo) {
            $p2btns.removeClass("hide");
        }
        $box.removeClass("inactive-turn");
        $box.addClass("active-turn");
    },

    endTurn: function (n) {
        clock.stop();
        $p1btns.addClass("hide");
        $p2btns.addClass("hide");
        $box.removeClass("active-turn");
        $box.addClass("inactive-turn");

        let result = $("<h3>");
        if (n === 0) {
            result.text("You tied! Nobody wins!");
        } else if (n === 1) {
            result.text(playerOneRef.name + " wins!");
        } else if (n === 2) {
            result.text(playerTwoRef.name + " wins!");
        }
        $res.append(result);
        $p1W.text(playerOneRef.wins);
        $p1L.text(playerOneRef.losses);
        $p2W.text(playerTwoRef.wins);
        $p2L.text(playerTwoRef.losses);
        setTimeout(game.newTurn, 4500);
    },

    playTurn: function () {

        if (p1Choice === null && p2Choice === null) {
            // Players tie
            // console.log("Timeout both players");
            this.endTurn(0);
        } else if (p2Choice === null) {
            // Player 1 wins
            playerOneRef.wins++;
            playerTwoRef.losses++;
            // console.log("Timeout player 2")
            this.endTurn(1);
        } else if (p1Choice === null) {
            // Player 2 wins
            playerTwoRef.wins++;
            playerOneRef.losses++;
            // console.log("Timeout player 1")
            this.endTurn(2);
        } else if ((p1Choice === "r") && (p2Choice === "s")) {
            // Player 1 wins
            // console.log("Player 1 wins");
            playerOneRef.wins++;
            playerTwoRef.losses++;
            this.endTurn(1);
        } else if ((p1Choice === "r") && (p2Choice === "p")) {
            // Player 2 wins
            playerTwoRef.wins++;
            playerOneRef.losses++;
            // console.log("Player 2 wins");
            this.endTurn(2);
        } else if ((p1Choice === "s") && (p2Choice === "r")) {
            // Player 2 wins
            playerTwoRef.wins++;
            playerOneRef.losses++;
            // console.log("Player 2 wins");
            this.endTurn(2);
        } else if ((p1Choice === "s") && (p2Choice === "p")) {
            // Player 1 wins
            playerOneRef.wins++;
            playerTwoRef.losses++;
            // console.log("Player 1 wins");
            this.endTurn(1);
        } else if ((p1Choice === "p") && (p2Choice === "r")) {
            // Player 1 wins
            playerOneRef.wins++;
            playerTwoRef.losses++;
            // console.log("Player 1 wins");
            this.endTurn(1);
        } else if ((p1Choice === "p") && (p2Choice === "s")) {
            // Player 2 wins
            playerTwoRef.wins++;
            playerOneRef.losses++;
            // console.log("Player 2 wins");
            this.endTurn(2);
        } else if (p1Choice === p2Choice) {
            // Players tie
            // console.log("Players tie");
            this.endTurn(0);
        }

        p1Choice = null;
        p2Choice = null;
    },

    init: function () {
        // console.log("Ready to play!");
        $p1score.removeClass("hide");
        $p2score.removeClass("hide");
        this.newTurn();
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

    // console.log("Player one: " + playerOne + ", Player two: " + playerTwo);

    if (nameInput === "") {
        // console.log("No name input given")
        return;
    } else if (onePlaying && twoPlaying) {
        // console.log("Both seats occupied")
        hideInput();
        return;
    } else if (onePlaying && !playerOne) {
        // console.log("First seat occupied, and client is not the first seat")
        let con = players.push({ name: nameInput, player: 2, wins: 0, losses: 0 });
        con.onDisconnect().remove();
        playerTwo = true;
    } else if (!onePlaying && !playerTwo) {
        // console.log("First seat is open, and client is not the second seat")
        let con = players.push({ name: nameInput, player: 1, wins: 0, losses: 0 });
        con.onDisconnect().remove();
        playerOne = true;
    }

    if (onePlaying && twoPlaying && (playerOne || playerTwo)) {
        start.set({ playing: true });
    }

    hideInput();
});

start.on("value", function (snap) {
    if (snap.val().playing) {
        game.init();
    }
});

choices.on("child_added", function (snap) {
    let data = snap.val();
    if (data.player === 1) {
        p1Choice = data.choice;
        $p1.removeClass("active-turn");
        $p1.addClass("inactive-turn");
    } else {
        p2Choice = data.choice;
        $p2.removeClass("active-turn");
        $p2.addClass("inactive-turn");
    }

    if (p1Choice !== null && p2Choice !== null) {
        game.playTurn();
        choices.remove();
    }
});

chat.on("child_added", function (snap) {
    // console.log(snap.val());
    let newMsg = $("<p>");
    newMsg.text(snap.val().text);
    $("#chat-box").append(newMsg);
    scrollChatToBottom();
}, function (error) { console.log(error); });

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
        $p1score.removeClass("hide");
        $p2score.removeClass("hide");
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
    let choice = $(this).val();
    if (playerOne) {
        // console.log("Player one choice:", choice);
        choices.push({ player: 1, choice });
        $p1btns.addClass("hide");
    } else if (playerTwo) {
        // console.log("Player two choice:", choice);
        choices.push({ player: 2, choice });
        $p2btns.addClass("hide");
    }
});

/**********************************************************/

// function debug() {
//     console.log("This client is player one:", playerOne);
//     console.log("This client is player two:", playerTwo);
//     console.log("The first seat is occupied:", onePlaying);
//     console.log("The second seat is occupied:", twoPlaying);
//     console.log("'Player one' reference:", playerOneRef);
//     console.log("'Player two' reference:", playerTwoRef);
// }

// $("#debug").on("click", debug);

/**********************************************************/