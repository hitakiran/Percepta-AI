import json
import urllib.request
import urllib.error
import ssl

# Bypass SSL verification for testing purposes
ssl._create_default_https_context = ssl._create_unverified_context

API_KEY = "GzxLxK9p.qNapLjutHCn87fo4UJVX0xhLCSuLRe9F"
URL = "https://api.keywordsai.co/api/chat/completions"

data = {
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "user", "content": "Say 'Hello World'"}
    ]
}

req = urllib.request.Request(
    URL,
    data=json.dumps(data).encode('utf-8'),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(json.dumps(result, indent=2))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
