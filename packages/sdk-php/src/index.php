<?php

namespace Operational;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;

class Operational
{
    private string $key;
    private Client $http;
    private string $version = 'v1';
    private string $baseUrl = 'https://api.operational.co';
    private bool $silentError = false;
    private bool $test = false;
    private bool $debug = false;

    public function __construct(?string $key = null, array $opts = [])
    {
        if (!$key) {
            $key = getenv('OPERATIONAL_API_KEY') ?: null;
        }
        if (!$key) {
            throw new \InvalidArgumentException('Missing API key. Pass it to the constructor or set OPERATIONAL_API_KEY env var.');
        }
        $this->key = $key;

        if (!empty($opts['debug'])) {
            $this->debug = true;
        }
        if (!empty($opts['test'])) {
            $this->test = true;
        }
        if (!empty($opts['silentError'])) {
            $this->silentError = (bool)$opts['silentError'];
        }
        if (!empty($opts['baseUrl'])) {
            $this->baseUrl = (string)$opts['baseUrl'];
        }

        $this->http = new Client([
            'base_uri' => $this->baseUrl,
            'headers'  => [
                'Authorization' => "Bearer {$this->key}",
                'Content-Type'  => 'application/json',
            ],
        ]);
    }

    private function logError(string $message): void
    {
        if ($this->debug) {
            error_log($message);
        }
    }

    private function formatError(\Throwable $e): void
    {
        if ($e instanceof GuzzleException && method_exists($e, 'getResponse') && $e->getResponse()) {
            $response = $e->getResponse();
            $status   = $response->getStatusCode();
            $body     = (string)$response->getBody();
            if ($status >= 500) {
                $this->logError("Err {$status}");
            } else {
                $this->logError($body);
                $this->logError((string)$status);
            }
        } else {
            $this->logError($e->getMessage());
        }
    }

    public function ingest(array $event): ?ResponseInterface
    {
        if (empty($event)) {
            throw new \InvalidArgumentException('Missing event data');
        }
        $url = "api/{$this->version}/log";
        if ($this->test) {
            $event['test'] = true;
            if ($this->debug) {
                $this->logError('Sending test event');
            }
        }

        try {
            return $this->http->post($url, ['json' => $event]);
        } catch (\Throwable $e) {
            if (!$this->silentError) {
                // rethrow or swallow?
            }
            $this->formatError($e);
            return null;
        }
    }

    public function identify(array $user): ?ResponseInterface
    {
        if (empty($user)) {
            throw new \InvalidArgumentException('Missing user data');
        }
        $url = "api/{$this->version}/identify";

        try {
            return $this->http->post($url, ['json' => $user]);
        } catch (\Throwable $e) {
            if (!$this->silentError) {
                // rethrow or swallow?
            }
            $this->formatError($e);
            return null;
        }
    }

    public function setSilentError(bool $silent): void
    {
        $this->silentError = $silent;
    }

    public function setDebug(bool $debug): void
    {
        $this->debug = $debug;
    }

    public function setTest(bool $test): void
    {
        $this->test = $test;
    }
}