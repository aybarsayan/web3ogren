---
sidebar_position: 13
---

# Metrics API

API, istemcilerin bir düğümün sağlık ve performansı hakkında istatistikler almasına olanak tanır.

## Uç Nokta

```text
/ext/metrics
```

## Kullanım

Düğüm metriklerini almak için:

```sh
curl -X POST 127.0.0.1:9650/ext/metrics
```

## Format

Bu API, Prometheus ile uyumlu metrikler üretmektedir. Prometheus formatı hakkında daha fazla bilgi için  göz atabilirsiniz.