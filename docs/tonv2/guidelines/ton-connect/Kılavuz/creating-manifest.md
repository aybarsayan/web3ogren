# manifest.json Oluşturma

Her uygulamanın cüzdana meta bilgileri iletmek için bir manifestoya ihtiyacı vardır. Manifesto, `tonconnect-manifest.json` adı verilen bir JSON dosyasıdır ve aşağıdaki formatı takip eder:

```json
{
    "url": "<app-url>",                        // zorunlu
    "name": "<app-name>",                      // zorunlu
    "iconUrl": "<app-icon-url>",               // zorunlu
    "termsOfUseUrl": "<terms-of-use-url>",     // isteğe bağlı
    "privacyPolicyUrl": "<privacy-policy-url>" // isteğe bağlı
}
```

## Örnek

Aşağıda manifestonun bir örneğini bulabilirsiniz:

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

---

## En iyi uygulamalar

:::tip
En iyi uygulama, manifestoyu uygulamanızın ve deposunun köküne yerleştirmektir. Örneğin: `https://myapp.com/tonconnect-manifest.json`. Bu, cüzdanın uygulamanızı daha iyi yönetmesine ve uygulamanıza bağlı kullanıcı deneyimini geliştirmesine olanak tanır.
:::

- `manifest.json` dosyasının URL'si üzerinden bir GET isteği ile erişilebilir olduğundan emin olun.

---

## Alanlar açıklaması

| Alan                  | Gereklilik | Açıklama |
|-----------------------|------------|----------|
| `url`                 | zorunlu    | Uygulama URL'si. DApp tanıtıcısı olarak kullanılacaktır. Cüzdanda simgesine tıklandığında DApp'i açmak için kullanılacaktır. Kapanış eğik çizgi olmadan URL'yi geçmek önerilir; örneğin 'https://mydapp.com' yerine 'https://mydapp.com/'. |
| `name`                | zorunlu    | Uygulama adı. Basit olabilir; tanıtıcı olarak kullanılmayacaktır. |
| `iconUrl`            | zorunlu    | Uygulama simgesinin URL'si. PNG, ICO, ... formatında olmalıdır. SVG simgeleri desteklenmemektedir. 180x180px PNG simgesi için URL geçin. |
| `termsOfUseUrl`      | isteğe bağlı | Kullanım Şartları belgesinin URL'si. Normal uygulamalar için isteğe bağlıdır, ancak Tonkeeper önerilen uygulamalar listesine yerleştirilen uygulamalar için gereklidir. |
| `privacyPolicyUrl`    | isteğe bağlı | Gizlilik Politikası belgesinin URL'si. Normal uygulamalar için isteğe bağlıdır, ancak Tonkeeper önerilen uygulamalar listesine yerleştirilen uygulamalar için gereklidir. |

:::warning
Unutmayın, tüm URL ve alanların doğruluğunu kontrol etmek çok önemlidir; aksi takdirde uygulamanızın düzgün çalışmayabilir.
:::