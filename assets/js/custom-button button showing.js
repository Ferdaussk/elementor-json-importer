jQuery(document).ready(function ($) {
    console.log("Custom JS loaded!");

    // Function to add the SK div with e-icon beside all existing Add Section buttons
    function addSKButton() {
        $('.elementor-add-template-button').each(function () {
            // Check if the SK div already exists beside this button
            if (!$(this).siblings('.sk-button').length) {
                // Create the SK div and add an icon
                const skDiv = $('<div>')
                    .addClass('sk-button')
                    .html('<i class="eicon-search"></i>'); // Replace eicon-search with your desired icon class

                // Place the new div directly beside the Add Section button
                $(this).after(skDiv);

                console.log("SK div with e-icon added beside an Add Section button!");
            }
        });
    }

    // Add SK Buttons initially when the editor loads
    addSKButton();

    // Observe the DOM for new Add Section buttons (for dynamically added sections)
    const observer = new MutationObserver(() => {
        addSKButton();
    });

    // Start observing the Elementor editor area for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Handle click on the SK div (with the icon)
    $(document).on('click', '.sk-button', function () {
        console.log("SK Button (div with icon) clicked!");

        // Trigger an AJAX request
        $.post(customElementorData.ajaxurl, {
            action: 'handle_sk_button_action',
            nonce: customElementorData.nonce
        }, function (response) {
            if (response.success) {
                alert(response.data.message);
            } else {
                alert('An error occurred!');
            }
        });
    });
});
