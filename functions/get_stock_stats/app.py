import json
from typing import Any, Dict, Optional
import yfinance as yf

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to fetch stock statistics using yfinance.

    Expected event structure:
    {
      "queryStringParameters": {
        "symbol": "MSFT" # e.g., MSFT, AAPL, GOOGL
      }
    }

    Implementation details:
    1. The function expects a stock symbol in the `queryStringParameters` of the event.
    2. It uses the `yfinance` library to fetch information for the given symbol.
    3. It retrieves key statistics like EPS, PE ratio, dividends, market cap, and beta.
    4. If the symbol is not provided or invalid, it returns an appropriate error.
    5. The `yfinance` library needs to be included in the Lambda deployment package.
    """
    try:
        # Extract stock symbol from event
        query_params: Optional[Dict[str, Any]] = event.get('queryStringParameters')
        symbol: Optional[str] = query_params.get('symbol') if query_params else None

        if not symbol:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing stock symbol in query parameters.'})
            }

        # Fetch stock data using yfinance
        ticker: yf.Ticker = yf.Ticker(symbol)
        info: Dict[str, Any] = ticker.info

        if not info or not isinstance(info, dict) or info.get('quoteType') is None:
            return {
                'statusCode': 404,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': f'Stock symbol {symbol} not found or invalid.'})
            }

        # Extract relevant statistics
        statistics: Dict[str, Any] = {
            'symbol': info.get('symbol'),
            'shortName': info.get('shortName'),
            'trailingEps': info.get('trailingEps'),
            'epsTrailingTwelveMonths': info.get('epsTrailingTwelveMonths'),
            'forwardEps': info.get('forwardEps'),
            'forwardPE': info.get('forwardPE'),
            'trailingPE': info.get('trailingPE'),
            'dividendYield': info.get('dividendYield'),
            'marketCap': info.get('marketCap'),
            'beta': info.get('beta'),
            'currency': info.get('currency'),
        }

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(statistics, indent=2)
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }
