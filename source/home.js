$(document).ready(function() {
    // Load links when the page loads
    $.get('/get-links', function(links) {
        links.forEach(function(link) {
            const linkElement = $('<a href="' + link.url + '" target="_blank">' + link.name + '</a>');
            const deleteButton = $('<button style="display: block; width: 35px; height: 35px; background-color: #f9f9f9; color: #c70000; border: none; border-radius: 25%; font-size: 1em; font-weight: bold; text-align: center; cursor: pointer; place-self: center;">' + 'X</button>');
            deleteButton.click(function() {
                $.ajax({
                    url: '/delete-link/' + link._id,
                    type: 'DELETE',
                    success: function() {
                        linkElement.remove();
                        deleteButton.remove();
                    }
                });
            });
            $('#links').append(linkElement);
            $('#links').append(deleteButton);
        });
    });

    // Show popup when "+" button is clicked
    $('#addButton').click(function() {
        $('#popup').removeClass('hidden');
    });

    // Add link when form is submitted
    $('#linkForm').submit(function(e) {
        e.preventDefault();
        let linkName = $('#linkName').val();
        let linkUrl = $('#linkUrl').val();
        if (!/^https?:\/\//i.test(linkUrl)) {
            linkUrl = 'http://' + linkUrl;
        }
        $.post('/add-link', { linkName: linkName, linkUrl: linkUrl }, function(link) {
            const linkElement = $('<a href="' + linkUrl + '" target="_blank">' + linkName + '</a>');
            const deleteButton = $('<button>Delete</button>');
            deleteButton.click(function() {
                $.ajax({
                    url: '/delete-link/' + String(link._id),
                    type: 'DELETE',
                    success: function() {
                        linkElement.remove();
                        deleteButton.remove();
                    }
                });
            });            
            $('#links').append(linkElement);
            $('#links').append(deleteButton);
            $('#popup').addClass('hidden');
            $('#linkForm')[0].reset();
        });
    });
});
