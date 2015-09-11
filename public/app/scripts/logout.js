/**
 * Created by peeteli on 11/09/2015.
 */

$(window).bind("beforeunload", function() {
    $.post('/logout');
});