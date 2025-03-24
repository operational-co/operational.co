<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://github.com/Oxfinder
 * @since      1.0.0
 *
 * @package    Operational
 * @subpackage Operational/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Operational
 * @subpackage Operational/admin
 * @author     Oxfinder <oxfinder.com@gmail.com>
 */
class Operational_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $operational    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Operational_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Operational_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// This is not needed but might be in the future
		// wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/operational-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Operational_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Operational_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// This is not needed but might be in the future
		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/operational-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Add admin menu item
	 *
	 * @since    1.0.0
	 */
	public function add_admin_menu() {
		add_menu_page(
			'Operational', // Page title
			'Operational', // Menu title
			'manage_options', // Capability required
			'operational', // Menu slug
			array($this, 'display_admin_page'), // Callback function
			'dashicons-list-view', // Icon
			30 // Position
		);
	}

	/**
	 * Register settings and fields
	 */
	public function register_settings() {

		$opts = [
			'type' => 'string',
			'sanitize_callback' => function($value) {
				return sanitize_text_field($value);
			},
			'default' => ''
		
		];
		// Register the API key setting
		// PLUGIN CHECK POTENTIAL ERROR - this is sanitized but it throws error for some reason
		register_setting(
			'operational_options',
			'operational_api_key',
			$opts
		);

		// Register the log activity setting
		// PLUGIN CHECK POTENTIAL ERROR - this is sanitized but it throws error for some reason
		register_setting(
			'operational_options',
			'operational_log_activity',
			array(
				'type' => 'boolean',
				'sanitize_callback' => function($value) {
					return $value === 'yes';
				},
				'default' => false
			)
		);

		// Add settings section
		add_settings_section(
			'operational_general_section',
			'General Settings',
			null,
			'operational_options'
		);

		// Add API key field
		add_settings_field(
			'operational_api_key',
			'API Key',
			array($this, 'api_key_field_callback'),
			'operational_options',
			'operational_general_section'
		);

		// Add log activity field
		add_settings_field(
			'operational_log_activity',
			'Log User Activity',
			array($this, 'log_activity_field_callback'),
			'operational_options',
			'operational_general_section'
		);
	}

	/**
	 * Display the admin page content
	 */
	public function display_admin_page() {
		require_once plugin_dir_path(__FILE__) . 'partials/operational-form.php';
	}

	/**
	 * Initialize hooks for user events
	 */
	public function init_user_event_hooks() {
		
		/**
		 * Login event
		 */
		add_action('wp_login', function($user_login, $user) {
			if (!get_option('operational_log_activity', false)) return;
			$content = [
        ['label' => 'Name', 'content' => $user->display_name],
        ['label' => 'Email', 'content' => $user->user_email],
        ['label' => 'ID', 'content' => $user->ID]
	    ];
	    $data = [
	    	'name' => 'wp_login',
        'avatar' => '🔑',
        'type' => 'rows',
        'content' => $content
	    ];
     \Operational\ops($data);
		}, 10, 2);

		/**
		 * Logout
		 */
		add_action('clear_auth_cookie', function() {
			if (!get_option('operational_log_activity', false)) return;
			$user = wp_get_current_user(); // Get the user before session is destroyed

    if ($user->ID !== 0) { // Ensure user is logged in
			$content = [
			  ['label' => 'Name', 'content' => $user->display_name],
			  ['label' => 'Email', 'content' => $user->user_email],
			  ['label' => 'ID', 'content' => $user->ID]
			];
			$data = [
				'name' => 'wp_logout',
			  'avatar' => '🚪',
			  'type' => 'rows',
			  'content' => $content
			];

			\Operational\ops($data);
			}
		});

		/**
		 * User signup
		 */
		add_action('register_new_user', function($user_id) {
			if (!get_option('operational_log_activity', false)) return;
			$user = get_userdata($user_id);
			$content = [
			  ['label' => 'Name', 'content' => $user->display_name],
			  ['label' => 'Email', 'content' => $user->user_email],
			  ['label' => 'ID', 'content' => $user->ID]
			];
			$data = [
				'name' => 'user_registered',
			  'avatar' => '🤗',
			  'type' => 'rows',
			  'content' => $content
			];
			\Operational\ops($data);
		});

		/**
		 * Profile updated
		 */
		add_action('profile_update', function($user_id, $old_user_data) {
			if (!get_option('operational_log_activity', false)) return;
			$user = get_userdata($user_id);
    
			// Convert user data to an associative array
			$content = $user->to_array();

			$data = [
				'name' => 'profile_updated',
				'avatar' => '✏️',
				'type' => 'json',
				'content' => $content
			];

			\Operational\ops($data);
		}, 10, 2);

		/**
		 * Failed login attempts
		 */
		add_action('wp_login_failed', function($username) {
			if (!get_option('operational_log_activity', false)) return;


    	// Get IP address of the user
    	$ip_address = '';
    	$user_agent = '';

    	// PLUGIN CHECK POTENTIAL ERROR - this is sanitized but it throws error for some reason
    	if(isset($_SERVER['REMOTE_ADDR'])) {
    		$ip_address = wp_unslash($_SERVER['REMOTE_ADDR']);
    	}
    	if(isset($_SERVER['HTTP_USER_AGENT'])) {
    		$user_agent = esc_url_raw(wp_unslash($_SERVER['HTTP_USER_AGENT']));
    	}

    	// Extract Browser and OS using regular expressions
    	$browser = $this->get_browser_name($user_agent);
    	$os = $this->get_os_name($user_agent);

    	// Get the entered password (using a global variable as an example workaround)
    	// PLUGIN CHECK POTENTIAL ERROR - this is sanitized but it throws error for some reason
	    if (isset($_POST['pwd'])) {
				// Truncate the password based on the rules you provided
				// PLUGIN CHECK POTENTIAL ERROR - this is sanitized but it throws error for some reason
				$password = esc_url_raw(wp_unslash($_POST['pwd']));

				if (strlen($password) > 4) {
				  // Truncate and append stars
				  $password = substr($password, 0, 4) . str_repeat('*', strlen($password) - 4);
				}
	    } else {
	       $password = ''; // If password isn't available for some reason
	    }

			$content = [
				'username' => $username,
				'password' => $password,
				'IP' => $ip_address,
				'user_agent' => $user_agent,
				'browser' => $browser,
				'os' => $os
			];
			$data = array(
				'name' => 'login_failed',
				'avatar' => "😕",
				'type' => 'json',
				'content' => $content,
				
			);
			\Operational\ops($data);
		});

		/**
		 * Password request
		 * DISABLED since it still needs testing
		 */
		/*
		add_action('retrieve_password_request', function($user) {
			if (!get_option('operational_log_activity', false)) return;
			$content = [
				[
					'label' => 'ID',
					'content' => $user->ID
				],
				[
					'label' => 'user_email',
					'content' => $user->user_email
				],
				[
					'label' => 'Display name',
					'content' => $user->display_name
				]
			];
			$data = [
				'avatar' => '🔑',
				'type' => 'rows',
				'content' => $content
			];
			\Operational\ops('password_reset_requested', $data);
		});
		*/

		/**
		 * Plugin activation hook
		 */
		add_action('activated_plugin', function($plugin) {
			if (!get_option('operational_log_activity', false)) return;

			   // $plugin contains the plugin file path relative to the plugins directory
	    // Example: 'my-plugin/my-plugin.php'

	    // Extract the plugin name from the file path
	    $plugin_name = basename($plugin, '.php');

	    // Optionally, get the plugin's metadata (like the plugin's name as defined in its header)
	    $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);

	    $user = wp_get_current_user();

	    $content = [
	    	['label' => 'Name', 'content' => $user->display_name],
			  ['label' => 'Email', 'content' => $user->user_email],
			  ['label' => 'ID', 'content' => $user->ID],
	    	[
	    		'label' => "Plugin data",
	    		'type' => 'json',
	    		'content' => $plugin_data
	    	]
	    ];

	    $data = [
	    	'name' => 'plugin_activated',
	    	'avatar' => "␡",
	    	'type' => 'rows',
	    	'content' => $content
	    ];

			\Operational\ops($data);
		});

		add_action('deactivated_plugin', function($plugin) {
			if (!get_option('operational_log_activity', false)) return;

	    // Extract the plugin name from the file path
	    $plugin_name = basename($plugin, '.php');

	    // Optionally, get the plugin's metadata (like the plugin's name as defined in its header)
	    $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin);

	    $user = wp_get_current_user();

	    $content = [
	    	['label' => 'Name', 'content' => $user->display_name],
			  ['label' => 'Email', 'content' => $user->user_email],
			  ['label' => 'ID', 'content' => $user->ID],
	    	[
	    		'label' => "Plugin data",
	    		'type' => 'json',
	    		'content' => $plugin_data
	    	]
	    ];

	    $data = [
	    	'name' => 'plugin_deactivated',
	    	'avatar' => "␡",
	    	'type' => 'rows',
	    	'content' => $content
	    ];

			\Operational\ops($data);
		});

		// // Theme installation and uninstallation
		add_action('switch_theme', function($old_theme, $new_theme) {
	    if (!get_option('operational_log_activity', false)) return;

	    if (!get_option('operational_log_activity', false)) return;

    	// Ensure $old_theme is a WP_Theme object, if not, fetch it
	    if (!($old_theme instanceof WP_Theme)) {
	        $old_theme_obj = wp_get_theme($old_theme);
	        $old_theme_name = $old_theme_obj->exists() ? $old_theme_obj->get('Name') : 'Unknown Theme';
	    } else {
	        $old_theme_name = $old_theme->exists() ? $old_theme->get('Name') : 'Unknown Theme';
	    }

	    // Ensure $new_theme is a WP_Theme object (it should be)
	    if (!($new_theme instanceof WP_Theme)) {
	        $new_theme = wp_get_theme();
	    }

    // Get the theme names safely
    	$new_theme_name = $new_theme->exists() ? $new_theme->get('Name') : 'Unknown Theme';


	    // Get the current user information
	    $user = wp_get_current_user();

	    // Prepare the content to be logged
	    $content = [
	        ['label' => 'Name', 'content' => $user->display_name],
	        ['label' => 'Email', 'content' => $user->user_email],
	        ['label' => 'ID', 'content' => $user->ID],
	        ['label' => 'Old Theme', 'content' => $old_theme_name],
	        ['label' => 'New Theme', 'content' => $new_theme_name],
	    ];

	    // Prepare the data for the log entry
	    $data = [
	    	  'name' => 'theme_switched',
	        'avatar' => "🖼️",
	        'type' => 'rows',
	        'content' => $content
	    ];

	    // Log the data using your custom method
	    \Operational\ops($data);
		}, 10, 2);
	}

	// Function to get browser name
	public function get_browser_name($user_agent) {
	    if (preg_match('/firefox/i', $user_agent)) {
	        return 'Firefox';
	    } elseif (preg_match('/chrome/i', $user_agent)) {
	        return 'Chrome';
	    } elseif (preg_match('/safari/i', $user_agent)) {
	        return 'Safari';
	    } elseif (preg_match('/msie/i', $user_agent) || preg_match('/trident/i', $user_agent)) {
	        return 'Internet Explorer';
	    } else {
	        return 'Unknown';
	    }
	}

