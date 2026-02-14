import json
from typing import Any, Dict, List, Optional
import yfinance as yf
from datetime import datetime, date


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to simulate a portfolio over a date range.

    Expected event body (JSON):
    {
      "starting_cash": 10000,
      "start_year": 2015,
      "end_year": 2020,
      "tickers": ["AAPL", "MSFT", "GOOGL"]
    }

    Returns:
    {
      "final_cash": 18500.00,
      "roi": 0.85,
      "ticker_breakdown": { ... }
    }

    Simulation rules:
    - Cash is split equally across all tickers.
    - Shares are bought at the open price on the first trading day of start_year.
    - Dividends are reinvested: on each ex-dividend day, the dividend cash buys
      additional shares at that day's closing price.
    - Shares are sold at the close price on the last trading day of end_year.
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

        starting_cash: Optional[float] = body.get('starting_cash')
        start_year: Optional[int] = body.get('start_year')
        end_year: Optional[int] = body.get('end_year')
        tickers: Optional[List[str]] = body.get('tickers')

        # Validate inputs
        if starting_cash is None or start_year is None or end_year is None or not tickers:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields: starting_cash, start_year, end_year, tickers'})
            }

        starting_cash = float(starting_cash)
        start_year = int(start_year)
        end_year = int(end_year)

        if starting_cash <= 0:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'starting_cash must be positive'})
            }

        if start_year > end_year:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'start_year must be <= end_year'})
            }

        # Date range: start of start_year to end of end_year
        start_date = f"{start_year}-01-01"
        end_date = f"{end_year}-12-31"

        cash_per_ticker = starting_cash / len(tickers)
        ticker_breakdown: Dict[str, Any] = {}
        total_final_value = 0.0
        failed_tickers = []

        for symbol in tickers:
            symbol = symbol.upper().strip()
            try:
                tk = yf.Ticker(symbol)

                # Download OHLCV history for the full period
                history = tk.history(start=start_date, end=end_date, auto_adjust=False)

                if history.empty:
                    failed_tickers.append(symbol)
                    ticker_breakdown[symbol] = {'error': 'No price data available for this period'}
                    continue

                # Buy at open on first available trading day
                buy_price = float(history['Open'].iloc[0])
                buy_date = history.index[0].date().isoformat()

                if buy_price <= 0:
                    failed_tickers.append(symbol)
                    ticker_breakdown[symbol] = {'error': 'Invalid buy price'}
                    continue

                shares = cash_per_ticker / buy_price

                # Reinvest dividends: on each ex-dividend day buy more shares
                # at that day's closing price
                total_dividends_reinvested = 0.0
                if 'Dividends' in history.columns:
                    for row_date, row in history.iterrows():
                        div = float(row['Dividends'])
                        if div > 0:
                            close_price = float(row['Close'])
                            if close_price > 0:
                                dividend_cash = shares * div
                                new_shares = dividend_cash / close_price
                                shares += new_shares
                                total_dividends_reinvested += dividend_cash

                # Sell at close on last available trading day
                sell_price = float(history['Close'].iloc[-1])
                sell_date = history.index[-1].date().isoformat()

                proceeds = shares * sell_price
                ticker_roi = (proceeds - cash_per_ticker) / cash_per_ticker

                ticker_breakdown[symbol] = {
                    'buy_date': buy_date,
                    'buy_price': round(buy_price, 4),
                    'sell_date': sell_date,
                    'sell_price': round(sell_price, 4),
                    'final_shares': round(shares, 6),
                    'dividends_reinvested': round(total_dividends_reinvested, 2),
                    'initial_investment': round(cash_per_ticker, 2),
                    'final_value': round(proceeds, 2),
                    'roi': round(ticker_roi, 6),
                }

                total_final_value += proceeds

            except Exception as ticker_err:
                failed_tickers.append(symbol)
                ticker_breakdown[symbol] = {'error': str(ticker_err)}

        # For failed tickers, return their cash allocation unchanged
        total_final_value += cash_per_ticker * len(failed_tickers)

        overall_roi = (total_final_value - starting_cash) / starting_cash

        result = {
            'starting_cash': round(starting_cash, 2),
            'final_cash': round(total_final_value, 2),
            'roi': round(overall_roi, 6),
            'roi_percent': round(overall_roi * 100, 4),
            'start_year': start_year,
            'end_year': end_year,
            'tickers': tickers,
            'ticker_breakdown': ticker_breakdown,
        }

        if failed_tickers:
            result['failed_tickers'] = failed_tickers
            result['note'] = f"{len(failed_tickers)} ticker(s) failed; their cash allocation was returned unchanged."

        return {
            'statusCode': 200,
            'body': json.dumps(result, indent=2)
        }

    except Exception as e:
        print(f"Error processing request: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
