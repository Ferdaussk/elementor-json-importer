<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Elementor_Add_Template_Button_Widget extends \Elementor\Widget_Base {

    public function get_name() {
        return 'add_template_button';
    }

    public function get_title() {
        return __( 'Add Template Button', 'elementor' );
    }

    public function get_icon() {
        return 'eicon-plus-square';
    }

    public function get_categories() {
        return [ 'general' ];
    }

    protected function _register_controls() {

        $this->start_controls_section(
            'section_content',
            [
                'label' => __( 'Add Template', 'elementor' ),
            ]
        );

        $this->add_control(
            'add_template_button',
            [
                'label' => __( 'Add Template', 'elementor' ),
                'type' => \Elementor\Controls_Manager::BUTTON,
                'button_type' => 'success',
                'text' => __( 'Add Template', 'elementor' ),
                'separator' => 'before',
            ]
        );

        $this->end_controls_section();
    }

    protected function render() {
        ?>
        <div class="elementor-control-add_template_button">
            <button class="elementor-button elementor-add-template-trigger">
                <?php echo esc_html($this->get_settings_for_display('add_template_button')); ?>
            </button>
        </div>
        <?php
    }
    
}
?>
