---
title: Özel Sunucu Yapılandırması
seoTitle: Özel Sunucu Yapılandırması - Ripple
sidebar_position: 4
description: Belirli, güvenilir eşlerle bağlantı kurmak için bir özel sunucu yapılandırması. Bu rehber, tanınan eşlerle iletişim kurarak daha güvenli bağlantılar sağlamak için adım adım bilgi sunar.
tags: 
  - özel sunucu
  - güvenlik
  - eş protokolü
  - yapılandırma
  - ripple
  - proxy
  - doğrulayıcılar
keywords: 
  - özel sunucu
  - güvenlik
  - eş protokolü
  - yapılandırma
  - ripple
  - proxy
  - doğrulayıcılar
---

# Özel Sunucu Yapılandırması

Bir `özel sunucu`, ağ ile yalnızca belirli, güvenilir eşler üzerinden bağlantı kuran bir `rippled` sunucusudur; bunun yerine açık eşler-arası ağda keşfedilen eşlerle doğrudan bağlantı kurmaz. Bu tür bir yapılandırma, genellikle `doğrulayıcılar` için önerilen isteğe bağlı bir önlemdir, ancak diğer belirli amaçlar için de yararlı olabilir.

## Ön Gereksinimler

Özel bir sunucu kullanmak için aşağıdaki gereksinimleri karşılamanız gerekir:

- En son sürüme güncellenmiş `rippled` kurulu olmalı, ancak henüz çalıştırılmamış olmalıdır.
- Özellikle **proxy** sunucuları üzerinden mi, yoksa **kamusal merkezler** üzerinden mi bağlanacağınızı karar vermelisiniz. Bu seçeneklerin karşılaştırılması için `Peering Yapılandırmalarının Artıları ve Eksileri` bölümüne bakın.

    - Eğer proxy kullanıyorsanız, proxy olarak kullanmak için `rippled` kurulu ve çalışan ek makinelere sahip olmalısınız. Bu sunucuların dış ağa ve özel sunucunuza bağlanabilmesi gerekir.
    - Her iki yapılandırma için bağlanmayı düşündüğünüz eşlerin IP adreslerini ve portlarını bilmelisiniz.

## Adımlar

Belirli bir sunucuyu özel bir eş olarak yapılandırmak için aşağıdaki adımları tamamlayın:

1. `rippled` yapılandırma dosyanızı düzenleyin.

    ```bash
    vim /etc/opt/ripple/rippled.cfg
    ```

    partial file="/docs/_snippets/conf-file-location.md" /%}

2. Özel eşleşmeyi etkinleştirin.

    Yapılandırma dosyanızda aşağıdaki dizeyi ekleyin veya yorumdan çıkarın:

    ```plaintext
    [peer_private]
    1
    ```

3. Sabit eşleri ekleyin.

    Yapılandırma dosyanızda bir `[ips_fixed]` dizesini ekleyin veya yorumdan çıkarın. Bu dizideki her satır, bağlanmak istediğiniz bir eşin ana bilgisayar adı veya IP adresini, ardından bir boşluk ve bu eşin eş protokol bağlantılarını kabul ettiği portu içermelidir.

    Örneğin, **kamusal merkezler** üzerinden bağlanmak için aşağıdaki dizeyi kullanabilirsiniz:

    ```plaintext
    [ips_fixed]
    r.ripple.com 51235
    ```

    Sunucunuz **proxyler** üzerinden bağlanıyorsa, IP adresleri ve portlar kullandığınız `rippled` sunucularının yapılandırmalarıyla eşleşmelidir. Bu sunucular için port numarası, o sunucunun yapılandırma dosyasında `protocol = peer` olan portla (genellikle 51235) eşleşmelidir. Örneğin, yapılandırmanız şöyle görünebilir:

    ```plaintext
    [ips_fixed]
    192.168.0.1 51235
    192.168.0.2 51235
    ```

    :::info Port numarasını atlarsanız, sunucu port 2459'u kullanır; bu, XRP Ledger protokolü için IANA tarafından atanmış porttur.:::

4. Eğer proxy kullanıyorsanız, onları özel eşinizle ve birbirleriyle gruplandırın.

    Kamusal merkezler kullanıyorsanız, bu adımı atlayın.

    Eğer proxyler kullanıyorsanız, `proxyleri bir küme olarak yapılandırın` ve özel eşinizi de dahil edin. Kümenin her üyesinin, diğer küme üyelerini listeleyen bir `[ips_fixed]` dizesi olmalıdır. Ancak, **sadece özel sunucu** bir `[peer_private]` dizesine sahip olmalıdır.

    Proxylerinizi tek tek yeniden başlatın. Her bir proxy sunucusunda:

    ```bash
    sudo service systemctl restart rippled
    ```

5. Özel sunucuda `rippled`'yi başlatın.

    ```bash
    sudo service systemctl start rippled
    ```

6. Özel sunucunuzun _yalnızca_ eşleriyle bağlı olduğunu doğrulamak için [eşler metodunu][] kullanın.

    Yanıttaki `peers` dizisi, `address` alanı sizin yapılandırdığınız eşlerden biri olmayan hiçbir nesne içermemelidir. Eğer durum böyle değilse, yapılandırma dosyanızı iki kez kontrol edin ve özel sunucuyu yeniden başlatın.

---

## Sonraki Adımlar

Ek bir önlem olarak, güvenlik duvarınızı, özel sunucunuza yalnızca belirli eşlerden gelen bağlantıları engelleyecek şekilde yapılandırmalısınız. Eğer proxy sunucuları çalıştırıyorsanız, güvenlik duvarınız üzerinden **nitelikli eş portlarını** `proxyler için yönlendirin`, ancak **özel eşe değil**. Bu yapılandırmanın nasıl yapılacağı, kullandığınız güvenlik duvarına bağlıdır.

Güvenlik duvarının, port 80 üzerindeki HTTP dış bağlantılarını **engellemediğinden** emin olun. Varsayılan yapılandırma, bu portu en son önerilen doğrulayıcı listesini **vl.ripple.com** adresinden indirmek için kullanır. Doğrulayıcı listesi olmadan, sunucu hangi doğrulayıcıları güvenilir bulacağını bilemez ve ağın mutabakata varıp varmadığını tanıyamaz.

---

## Ayrıca Bakınız

- **Kavramlar:**
    - `Eş Protokolü`
    - `Mutabakat`
    - `Paralel Ağlar`
- **Eğitimler:**
    - `Eş Tarayıcıyı Yapılandırın`
- **Referanslar:**
    - [eşler metodu][]
    - [bağlantı metodu][]
    - [fetch_info metodu][]
    - `Eş Tarayıcı`

