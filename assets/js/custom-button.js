jQuery(document).ready(function ($) {
    function addSKButton() {
        // Ensure the custom button is added to the "Add New Section" button in Elementor
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

    // Mutation Observer to dynamically observe and add button if necessary
    const observer = new MutationObserver(() => {
        addSKButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    $(document).on('click', '.sk-button', function () {
        // Create a popup overlay when the SK button is clicked
        $('body').append(`
            <div class="sk-popup-overlay">
                <div class="sk-popup-content">
                    <div class="sk-popup-grid">
                        <button class="sk-popup-button" data-action="import-template">Import Template</button>
                        <button class="sk-popup-button">Another Button</button>
                    </div>
                    <button class="sk-popup-close">Close</button>
                </div>
            </div>
        `);

        // Close the popup on close button click
        $('.sk-popup-close').on('click', function () {
            $('.sk-popup-overlay').remove();
        });
    });

    const pageId = customElementorData.page_id;

    // Now you can use the pageId variable in your JS logic
    $(document).on('click', '.sk-popup-button[data-action="import-template"]', function () {
        const templateUrl = 'http://localhost/global/wp-content/plugins/elementor-json-importer/elementor-42471-2024-11-09.json';  // Update with your actual JSON file URL
        const editor = window.elementor;

        if (!editor) {
            alert('Elementor editor not initialized.');
            return;
        }

        $.getJSON(templateUrl, function (templateData) {
            if (!templateData || !templateData.content || !Array.isArray(templateData.content)) {
                alert('Invalid template data.');
                return;
            }

            try {
                const document = editor.documents.getCurrent();
                if (!document) {
                    alert('Failed to retrieve the current document.');
                    return;
                }

                // Create a new element from the template JSON data
                const newElement = document.createElement('container', {
                    content: templateData.content
                });

                // Add the element to the document
                document.addElement(newElement);

                alert('Template successfully imported!');
            } catch (e) {
                alert('Error adding the template: ' + e.message);
            }
        }).fail(function () {
            alert('Error loading the template file.');
        });
    });
});