// Function to get OS name
	public function get_os_name($user_agent) {
	    if (preg_match('/win/i', $user_agent)) {
	        return 'Windows';
	    } elseif (preg_match('/mac/i', $user_agent)) {
	        return 'Mac OS';
	    } elseif (preg_match('/linux/i', $user_agent)) {
	        return 'Linux';
	    } elseif (preg_match('/android/i', $user_agent)) {
	        return 'Android';
	    } elseif (preg_match('/iphone/i', $user_agent)) {
	        return 'iOS';
	    } else {
	        return 'Unknown';
	    }
	}

	/**
	 * Initialize admin hooks
	 */
	public function init_admin_menu() {
		add_action('admin_menu', array($this, 'add_admin_menu'));
		add_action('admin_init', array($this, 'register_settings'));
		
		// Initialize user event hooks
		$this->init_user_event_hooks();
	}

	/**
	 * Callback for API key field
	 */
	public function api_key_field_callback() {
		$api_key = get_option('operational_api_key');
		echo '<input type="text" id="operational_api_key" name="operational_api_key" value="' . esc_attr($api_key) . '" class="regular-text">';
	}

	/**
	 * Callback for log activity field
	 */
	public function log_activity_field_callback() {
		$log_activity = get_option('operational_log_activity', false);
		?>
		<fieldset>
			<label>
				<input type="radio" 
					   name="operational_log_activity" 
					   value="yes" 
					   <?php checked(true, $log_activity); ?>>
				Yes
			</label>
			<br>
			<label>
				<input type="radio" 
					   name="operational_log_activity" 
					   value="no" 
					   <?php checked(false, $log_activity); ?>>
				No
			</label>
		</fieldset>
		<?php
	}

}
