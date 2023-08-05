$('#addButton').click(function() {
    $('#popup').removeClass('hidden');
});

$('#linkForm').submit(function(e) {
    e.preventDefault();
    var linkName = $('#linkName').val();
    var linkUrl = $('#linkUrl').val();
    if (!/^https?:\/\//i.test(linkUrl)) {
        linkUrl = 'https://' + linkUrl;
    }
    $('#links').append('<a href="' + linkUrl + '" target="_blank">' + linkName + '</a><br>');
    $('#linkName').val('');
    $('#linkUrl').val('');
    $('#popup').addClass('hidden');
});
