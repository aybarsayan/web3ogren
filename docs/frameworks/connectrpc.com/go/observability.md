---
title: Görselleştirme
seoTitle: OpenTelemetry ile Connect Entegrasyonu
sidebar_position: 11
description: Bu kılavuz, OpenTelemetryyi Connect projenizde nasıl etkinleştireceğinizi ve izlemede en iyi uygulamaları açıklar. Ayrıca performansı artırmak için öneriler sunar.
tags: 
  - OpenTelemetry
  - Connect
  - İzleme
  - RPC
keywords: 
  - OpenTelemetry
  - Connect
  - İzleme
  - metrikler
---
Connect, `net/http` ile yakın çalışır, bu da `http.Handler` veya `http.Client` ile çalışan herhangi bir günlükleme, izleme veya metriklerin Connect ile de çalışacağı anlamına gelir. Özellikle, [otelhttp](https://pkg.go.dev/go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp) OpenTelemetry paketi ve [ochttp](https://pkg.go.dev/go.opencensus.io/plugin/ochttp) OpenCensus paketi, Connect sunucuları ve istemcileri ile kusursuz bir şekilde entegre olur.

:::note
Daha ayrıntılı, RPC odaklı metrikler için, [otelconnect] paketini kullanın. Bu paket, OpenTelemetry metrikleriniz ile entegre çalışarak önemli bilgileri toplar.
:::

- `rpc.system`: Bu çağrı gRPC, gRPC-Web veya Connect miydi?
- `rpc.service` ve `rpc.method`: Hangi hizmet ve yöntem çağrıldı?
- `responses_per_rpc`: Akış yanıtlarına kaç mesaj yazıldı?
- `error_code`/`status_code`: Hangi spesifik gRPC veya Connect hatası döndürüldü?

OpenTelemetry oldukça karmaşık olabilir, bu nedenle bu kılavuz, okuyucuların aşağıdakiler ile aşina olduğunu varsayıyor:

- [görselleştirme](https://opentelemetry.io/docs/concepts/observability-primer/) nedir.
- [OpenTelemetry metrikleri ve izleme](https://opentelemetry.io/docs/reference/specification/) hakkında temel bir anlayış.
- [TextMapPropagators](https://opentelemetry.io/docs/reference/specification/context/api-propagators/), [MeterProviders](https://opentelemetry.io/docs/reference/specification/metrics/sdk/) ve [TraceProviders](https://opentelemetry.io/docs/concepts/signals/traces/) nasıl başlatılır ve kullanılır.

## Connect için OpenTelemetry'yi Etkinleştirme

Uygulamanızda OpenTelemetry'yi kurduğunuzda, bir Connect projesinde OpenTelemetry'yi etkinleştirmek, Connect işleyici ve istemci oluşturucularında [otelconnect.NewInterceptor] seçeneğini eklemek kadar basittir. Eğer uygulamanızda OpenTelemetry yoksa, [OpenTelemetry Go başlangıç kılavuzu](https://opentelemetry.io/docs/instrumentation/go/getting-started/) 'na başvurabilirsiniz.

```go
// highlight-next-line
import "connectrpc.com/otelconnect"

// highlight-start
otelInterceptor, err := otelconnect.NewInterceptor()
if err != nil {
	log.Fatal(err)
}
// highlight-end

path, handler := greetv1connect.NewGreetServiceHandler(
	greeter,
	// highlight-start
	connect.WithInterceptors(otelInterceptor),
	// highlight-end
)

client := greetv1connect.NewGreetServiceClient(
	http.DefaultClient,
	"http://localhost:8080",
	// highlight-start
	connect.WithInterceptors(otelInterceptor),
	// highlight-end
)
```

Varsayılan olarak, bu, aşağıdakileri kullanacaktır:

- `otel.GetTextMapPropagator()`'dan TextMapPropagator
- `global.MeterProvider()`'dan MeterProvider
- `otel.GetTracerProvider()`'dan TracerProvider

## Özel MeterProvider, TraceProvider ve TextMapPropagators Kullanımı

Tek bir ikili dosyada birden fazla uygulama çalıştırıldığında veya farklı kod bölümlerinin farklı dışlayıcılar kullanması gerektiğinde, doğru dışlayıcıları [otelconnect.NewInterceptor] 'a açıkça iletin:

- TracerProvider'ı ayarlamak için [otelconnect.WithTracerProvider]
- MeterProvider'ı ayarlamak için [otelconnect.WithMeterProvider]
- TextMapPropagator'ı ayarlamak için [otelconnect.WithPropagator]

```go
// newInterceptor, Connect istemcilerini ve işleyicilerini özel OpenTelemetry metrikleri, izlemesi ve yayılımı kullanarak donatır.
func newInterceptor(tp trace.TracerProvider, mp metric.MeterProvider, p propagation.TextMapPropagator) (connect.Interceptor, error) {
	return otelconnect.NewInterceptor(
		otelconnect.WithTracerProvider(tp),
		otelconnect.WithMeterProvider(mp),
		otelconnect.WithPropagator(p),
	)
}
```

## İç mikro hizmetler için yapılandırma

Varsayılan olarak, [otelconnect] ile enstrümantize edilmiş sunucular ihtiyatlıdır ve internetle yüzleşiyormuş gibi davranırlar. İstemciden gönderilen herhangi bir izleme bilgisine güvenmezler ve her istek için yeni izleme aralıkları oluştururlar. Yeni aralıklar, referans için uzak aralıkla bağlantılıdır (OpenTelemetry'nin [trace.Link] kullanarak), ancak izleme arayüzleri isteği yeni bir üst düzey işlem olarak gösterir.

:::warning
Sunucunuz bir iç mikro hizmet olarak dağıtıldığında, [otelconnect] 'in istemcinin izleme bilgisine güvenmesini sağlamak için [otelconnect.WithTrustRemote] kullanarak yapılandırın. Bu seçenekle, sunucular her istek için çocuk aralıkları oluşturacaktır.
:::

## Metrikleri ve izleme kardinalitesini azaltma

Varsayılan olarak, [OpenTelemetry RPC konvansiyonları](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/rpc.md) sunucu tarafı yüksek kardinalite metrikleri ve izleme çıktısı üretir. Özellikle, sunucular tüm metrikleri ve izleme verilerini sunucunun IP adresi ve uzak port numarası ile etiketler. Bu nitelikleri bırakmak için [otelconnect.WithoutServerPeerAttributes] kullanın. Daha özelleştirilebilir nitelik filtreleme için [otelconnect.WithFilter] kullanın.

[otelconnect]: https://pkg.go.dev/connectrpc.com/otelconnect
[OpenTelemetry]: https://opentelemetry.io/
[trace.Link]: https://pkg.go.dev/go.opentelemetry.io/otel/trace#Link
[otelconnect.WithTracerProvider]: https://pkg.go.dev/connectrpc.com/otelconnect#WithTracerProvider
[otelconnect.WithMeterProvider]: https://pkg.go.dev/connectrpc.com/otelconnect#WithMeterProvider
[otelconnect.WithPropagator]: https://pkg.go.dev/connectrpc.com/otelconnect#WithPropagator
[otelconnect.NewInterceptor]: https://pkg.go.dev/connectrpc.com/otelconnect#NewInterceptor
[otelconnect.WithTrustRemote]: https://pkg.go.dev/connectrpc.com/otelconnect#WithTrustRemote
[otelconnect.WithFilter]: https://pkg.go.dev/connectrpc.com/otelconnect#WithFilter
[otelconnect.WithoutServerPeerAttributes]: https://pkg.go.dev/connectrpc.com/otelconnect#WithoutServerPeerAttributes