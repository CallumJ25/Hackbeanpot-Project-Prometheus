import json
from typing import Any, Dict
import pytest
from pytest_mock import MockerFixture
from functions.get_stock_stats.app import lambda_handler

@pytest.fixture
def apigw_event() -> Dict[str, Any]:
    """ Generates API Gateway Event"""
    return {
        "queryStringParameters": {
            "symbol": "MSFT"
        }
    }

def test_lambda_handler_success(apigw_event: Dict[str, Any], mocker: MockerFixture) -> None:
    """ Test successful retrieval of stock stats """
    # Mock yfinance Ticker and its info property
    mock_ticker = mocker.patch("yfinance.Ticker")
    mock_ticker.return_value.info = {
        "symbol": "MSFT",
        "shortName": "Microsoft Corporation",
        "trailingEps": 11.0,
        "forwardPE": 35.0,
        "trailingPE": 36.0,
        "dividendYield": 0.007,
        "marketCap": 3000000000000,
        "beta": 0.9,
        "currency": "USD"
    }

    ret: Dict[str, Any] = lambda_handler(apigw_event, None)
    data: Dict[str, Any] = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert data["symbol"] == "MSFT"
    assert data["shortName"] == "Microsoft Corporation"

def test_lambda_handler_missing_symbol() -> None:
    """ Test error handling for missing symbol """
    event: Dict[str, Any] = {"queryStringParameters": {}}
    ret: Dict[str, Any] = lambda_handler(event, None)
    data: Dict[str, Any] = json.loads(ret["body"])

    assert ret["statusCode"] == 400
    assert "error" in data
    assert "Missing stock symbol" in data["error"]

def test_lambda_handler_invalid_symbol(mocker: MockerFixture) -> None:
    """ Test error handling for invalid symbol """
    event: Dict[str, Any] = {"queryStringParameters": {"symbol": "INVALID"}}
    
    # Mock yfinance returning empty/invalid info
    mock_ticker = mocker.patch("yfinance.Ticker")
    mock_ticker.return_value.info = {}

    ret: Dict[str, Any] = lambda_handler(event, None)
    data: Dict[str, Any] = json.loads(ret["body"])

    assert ret["statusCode"] == 404
    assert "error" in data
