---
title: "Deno Davranışının Yapılandırılması"
description: "Deno ortam değişkenleri ile davranış ayarlarını özelleştirin. Bu değişkenler, erişim, güvenlik ve önbelleğe alma gibi önemli işlevler için kritik rol oynar."
keywords: [Deno, ortam değişkenleri, yapılandırma, proxy, güvenlik]
---

Deno'nun davranışını etkileyebilecek birkaç ortam değişkeni bulunmaktadır:

### DENO_AUTH_TOKENS

Deno'nun uzak özel kodlara erişimini sağlamak için kullanılabilecek yetkilendirme belirteçleri listesi. Daha fazla ayrıntı için
`Özel modüller ve havuzlar` bölümüne bakın.

### DENO_TLS_CA_STORE

TLS bağlantıları kurulduğunda kullanılacak sertifika depolarının bir listesi. Mevcut depolar `mozilla` ve `system`'dir. Birini, her ikisini veya hiçbirini belirtebilirsiniz. Sertifika zincirleri, belirtildiği sıraya göre çözülmeye çalışır. Varsayılan değer `mozilla`'dır. `mozilla` deposu, [`webpki-roots`](https://crates.io/crates/webpki-roots) tarafından sağlanan paketlenmiş Mozilla sertifikalarını kullanır. `system` deposu, platformunuzun
[yerel sertifika deposunu](https://crates.io/crates/rustls-native-certs) kullanır. Kullanmakta olduğunuz Deno sürümüne bağlı olarak Mozilla sertifikalarının kesin kümesi değişebilir. Eğer hiç sertifika deposu belirtmezseniz:

:::warning
`DENO_CERT` veya `--cert` belirtmeden ya da her TLS bağlantısı için belirli bir sertifika belirtmeden hiçbir TLS bağlantısına güven verilmeyecektir.
:::

### DENO_CERT

PEM kodlamalı bir dosyadan bir sertifika yetkilisini yükleyin. Bu, `--cert` seçeneğini "geçersiz kılar". Daha fazla bilgi için `Proxyler` bölümüne bakın.

### DENO_DIR

CLI'den önbelleğe alınan bilgilerin saklanacağı dizini ayarlayacaktır. Bu, önbelleğe alınmış uzak modüller, önbelleğe alınmış dönüştürülmüş modüller, dil sunucusu önbellek bilgileri ve yerel depolamadan kalıcı veriler gibi öğeleri içerir. Bu, işletim sisteminin varsayılan önbellek konumunu ve ardından `deno` yolunu varsayılan olarak alır.

### DENO_INSTALL_ROOT

`deno install` kullanırken, yüklenen betiklerin saklanacağı konum. Bu varsayılan olarak `$HOME/.deno/bin`'dir.

### DENO_NO_PACKAGE_JSON

Package.json dosyalarının otomatik çözümlemesini devre dışı bırakacak şekilde ayarlandı.

### DENO_NO_PROMPT

Erişim üzerinde izin istemlerini devre dışı bırakacak şekilde ayarlandı (çağrımda `--no-prompt` geçmek için alternatif).

### DENO_NO_UPDATE_CHECK

Daha yeni bir Deno sürümünün mevcut olup olmadığını kontrol etmeyi devre dışı bırakacak şekilde ayarlandı.

### DENO_WEBGPU_TRACE

WebGPU izleri için kullanılacak dizin.

### HTTP_PROXY

HTTP istekleri için kullanılacak proxy adresi. Daha fazla bilgi için `Proxyler` bölümüne bakın.

### HTTPS_PROXY

HTTPS istekleri için kullanılacak proxy adresi. Daha fazla bilgi için `Proxyler` bölümüne bakın.

### NO_COLOR

Eğer ayarlıysa, bu Deno CLI'nin stdout ve stderr'ye yazarken ANSI renk kodları göndermesini engelleyecektir. Bu _de facto_ standart hakkında daha fazla bilgi için web sitesi
[https://no-color.org](https://no-color.org/) adresine bakın. Bu bayrağın değeri, ortam değişkenlerini okumak için izin olmadan çalışma zamanında erişilebilir, `Deno.noColor` değerine bakarak kontrol edebilirsiniz.

### NO_PROXY

Diğer ortam değişkenlerinde belirlenen proxy'yi geçmesi gereken ana bilgisayarları belirtir. Daha fazla bilgi için `Proxyler` bölümüne bakın.

### NPM_CONFIG_REGISTRY

Modülleri yüklerken kullanılacak npm havuzunu
`npm belirteçleri` üzerinden belirtin.

## Proxyler

Deno, ağ isteklerini bir proxy sunucusu aracılığıyla işleyebilme yeteneğine sahiptir; bu, güvenlik, önbellekleme veya bir güvenlik duvarının arkasındaki kaynaklara erişim gibi çeşitli nedenler için faydalıdır. Çalışma zamanı, modül indirmeleri ve Web standardı `fetch` API'si için proxy'leri desteklemektedir.

Deno, proxy yapılandırmasını ortam değişkenlerinden okur: `HTTP_PROXY`,
`HTTPS_PROXY` ve `NO_PROXY`.

:::tip
Proxy kullanımı, güvenlik duvarları ve ağ konfigürasyonları arasında veri alışverişi yaparken önemli bir rol oynar.
:::

Windows'ta, ortam değişkenleri bulunamazsa, Deno proxy'leri kayıttan okumaya geri döner.