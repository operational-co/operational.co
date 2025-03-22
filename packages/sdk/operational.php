<?php
/**
 * Usage:
 * 
 * 
require_once 'Operational.php';
$ops = new Operational('your-api-key', [
	'debug' => true, // Set true to enable logging errors for debugging
	'test' => true   // Set true if you want to send test events
]);

$ops->ingestEvent

 * 
 */
<?php

class Operational {
	private $key;
	private $debug = false;
	private $test = false;
	private $version = 'v1';
	private $baseUrl = 'https://operational.co';

	public function __construct($key = null, $opts = []) {
		if (!$key) {
			$this->key = getenv('OPERATIONAL_API_KEY');
			if (!$this->key) {
					$this->logError("Missing API key. Pass it to the constructor.");
			}
		} else {
			$this->key = $key;
		}

		if (isset($opts['debug']) && $opts['debug']) {
			$this->debug = true;
		}

		if (isset($opts['test']) && $opts['test']) {
			$this->test = true;
		}

		if(isset($opts['baseUrl'])) {
			$this->baseUrl = $opts['baseUrl'];
		}
	}

	private function logError($message) {
		if ($this->debug) {
			error_log($message);
		}
	}

	private function request($endpoint, $data) {
		$url = "{$this->baseUrl}/{$endpoint}";

		$headers = [
			"Content-Type: application/json",
			"Authorization: Bearer {$this->key}",
		];

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

		$response = curl_exec($ch);
		$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

		if (curl_errno($ch)) {
			$error_msg = curl_error($ch);
			curl_close($ch);
			$this->logError($error_msg);
			return null;
		}

		curl_close($ch);

		if ($statusCode >= 400) {
			$this->logError("HTTP error: {$statusCode} - {$response}");
			return null;
		}

		return json_decode($response, true);
	}

	public function logEvent($event) {
			if (empty($event)) {
					$this->logError("Missing event data");
					return null;
			}

			if ($this->test) {
					$event['test'] = true;
					$this->logError('Sending test event');
			}

			return $this->request("api/{$this->version}/log", $event);
	}
}

