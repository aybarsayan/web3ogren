---
title: Renderer
description: Rendering options and types in Listr, their configurations, and usage examples.
keywords: [Listr, renderer, options, tasks, subtask, JSON output, terminal]
order: 1
tag:
  - basic
category:
  - renderer
---



Renderers, _Listr_ ile iletişim arayüzüdür.



Dört ana renderleyici vardır: `default`, `simple`, `verbose` ve `silent`, ayrıca `test` adlı bir test renderleyicisi bulunmaktadır.

> _DefaultRenderer_ varsayılan seçimdir.  
> — Listr Documentation

Eğer ortam kendisini TTY dışı olarak ilan ediyorsa otomatik olarak yedek renderleyiciye geçecektir.

:::tip
_SimpleRenderer_, _DefaultRenderer_'a alternatif olarak sunulmaktadır. Tüm yeteneklerine sahip olmasına rağmen, eğer istemci kullanmıyorsanız `vt100` uyumlu terminalinizi güncellemeye çalışmaz.
:::

 itibarıyla yedek renderleyici için varsayılan seçim olarak atanmıştır. 

_VerboseRenderer_,  öncesinde yedek renderleyici için varsayılan seçimdi. Tamamen metin tabanlı bir renderleyicidir. 

_SilentRenderer_, _Task_'ın _Subtask_'ı için kullanılır çünkü üst görev zaten bir renderleyici başlatmıştır. Bu renderleyici, `listr2`'yi yalnızca görev listesi olarak kullanmak için de kullanılabilir; böylece iletişim yönteminiz veya bir günlüğü istediğiniz şekilde kullanabilirsiniz. 

:::info
_TestRenderer_, belirli olaylar gerçekleştiğinde yalnızca satır başına JSON çıktısı üretecektir.
:::

## _Listr_ ve _Subtask_ Renderleyici Seçenekleri ve Per _Task_ Renderleyici Seçenekleri 

Renderleyiciler, `rendererOptions` aracılığıyla ayarlanabilen genel seçeneklere sahip olabilir, belirli bir _Subtask_ için değiştirilebilir ve _Task_ içindeki `options` olarak enjekte edilen _Task_ seçenekleri olabilir.

Seçilen `renderer`, `rendererOptions` ile `Task` içindeki `options` buna göre değişecektir. 

:::warning
Yedek renderleyiciyi de yapılandırmak için, _Listr_'ya `fallbackRendererOptions` geçebilirsiniz.
:::