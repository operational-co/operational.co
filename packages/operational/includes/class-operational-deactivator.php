<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://operational.co
 * @since      1.0.0
 *
 * @package    Operational
 * @subpackage Operational/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Operational
 * @subpackage Operational/includes
 * @author     Shash <shash@operational.co>
 */
class Operational_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {
		delete_option('operational_log_activity');
		delete_option('operational_api_key');
	}

}
