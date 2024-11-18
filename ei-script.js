jQuery(document).ready(function($) {
    $('#import-button').on('click', function() {
        var fileInput = $('#json-file')[0];
        if (!fileInput.files.length) {
            alert('Please select a JSON file.');
            return;
        }

        var formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('action', 'import_elementor_page');

        $.ajax({
            url: ei_ajax_object.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    alert(response.data.message || 'Import successful');
                } else {
                    alert(response.data.message || 'Import failed');
                }
            },
            error: function() {
                alert('There was an error importing the file.');
            }
        });
    });
});
