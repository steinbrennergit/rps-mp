# rps-multiplayer

  * This web app mimics the functionality of the game 'Rock, Paper, Scissors.'

  * Only two users can play at the same time. Any number of users may spectate.

  * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

  * Players have 20 seconds to make their selection. If one player made a selection, and the other did not, the player who made a selection wins. If neither player selects an option, the players tie.

  * The game will track each player's wins and losses. For spectators, wins and losses are tracked from when they start watching.

  * Active players may chat using the chat window below the play space. Spectators may see the chat but their inputs are ignored.
  
  * If either player disconnects, the other player remains connected, but wins and losses are reset. The chat is emptied. Spectators can then join the game, taking the empty seat.

  # Known bugs

  * If a spectator joins in the middle of an active turn, both players' boxes will appear inactive (gray border, instead of yellow highlight) on their own screens until the next turn. No gameplay behavior is affected.

  * Occasionally, a player may make a choice, and the turn will end for both players, resulting in a win for the player who made a choice. I have been unable to reliably replicate this bug, and believe it to be a result of inconsistent Firebase performance. 

  * Occasionally, the timers for player 1 and player 2 will get out of sync, resulting in odd behavior. I have been unable to reliably replicate this bug, and believe it to be a result of inconsistent Firebase performance.