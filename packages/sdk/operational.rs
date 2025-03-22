use std::env;
use serde_json::Value;
use reqwest::blocking::Client;

// Usage Example (in main.rs)
/*
fn main() {
    let ops = Operational::new(Some("API_KEY"), false, false, None, None);

    let event = serde_json::json!({
        "name": "user_signup",
        "content": "A new user signed up",
        "category": "user-activity",
        "notify": true
    });

    if ops.ingest_event(event) {
        println!("Event logged successfully");
    } else {
        println!("Failed to log event");
    }
}
*/


pub struct Operational {
    key: String,
    debug: bool,
    test: bool,
    version: String,
    base_url: String,
    client: reqwest::blocking::Client,
}

impl Operational {
    pub fn new(key: Option<&str>, debug: bool, test: bool, version: Option<&str>, base_url: Option<&str>) -> Self {
        let api_key = key.map(String::from)
            .or_else(|| env::var("OPERATIONAL_API_KEY").ok())
            .unwrap_or_default();

        if debug && api_key.is_empty() {
            eprintln!("Missing API key. Pass it to the constructor.");
        }

        Operational {
            key: api_key,
            debug,
            test,
            version: version.unwrap_or("v1").to_string(),
            base_url: base_url.unwrap_or("https://api.operational.co").to_string(),
            client: reqwest::blocking::Client::new(),
        }
    }

    fn log_error(&self, message: &str) {
        if self.debug {
            eprintln!("[Operational Error]: {}", message);
        }
    }

    fn request(&self, endpoint: &str, data: &serde_json::Value) -> bool {
        let url = format!("{}/{}", self.base_url, endpoint);

        let response = self.client
            .post(&url)
            .header("Content-Type", "application/json")
            .bearer_auth(&self.key)
            .json(data)
            .send();

        match response {
            Ok(resp) => {
                if resp.status().is_success() {
                    true
                } else {
                    self.log_error(&format!("HTTP error: {}", resp.status()));
                    false
                }
            }
            Err(err) => {
                self.log_error(&format!("Request error: {}", err));
                false
            }
        }
    }

    pub fn ingest_event(&self, mut event: serde_json::Value) -> bool {
        if event.is_null() {
            self.log_error("Missing event data");
            return false;
        }

        if self.test {
            event["test"] = serde_json::Value::Bool(true);
            self.log_error("Sending test event");
        }

        self.request(&format!("api/{}/ingest", self.version), &event)
    }
}