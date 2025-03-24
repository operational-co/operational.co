import requests
import os
import logging

'''
How to use:

ops = Operational(key='API_KEY')

# Log an event
event = {
    'name': 'user_signup',
    'content': 'A new user has signed up.',
    'category': 'user-activity',
    'notify': True,
    'avatar': '🐍'
}

response = ops.ingest_event(event)
'''

class Operational:
    def __init__(self, key=None, debug=False, test=False, version='v1', base_url='https://api.operational.co'):
        self.key = key
        self.debug = debug
        self.test = test
        self.version = version
        self.base_url = base_url

        if not self.key:
            self.log_error("Missing API key. Pass it to the constructor or set OPERATIONAL_API_KEY environment variable.")

    def log_error(self, message):
        if self.debug and message:
            logging.error(message)

    def request(self, endpoint, data):
        url = f"{self.base_url}/{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.key}',
        }

        try:
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()
            return None
        except requests.exceptions.RequestException as e:
            self.log_error(f"HTTP error: {str(e)}")
            return None

    def ingest_event(self, event):
        if not event:
            self.log_error("Missing event data")
            return None

        if self.test:
            event['test'] = True
            self.log_error('Sending test event')

        response = self.request(f"api/{self.version}/ingest", event)
        self.log_error(response)
        return response
      
