# GPU Monitoring with OpenTelemetry

## Using the OpenLIT SDK

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

openlit.init(collect_gpu_stats=True)
```

## Using the OTel GPU Collector

### Installation

You can quickly start using the OTel GPU Collector by pulling the Docker image:

```sh
docker pull ghcr.io/openlit/otel-gpu-collector:latest
```

### Running the Container

Here's a quick example showing how to run the container with the required environment variables:

```sh
docker run --gpus all \
    -e GPU_APPLICATION_NAME='chatbot' \
    -e GPU_ENVIRONMENT='staging' \
    -e OTEL_EXPORTER_OTLP_ENDPOINT="YOUR_OTEL_GATEWAY_URL" \
    -e OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20<base64 encoded Instance ID and API Token>" \
    ghcr.io/openlit/otel-gpu-collector:latest
```