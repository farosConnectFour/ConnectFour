/**
 * Created by nijstom on 2/04/2015.
 */

var Pattern = require('./Pattern');

function DiagonalPattern() {
    Pattern.call(this, 4, 4);
};

DiagonalPattern.prototype = Object.create(Pattern.prototype);
DiagonalPattern.prototype.constructor = Pattern;

DiagonalPattern.prototype.changeSize = function(size) {
    this.width = size;
    this.height = size;
};

DiagonalPattern.prototype.check = function (array, rowStart, colStart) {
    var self = this;
    var diagonalCheck = function(down) {
        var colI = colStart;
        var dir = 1;
        var total = 0;

        if (down) {
            colI += 3;
            dir = -1;
        }

        for (var i = 0; i < self.width; i++) {
            var cell = array[rowStart + i][colI + i * dir];
            if (cell === 0)
                return false;
            else
                total += cell;
        }
        return self.returnResult(total, self.width);
    };

    var winner = diagonalCheck(false);
    if (!winner)
        winner = diagonalCheck(true);
    return winner;
};



module.exports = DiagonalPattern;