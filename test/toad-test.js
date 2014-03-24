var
    toad = require('../'),
    test = require('tape');

test('loads multiple CSS and JavaScript files', function (t) {
    t.plan(1);

    var files = [
        'http://code.jquery.com/jquery-1.11.0.min.js',
        'http://connect.facebook.net/en_US/all.js',
        'http://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css'
    ];

    toad.inject(document.querySelector('head'), files, function (done) {
        t.equal(done.length, files.length);
    });
});
