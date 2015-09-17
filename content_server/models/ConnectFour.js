/**
 * Created by nijstom on 2/04/2015.
 */


var patterns = require('./patterns/Patterns');
var nRows = 6;
var nCols = 7;
// 0 = empty, 1, 2 = colours
function ConnectFour() {
    this.board = [];
    this.currentColour = 1;
    this.winnner = false;
    this.playedCells = 0;
    this.generateBoard();
}

ConnectFour.prototype.generateBoard = function() {
    for (var row = 0; row < nRows; row++) {
        var cols = [];
        for (var col = 0; col < nCols; col++) {
            cols.push(0);
        }
        this.board.push(cols);
    }
};

ConnectFour.prototype.getColour = function (ply) {
    return this.currentColour;
};

ConnectFour.prototype.play = function(col) {
    if (this.winner) return false;

    var cell = false;
    if (col >= 0 && col < nCols) {
        var row = nRows - 1;

        do {
            if (this.board[row][col] === 0) {
                this.board[row][col] = this.currentColour;
                cell = {
                    row: row,
                    col: col,
                    colour: this.currentColour
                };
            } else
                row--;

        } while (!cell && row >= 0);

        if (cell) {
            this.winner = this.checkWin();
            this.endTurn();
        }
    }
    return cell;
};

ConnectFour.prototype.isDraw = function() {
    return this.winner ? false : this.playedCells === (nRows * nCols);
};

ConnectFour.prototype.getWinner = function() {
    return this.players[this.winner - 1];
};

ConnectFour.prototype.endTurn = function() {
    this.playedCells++;
    this.currentColour = (this.currentColour === 1) ? 2 : 1;
};

ConnectFour.prototype.checkWin = function() {
    for (var row = nRows - 1; row >= 0; row--) {
        for (var col = nCols - 1; col >= 0; col--) {
            for (var i = 0; i < patterns.length; i++) {
                var pattern = patterns[i];

                if (pattern.fits(nRows - row, nCols - col)) {
                    var result = pattern.check(this.board, row, col);
                    if (result)
                        return result;
                }
            }
        }
    }
    return false;
};

module.exports = ConnectFour;