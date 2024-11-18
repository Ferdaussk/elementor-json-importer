<?php
/*
Plugin Name: Elementor Add New Section with Button
Description: Adds a new button to the Elementor editor when the "Add New Section" button is clicked.
Version: 1.0
Author: Your Name
*/

function enqueue_custom_js_for_elementor_editor() {
    // if ( ! isset( $_GET['elementor'] ) ) {
    //     return;
    // }

    wp_enqueue_script(
        'custom-elementor-editor-js',
        plugin_dir_url(__FILE__) . 'assets/js/custom-button.js',
        ['jquery'],
        '1.0',
        true
    );
    wp_enqueue_style(
        'custom-elementor-editor-style',
        plugin_dir_url(__FILE__) . 'assets/css/style.css',
        null,
        '1.0',
        'all'
    );

    wp_localize_script('custom-elementor-editor-js', 'customElementorData', [
        'page_id' => get_the_ID(),
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('custom-elementor-nonce'),
    ]);
}
add_action('wp_enqueue_scripts', 'enqueue_custom_js_for_elementor_editor');

// REST API to Serve Template Data
function register_elementor_template_endpoint() {
    register_rest_route('custom/v1', '/elementor-template', array(
        'methods' => 'GET',
        'callback' => 'get_elementor_template',
        'permission_callback' => '__return_true',
    ));
}

function get_elementor_template() {
    $template_path = plugin_dir_path(__FILE__) . 'elementor-42471-2024-11-09.json'; // Path to the template file

    if (file_exists($template_path)) {
        $template = file_get_contents($template_path);
        return new WP_REST_Response(json_decode($template), 200);
    }

    return new WP_REST_Response('Template file not found', 404);
}

add_action('rest_api_init', 'register_elementor_template_endpoint');
