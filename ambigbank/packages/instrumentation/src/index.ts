import * as opentelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export function installInstrumentation({
  serviceName,
}: {
  serviceName: string;
}) {
  console.log("installInstrumentation");
  const resource = new opentelemetry.resources.Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  });
  const sdk = new opentelemetry.NodeSDK({
    resource,
    traceExporter: new OTLPTraceExporter({
      url: "http://localhost:4318/v1/traces",
    }),
    // metricReader: new PeriodicExportingMetricReader({
    //   exporter: new OTLPMetricExporter({
    //     url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
    //     headers: {}, // an optional object containing custom headers to be sent with each request
    //   }),
    // }),
    instrumentations: [getNodeAutoInstrumentations({})],
  });
  sdk.start();
}
