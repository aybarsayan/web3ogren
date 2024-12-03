---
title: StatsDyi Yapılandırma
seoTitle: StatsD Configuration for rippled Server
sidebar_position: 4
description: StatsD metrikleri ile rippled sunucunuzu izleyin. Bu kılavuz, StatsDyi yapılandırmak için gerekli adımları içermektedir.
tags: 
  - StatsD
  - rippled
  - metrik
  - izleme
  - yapılandırma
  - rippledmon
  - Docker
keywords: 
  - StatsD
  - rippled
  - metrik
  - izleme
  - yapılandırma
  - rippledmon
  - Docker
---

# StatsD'yi Yapılandırma

`rippled`, kendisi hakkında sağlık ve davranışsal bilgileri [StatsD](https://github.com/statsd/statsd) formatında dışa aktarabilir. Bu metrikler, [`rippledmon`](https://github.com/ripple/rippledmon) veya StatsD formatında metrikleri kabul eden diğer herhangi bir toplama aracı tarafından tüketilebilir ve görselleştirilebilir.

## Yapılandırma Adımları

:::info
Aşağıdaki adımlar, `rippled` sunucunuzda StatsD'yi yapılandırmak için gereklidir.
:::

`rippled` sunucunuzda StatsD'yi etkinleştirmek için aşağıdaki adımları izleyin:

1. İstatistikleri almak ve toplamak için başka bir makinede bir `rippledmon` örneği ayarlayın.

    ```bash
    $ git clone https://github.com/ripple/rippledmon.git
    $ cd rippledmon
    $ docker-compose up
    ```

    Yukarıdaki adımları gerçekleştirirken [Docker](https://docs.docker.com/) ve [Docker Compose](https://docs.docker.com/compose/install/)’ın makinenizde kurulu olduğundan emin olun. `rippledmon` yapılandırması hakkında daha fazla bilgi için [`rippledmon` deposunu](https://github.com/ripple/rippledmon) gözden geçirin.

2. `[insight]` bölümünü `rippled` yapılandırma dosyanıza ekleyin.

    ```ini
    [insight]
    server=statsd
    address=192.0.2.0:8125
    prefix=my_rippled
    ```

    - `address` için, `rippledmon`'un dinlediği IP adresini ve portu kullanın. Bu port varsayılan olarak 8125'tir.
    - `prefix` için, yapılandırdığınız `rippled` sunucusunu tanımlayan bir isim seçin. Prefix, boşluk, iki nokta ":", veya dikey çubuk "|" içermemelidir. Prefix, bu sunucudan dışa aktarılan tüm StatsD metriklerinde görünür.

    partial file="/docs/_snippets/conf-file-location.md" /%}

3. `rippled` hizmetini yeniden başlatın.

    ```bash
    $ sudo systemctl restart rippled
    ```

4. Metriklerin dışa aktarılmakta olduğunu kontrol edin:

    ```bash
    $ tcpdump -i en0 | grep UDP
    ```

    `en0`'yı, makineniz için uygun ağ arayüzü ile değiştirin. Makinenizdeki arayüzlerin tam listesi için `$ tcpdump -D` komutunu kullanın.

    > Örnek Çıktı:
    > 
    > ```plaintext
    > 00:41:53.066333 IP 192.0.2.2.63409 > 192.0.2.0.8125: UDP, length 196
    > ```

    Belirli aralıklarla, `rippledmon` örneğiniz için yapılandırılan adres ve port'a dışa trafik gönderildiğini belirten mesajlar görmelisiniz.

Her StatsD metriği için açıklamalar için [`rippledmon` deposunu](https://github.com/ripple/rippledmon) kontrol edin.

## Ayrıca Bakınız

- **Kavramlar:**
    - `XRP Ledger Genel Bakış`
    - `rippled` Sunucu`
- **Eğitimler:**
    - `rippled`'yi Kurun`
    - `Kapasite Planlaması`
- **Referanslar:**
    - `server_info metodu`
    - `print metodu`