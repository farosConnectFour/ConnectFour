/**
 * Created by nijstom on 2/04/2015.
 */

var Pattern = require('./Pattern');

function VerticalPattern() {
    Pattern.call(this, 1, 4);
};

VerticalPattern.prototype = Object.create(Pattern.prototype);
VerticalPattern.prototype.constructor = Pattern;

VerticalPattern.prototype.changeSize = function(size) {
    this.height = size;
};

VerticalPattern.prototype.check = function (array, rowStart, colStart) {
    var total = 0;
    for (var i = 0; i < this.height; i++) {
        var cell = array[rowStart + i][colStart];

        if (!cell) return false;

        total += cell;
    }
    return this.returnResult(total, this.height);
};



module.exports = VerticalPattern;