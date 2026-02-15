import json
import os
from typing import Any, Dict, Optional
import urllib.request
import urllib.error


GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
GEMINI_API_URL = (
    'https://generativelanguage.googleapis.com/v1beta/models/'
    'gemini-2.0-flash:generateContent?key={api_key}'
)

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to run a prompt through the Gemini API.

    Expected event body (JSON):
    {
      "instructions": "Explain the concept of compound interest in simple terms."
    }

    Returns:
    {
      "output": "Compound interest is ..."
    }
    """
    try:
        # Parse body
        body: Dict[str, Any] = {}
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        elif isinstance(event.get('body'), dict):
            body = event['body']
        else:
            body = event  # direct invocation

        instructions: Optional[str] = body.get('instructions')

        if not instructions or not instructions.strip():
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing required field: instructions'})
            }

        if not GEMINI_API_KEY:
            return {
                'statusCode': 500,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'GEMINI_API_KEY is not configured'})
            }

        # Build request payload
        payload = {
            'contents': [
                {
                    'parts': [{'text': instructions}]
                }
            ]
        }

        url = GEMINI_API_URL.format(api_key=GEMINI_API_KEY)
        request_data = json.dumps(payload).encode('utf-8')

        req = urllib.request.Request(
            url,
            data=request_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(req) as response:
            response_body = json.loads(response.read().decode('utf-8'))

        # Extract text from response
        output = (
            response_body
            .get('candidates', [{}])[0]
            .get('content', {})
            .get('parts', [{}])[0]
            .get('text', '')
        )

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'output': output})
        }

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"Gemini API HTTP error {e.code}: {error_body}")
        return {
            'statusCode': e.code,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': f'Gemini API error: {error_body}'})
        }
    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }
