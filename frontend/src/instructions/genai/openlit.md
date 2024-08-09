# LLM Application Monitoring with OpenTelemetry

### Install `openlit` Library

To start collecting telemetry data from your application, you first need to install the `openlit`. This SDK is assumed to be an OpenTelemetry-based tool that simplifies the process of collecting traces and other LLM data.

```shell
pip install openlit
```

### Create Grafana Cloud Token

A Grafana Cloud token is necessary for authentication when sending telemetry data to Grafana Cloud. The provided token should be kept secure and used in your application's environment variables for authorization.

```

```

### Add Environment Variables

Setting these environment variables configures the SDK with the necessary endpoint and headers to securely send telemetry data to Grafana Cloud.

To get these variables, Follow the below steps
1. Sign in to Grafana Cloud Portal and select your Grafana Cloud Stack.
2. Click Configure in the OpenTelemetry section.
3. In the Password / API Token section, click on Generate now to create a new API token:
4. Give the API token a name, for example openlit
5. Click on Create token
6. Click on Close without copying the token
7. Copy and Save the value for `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS`

> Note: Replace the space after Basic with %20: OTEL_EXPORTER_OTLP_HEADERS=“Authorization=Basic%20[base64 instanceID:token]”

```shell
export OTEL_EXPORTER_OTLP_ENDPOINT="YOUR_OTEL_GATEWAY_URL"
export OTEL_EXPORTER_OTLP_HEADERS = "Authorization=Basic%20<base64 encoded Instance ID and API Token>"
```

### Instrument your code

To begin collecting telemetry data, initialize the `openlit` library at the start of your application. This simple step hooks into your application to start monitoring its performance and behavior.
    
```python 
import openlit

openlit.init()
```
