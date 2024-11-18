jQuery(document).ready(function ($) {
    function addSKButton() {
        $('.elementor-add-template-button').each(function () {
            if (!$(this).siblings('.sk-button').length) {
                const skDiv = $('<div>')
                    .addClass('sk-button')
                    .html('<i class="eicon-search"></i>');

                $(this).after(skDiv);
            }
        });
    }

    addSKButton();

    const observer = new MutationObserver(() => {
        addSKButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    $(document).on('click', '.sk-button', function () {
        $('body').append(`
            <div class="sk-popup-overlay">
                <div class="sk-popup-content">
                    <div class="sk-popup-grid">
                        <button class="sk-popup-button" id="button-1">Button 1</button>
                        <button class="sk-popup-button">Button 2</button>
                    </div>
                    <button class="sk-popup-close">Close</button>
                </div>
            </div>
        `);

        $('.sk-popup-close').on('click', function () {
            $('.sk-popup-overlay').remove();
        });
    });

    // When Button 1 is clicked, import the JSON template
    $(document).on('click', '#button-1', function () {
        // Perform an AJAX request to load the JSON file
        $.ajax({
            url: 'http://localhost/global/wp-content/plugins/elementor-json-importer/elementor-42471-2024-11-09.json', // Path to your JSON template
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                // Ensure the JSON response is valid
                if (response && response.content) {
                    const template = response.content;

                    // Insert the template into Elementor editor
                    const editor = window.elementor;
                    if (editor && editor.editor) {
                        editor.addNewElementorTemplate(template);
                    }

                    alert('Template successfully imported!');
                } else {
                    alert('Failed to load template data.');
                }
            },
            error: function () {
                alert('Error loading the template file.');
            }
        });
    });
});
