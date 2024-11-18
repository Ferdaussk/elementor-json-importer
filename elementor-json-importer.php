<?php
/*
Plugin Name: Elementor JSON Importer
Description: Import Elementor page templates from JSON files via a custom button.
Version: 1.0
Author: Your Name
*/

// Enqueue necessary scripts
function ei_enqueue_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('ei-script', plugin_dir_url(__FILE__) . 'ei-script.js', ['jquery'], null, true);
    wp_localize_script('ei-script', 'ei_ajax_object', ['ajax_url' => admin_url('admin-ajax.php')]);
}
add_action('admin_enqueue_scripts', 'ei_enqueue_scripts');

// Add Admin Menu for Import Page
function ei_add_admin_menu() {
    add_menu_page('Elementor JSON Import', 'Elementor Importer', 'manage_options', 'elementor-json-import', 'ei_import_page', 'dashicons-upload', 90);
}
add_action('admin_menu', 'ei_add_admin_menu');

// HTML for the Import Page
function ei_import_page() {
    ?>
    <div class="wrap">
        <h1>Import Elementor Page</h1>
        <input type="file" id="json-file" accept=".json">
        <button id="import-button" class="button button-primary">Import JSON</button>
    </div>
    <?php
}

function ei_handle_import_elementor_page() {
    // Check user permissions
    if (!current_user_can('edit_posts')) {
        wp_send_json_error(['message' => 'Permission denied']);
    }

    // Check if a file was uploaded
    if (empty($_FILES['file']['tmp_name'])) {
        wp_send_json_error(['message' => 'No file uploaded']);
    }

    // Read and decode JSON file
    $json_data = file_get_contents($_FILES['file']['tmp_name']);
    $elementor_data = json_decode($json_data, true);

    if (empty($elementor_data)) {
        wp_send_json_error(['message' => 'Invalid JSON data']);
    }

    // Recursive function to validate 'elType' key exists in nested JSON structure
    function validate_eltype_key($data) {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (isset($value['elType'])) {
                    return true;
                }
                if (is_array($value) && validate_eltype_key($value)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if 'elType' exists anywhere in the JSON data
    if (!validate_eltype_key($elementor_data)) {
        wp_send_json_error(['message' => "Missing 'elType' key in JSON data"]);
    }

    // Create a new page for Elementor content
    $page_id = wp_insert_post([
        'post_title'   => 'Imported Elementor Page',
        'post_content' => '', 
        'post_status'  => 'publish',
        'post_type'    => 'page',
    ]);

    if (is_wp_error($page_id)) {
        wp_send_json_error(['message' => 'Failed to create page']);
    }

    // Update the new page with Elementor data
    update_post_meta($page_id, '_elementor_data', $elementor_data);
    update_post_meta($page_id, '_elementor_edit_mode', 'builder');
    update_post_meta($page_id, '_elementor_template_type', 'page');
    update_post_meta($page_id, '_wp_page_template', 'elementor_canvas'); // Optional: Use Elementor's canvas template

    wp_send_json_success(['message' => 'Page imported successfully', 'page_id' => $page_id]);
}
add_action('wp_ajax_import_elementor_page', 'ei_handle_import_elementor_page');

