# TON Connect için Güvenlik

TON Connect, kullanıcıların paylaştıkları veriler üzerinde açık bir kontrol sağlamasını garanti eder; bu, verilerin uygulama ve cüzdan transferi sırasında sızdırılma olasılığının olmadığı anlamına gelir. Bu tasarımı güçlendirmek için cüzdanlar ve uygulamalar, birlikte çalışan güçlü kriptografik kimlik doğrulama sistemleri kullanır.

## Kullanıcı verileri ve fon güvenliği

- :::tip
  Kullanıcı verilerini güvenli bir şekilde yönetmek için kullanıcılara en iyi uygulamalar hakkında bilgi vermek önemlidir.
  :::
  
- TON Connect'te, kullanıcı verileri köprüler aracılığıyla cüzdanlara iletildiğinde uçtan uca şifrelenir. Bu, uygulamaların ve cüzdanların veri hırsızlığı ve manipülasyonu olasılığını azaltan üçüncü taraf köprü sunucularını kullanmasına olanak tanır ve bu süreçte veri bütünlüğü ve güvenliğini önemli ölçüde artırır.

- :::info
  NOT: Uçtan uca şifreleme, yalnızca gönderici ve alıcı arasında veri güvenliğini artırmakla kalmaz, aynı zamanda veri koruma yasalarına uyum sağlamada da kritik bir rol oynar.
  :::

- TON Connect aracılığıyla, kullanıcıların verilerinin cüzdan adresleri ile doğrudan kimlik doğrulama yapılabilmesi için güvenlik parametreleri belirlenmiştir. Bu, kullanıcıların birden fazla cüzdan kullanmasını ve belirli bir uygulama içinde hangisinin kullanılacağını seçmesini sağlar.

> "TON Connect protokolü, kullanıcıların böyle verilerin paylaşımını açıkça onayladığı kişisel veri öğesi paylaşımına izin verir."  
> — Protokol Detayları

- :::warning
  Unutmayın ki, kullanıcıların gizliliklerini korumak ve izinsiz veri paylaşımını önlemek için açık onay sürecinin önemi büyüktür.
  :::

### Detaylar


Önemli Bilgiler

TON Connect ve onun güvenlik odaklı tasarımına dair özel detaylar ve ilgili kod örnekleri [TON Connect GitHub](https://github.com/ton-connect/) üzerinden bulunabilir.

