# TON Sitelerini Nasıl Çalıştırırsınız

## 👋 Giriş

[TON Siteleri](https://blog.ton.org/ton-sites), kurulumları dışında neredeyse normal siteler gibi çalışır. Onları başlatmak için birkaç ek işlem gereklidir. Bu eğiticide, bunu nasıl yapacağınızı göstereceğim.

---

## 🖥 TON Sitesini Çalıştırma

Web siteniz için TON Proxy kullanmak üzere [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy) yükleyin.

### Herhangi bir Linux'ta Kurulum

##### İndir

```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Çalıştır

Alan adı yapılandırmasıyla çalıştırın ve adımları takip edin:

```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```

Terminalinizden Tonkeeper, Tonhub veya herhangi bir cüzdan kullanarak QR kodunu tarayın, işlemi gerçekleştirin. Alan adınız sitenizle bağlantılı olacaktır.

###### Alan adı olmadan çalıştır

Alternatif olarak, eğer bir .ton veya .t.me alan adınız yoksa, basit modda .adnl alan adıyla çalıştırabilirsiniz:

```
./tonutils-reverse-proxy-linux-amd64
```

:::info
Şu an çalışıyor olsanız bile, örneğin, birden fazla cüzdanı kullanarak tarama yapabilirsiniz.

:::

##### Kullanım

Artık herkes TON Sitelerinize ADNL adresi veya alan adı kullanarak erişebilir.

Bazı ayarları değiştirmek isterseniz, örneğin proxy geçiş URL'sini, `config.json` dosyasını açın, düzenleyin ve proxy'yi yeniden başlatın. Varsayılan proxy geçiş URL'si `http://127.0.0.1:80/`'dir.

Proxy ek başlıklar ekler:
- `X-Adnl-Ip` - istemcinin ip'si
- `X-Adnl-Id` - istemcinin adnl id'si

### Diğer İşletim Sistemlerinde Kurulum

Kaynaklardan inşa edin ve adım 2'deki gibi çalıştırın. İnşa etmek için Go ortamına ihtiyaç vardır.

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

Diğer işletim sistemlerine inşa etmek için `make all` komutunu çalıştırın.

---

## 👀 Sonraki adımlar

### 🔍 Site erişilebilirliğini kontrol etme

Seçtiğiniz yöntemin tüm adımlarını tamamladıktan sonra, TON Proxy başlamış olmalıdır. **Her şey başarılıysa**, siteniz ilgili adımda alınan ADNL adresinde erişilebilir olacaktır.

Sitenin erişilebilirliğini, `.adnl` alan adı ile bu adresi açarak kontrol edebilirsiniz. Ayrıca, sitenin açılması için tarayıcınızda bir TON Proxy'nin çalıştığından emin olun, örneğin [MyTonWallet](https://mytonwallet.io/) uzantısı aracılığıyla.

:::tip
Site erişilebilirliği kontrolü yaparken, tüm adım ve gereksinimlerin eksiksiz yerine getirildiğinden emin olun.

:::

---

## 📌 Referanslar

 * [TON Siteleri, TON WWW ve TON Proxy](https://blog.ton.org/ton-sites)
 * [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy)
 * Yazarlar: [Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Daniil Sedov](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [George Imedashvili](https://github.com/drforse)

---

## Ayrıca Bakınız
* `C++ Uygulamasını Çalıştır`