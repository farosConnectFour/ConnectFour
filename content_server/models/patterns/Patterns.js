/**
 * Created by nijstom on 2/04/2015.
 */

var patterns = [];

patterns.push(new (require("./HorizontalPattern"))());
patterns.push(new (require("./VerticalPattern"))());
patterns.push(new (require("./DiagonalPattern"))());

module.exports = patterns;
