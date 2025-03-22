<?php
/**
 * Admin form template for Operational plugin
 *
 * @package    Operational
 * @subpackage Operational/admin/partials
 */

// If this file is called directly, abort.
if (!defined('ABSPATH')) {
    die;
}
?>

<div class="wrap">

    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="notice notice-info">
        <p><strong>This plugin requires an Operational.co API key.</strong></p>
        <p>Get yours from <a href="https://operational.co" target="_blank">Operational.co</a>.</p>
        <p>Once you have the key, enter it below and set <strong>'Log User Activity'</strong> to <code>Yes</code>.</p>
    </div>
    
    <form method="post" action="options.php">
        <?php 
            // Add nonce field
            wp_nonce_field('operational_settings_nonce', 'operational_nonce');
            
            settings_fields('operational_options');
            do_settings_sections('operational_options');
        ?>
        
        
        <?php submit_button('Save Settings'); ?>
    </form>

    <h2>
      How to use inside your theme?
    </h2>

    <p>
      Import the Operational\ops function inside your theme and track events specific to your usecase.
    </p>
    <p>
      Read Operational's <a href="https://operational.co/api" target="_blank">API Docs</a> for more info.
    </p>


    <pre><code>// Run this inside your functions.php
use function Operational\ops;

$response = ops([
    'name' => 'test_event',
    'avatar' => '😃',
    'notify' => true // Optional, sends a push notification
]);</code></pre>

</div>