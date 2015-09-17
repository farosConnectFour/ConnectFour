/**
 * Created by nijstom on 2/04/2015.
 */

function Pattern(width, height) {
    this.width = width;
    this.height = height;
}

Pattern.prototype.returnResult = function(total, len) {
    if (total % len === 0)
        return total / len;
    return false;
};

Pattern.prototype.fits = function(nRows, nCols) {
    return nRows >= this.height && nCols >= this.width;
};


module.exports = Pattern;