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
