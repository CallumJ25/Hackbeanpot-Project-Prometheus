# Testing and Debugging AWS Lambda (Python + SAM) in VSCode

This project demonstrates how to set up a robust testing and debugging environment for AWS Lambda functions using Python, AWS SAM, and VSCode.

## 1. Project Structure
The project follows a standard AWS SAM structure:
- `functions/get_stock_stats/app.py`: The Lambda handler code for fetching stock statistics.
- `template.yaml`: AWS SAM template defining resources.
- `requirements.txt`: Python dependencies.
- `events/event.json`: Sample event for local testing.
- `tests/unit/`: Unit tests using `pytest`.
- `.vscode/launch.json`: VSCode debug configurations.

## 2. Prerequisites & Installation

### A. AWS CLI & SAM CLI
1.  **AWS CLI**:
    *   **Windows**: Download and run the [64-bit MSI installer](https://awscli.amazonaws.com/AWSCLIV2.msi).
    *   **macOS**: Download the [pkg installer](https://awscli.amazonaws.com/AWSCLIV2.pkg).
    *   **Linux**: Use `curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install`.
2.  **AWS SAM CLI**:
    *   Follow the [official AWS SAM installation guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
    *   Verify with `sam --version`.

### B. Docker
Docker is required for `sam local` to create a containerized environment that matches the AWS Lambda runtime.
1.  **Windows/macOS**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
    *   **Windows Note**: Ensure **WSL 2** is enabled and Docker is configured to use the WSL 2 engine.
2.  **Linux**: Install Docker Engine via your package manager (e.g., `apt install docker.io`).
3.  **Verification**: Run `docker ps` to ensure the daemon is running.

### C. Python 3.9+
Install via [python.org](https://www.python.org/downloads/) or your system package manager.

### D. VSCode Extensions
Install these from the Extensions Marketplace (`Ctrl+Shift+X`):
*   **AWS Toolkit**: Enables SAM integration, local debugging, and resource management.
*   **Python (Pylance)**: Provides IntelliSense, linting, and type checking.
*   **Docker**: Helps manage the containers used by SAM.

## 3. Local Testing with SAM CLI
You can invoke the Lambda function locally using a containerized environment that mimics AWS:

```bash
# Build the project (installs dependencies from requirements.txt)
sam build

# 1. Direct function invocation
sam local invoke StockStatsFunction --event events/event.json

# 2. Local API Gateway (Tests the backend as a REST API)
sam local start-api --port 3001
# Now you can test via browser or curl:
# curl "http://localhost:3001/stats?symbol=MSFT"
```

## 4. Connecting to AWS and Deployment

To move from local testing to the real AWS environment, you need to configure your credentials and deploy the stack.

### A. Configure AWS Credentials
1.  **Create an IAM User**: Go to the AWS Console -> IAM -> Users. Create a user with `AdministratorAccess` (for development) and "Programmatic access".
2.  **Get Access Keys**: Download the `Access Key ID` and `Secret Access Key`.
3.  **Configure CLI**: Run the following command in your terminal:
    ```bash
    aws configure
    ```
    Enter your keys and preferred region (e.g., `us-east-1`) when prompted.

### B. Deploying to AWS
Once configured, use the SAM guided deployment for the first time:

```bash
# 1. Build the latest code
sam build

# 2. Guided deployment (First time only)
sam deploy --guided
```

**During `--guided` prompts:**
*   **Stack Name**: Give it a name like `stock-stats-backend`.
*   **Confirm changes before deploy**: Yes.
*   **Allow SAM CLI IAM role creation**: Yes.
*   **Disable rollback**: No.
*   **StockStatsFunction has no authentication. Is this okay?**: Yes (since this is a public demo API).
*   **Save arguments to configuration file**: Yes (this creates `samconfig.toml`).

### C. Finding your Production URL
After deployment completes, look at the **Outputs** table in the terminal:
*   Key: `StockStatsApi`
*   Value: `https://xyz.execute-api.us-east-1.amazonaws.com/Prod/stats/`

Use this URL in your frontend production configuration.

## 5. Local Website/Frontend Testing
Since this project uses Vite (as seen in `vite.config.js`), you can run the frontend locally and connect it to your local SAM API.

### A. Run the Frontend
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The website will typically be available at `http://localhost:5173`.

### B. Connecting Frontend to Local Backend
1. Ensure `sam local start-api --port 3001` is running.
2. In your frontend code (e.g., `src/config.js` or where you make API calls), set your API base URL to `http://localhost:3001`.
3. **CORS Note**: SAM local enables CORS by default if configured in `template.yaml`. If you hit CORS issues, ensure your `template.yaml` Globals section includes:
   ```yaml
   Globals:
     Api:
       Cors:
         AllowMethods: "'GET,POST,OPTIONS'"
         AllowHeaders: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
         AllowOrigin: "'*'"
   ```

## 5. Debugging in VSCode
Two methods are configured in `.vscode/launch.json`:

### A. SAM Local Invoke (Recommended)
1. Set a breakpoint in `hello_world/src/lambda_function.py`.
2. Open the **Run and Debug** view in VSCode.
3. Select **"SAM: Local StockStatsFunction"**.
4. Press `F5`. The AWS Toolkit will use Docker to run the function and attach the debugger.

### B. Direct Python Debugging
For faster iteration on logic that doesn't require SAM's environment:
1. Select **"Direct: Python Lambda Handler"**.
2. Press `F5`. This runs the `app.py` script as a standard Python module.

## 5. Unit Testing with Pytest
Unit tests are the fastest way to verify logic without Docker.

```bash
# 1. Install dependencies and test runner
pip install -r requirements.txt

# 2. Run all unit tests
pytest

# 3. Run specific test file with verbose output
pytest tests/unit/test_handler.py -v

# 4. Run tests and see print statements (standard output)
pytest -s
```

### Understanding `tests/unit/test_handler.py`
The unit tests are designed to be fast and isolated:
- **Fixtures**: `apigw_event` provides a consistent mock API Gateway event structure.
- **Mocking (`mocker`)**: We use `pytest-mock` to intercept `yfinance.Ticker`. This prevents the tests from making actual internet requests to Yahoo Finance, ensuring they are:
    1. **Fast**: No network latency.
    2. **Reliable**: Won't fail if the API is down or the stock price changes.
    3. **Deterministic**: We control exactly what data the "API" returns.
- **Assertions**: We verify that the `statusCode` is correct (e.g., 200 for success, 400 for missing params) and that the JSON body contains the expected keys.

## 6. Recommended VSCode Extensions
- **AWS Toolkit**: Provides the `aws-sam` debug type, S3/Lambda explorers, and CloudWatch log viewing.
- **Python**: Necessary for IntelliSense, linting, and unit test discovery.
- **Thunder Client / Postman**: Useful if you use `sam local start-api` to test your Lambda via a local HTTP endpoint.
