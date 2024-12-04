---
title: Fastify
seoTitle: Fastify Documentation
sidebar_position: 1
description: Fastifyın iç yaşam döngüsü ve kullanıcı işleyici ile cevap yönetimi hakkında bilgi.
tags: 
  - Fastify
  - web framework
  - node.js
  - server-side
keywords: 
  - Fastify lifecycle
  - reply lifecycle
  - request handling
  - error handling
---


## Yaşam Döngüsü


Fastify'ın iç yaşam döngüsünün şemasını takip edin.

Her bölümün sağ dalında yaşam döngüsünün bir sonraki aşaması, sol dalda ise üst öğe bir hata fırlatırsa oluşturulacak hata kodu bulunmaktadır *(tüm hataların otomatik olarak Fastify tarafından işlendiğini unutmayın)*.

```
Gelen İstek
  │
  └─▶ Yönlendirme
        │
        └─▶ Örnek Günlüğü
             │
   4**/5** ◀─┴─▶ onRequest Kancası
                  │
        4**/5** ◀─┴─▶ preParsing Kancası
                        │
              4**/5** ◀─┴─▶ Ayrıştırma
                             │
                   4**/5** ◀─┴─▶ preValidation Kancası
                                  │
                            400 ◀─┴─▶ Doğrulama
                                        │
                              4**/5** ◀─┴─▶ preHandler Kancası
                                              │
                                    4**/5** ◀─┴─▶ Kullanıcı İşleyici
                                                    │
                                                    └─▶ Cevap
                                                          │
                                                4**/5** ◀─┴─▶ preSerialization Kancası
                                                                │
                                                                └─▶ onSend Kancası
                                                                      │
                                                            4**/5** ◀─┴─▶ Çıkış Cevabı
                                                                            │
                                                                            └─▶ onResponse Kancası
```

`Kullanıcı İşleyici` öncesinde veya süresince, `reply.hijack()` çağrılabilir ve Fastify'in:

- Tüm sonraki kancaları ve kullanıcı işleyicisini çalıştırmasını engeller
- Cevabı otomatik olarak göndermesini engeller

Not (*): Eğer `reply.raw` kullanılarak kullanıcıya bir cevap gönderilirse, `onResponse` kancaları yine de çalıştırılacaktır.

## Cevap Yaşam Döngüsü


Kullanıcı isteği işlediğinde, sonuç şu şekilde olabilir:

- asenkron işleyicide: bir yük döndürür
- asenkron işleyicide: bir `Error` fırlatır
- senkron işleyicide: bir yük gönderir
- senkron işleyicide: bir `Error` örneği gönderir

Eğer cevap kaçırıldıysa, aşağıdaki tüm adımlar atlanır. Aksi takdirde, gönderilirken gerçekleşen veri akışı şöyle:

```
                        ★ şema doğrulama Hatası
                                    │
                                    └─▶ schemaErrorFormatter
                                               │
                          cevap gönderildi ◀── JSON ─┴─ Hata örneği
                                                      │
                                                      │         ★ bir Hata fırlat
                     ★ gönder veya döndür                  │                 │
                            │                         │                 │
                            │                         ▼                 │
       cevap gönderildi ◀── JSON ─┴─ Hata örneği ──▶ setErrorHandler ◀─────┘
                                                      │
                                 cevap gönderildi ◀── JSON ─┴─ Hata örneği ──▶ onError Kancası
                                                                                │
                                                                                └─▶ cevap gönderildi
```

Not: `cevap gönderildi`, JSON yükünün şu şekilde dizileneceğini ifade eder:

- `cevap dizilimi` ayarlandıysa
- veya `dizilim derleyicisi` ayarlandığında, dönen HTTP durum kodu için bir JSON şeması belirlendiğinde
- ya da varsayılan `JSON.stringify` fonksiyonu ile