/**
 * Created by nijstom on 2/04/2015.
 */

var Pattern = require('./Pattern');

function HorizontalPattern() {
    Pattern.call(this, 4, 1);
};

HorizontalPattern.prototype = Object.create(Pattern.prototype);
HorizontalPattern.prototype.constructor = Pattern;

HorizontalPattern.prototype.changeSize = function(size) {
    this.width = size;
};

HorizontalPattern.prototype.check = function (array, rowStart, colStart) {
    var total = 0;
    for (var i = 0; i < this.width; i++) {
        var cell = array[rowStart][colStart + i];
        if (cell === 0)
            return false;
        else
            total += cell;
    }
    return this.returnResult(total, this.width);
};



module.exports = HorizontalPattern;