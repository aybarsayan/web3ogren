---
title: rippled ile Sorunları Teşhis Etme
seoTitle: rippled Sunucu Sorun Teşhisi
sidebar_position: 4
description: Sorunların nedenini belirlemek için bilgi toplayın. Bu doküman, rippled sunucusuyla ilgili yaygın sorunları ve teşhis etme adımlarını açıklamaktadır.
tags: 
  - rippled
  - sorun teşhisi
  - sunucu durumu
  - JSON-RPC
  - hata ayıklama
keywords: 
  - rippled
  - sorun teşhisi
  - sunucu durumu
  - JSON-RPC
  - hata ayıklama
---

# rippled ile Sorunları Teşhis Etme

Eğer `rippled` ile sorun yaşıyorsanız, ilk adım sorunu doğru bir şekilde tanımlamak için daha fazla bilgi toplamaktır. Bundan sonrasında, bu problemin kök nedenini ve bir çözümü bulmak daha kolay olabilir.

Aşağıdaki sayfalarda bazı yaygın sorun kategorileri, nedenleri ve çözümleri ile ilgili bilgiler bulabilirsiniz:

- Sunucunuz başlamıyorsa (örneğin çökme ya da otomatik olarak kapanma gibi), **`rippled Sunucusu Başlamıyor`** sayfasına bakın.
- Sunucunuz başlıyorsa, ancak XRP Ledger ağı ile güvenilir bir şekilde senkronize olmuyorsa ya da senkronize kalmıyorsa, **`rippled Sunucusu Senkronize Olmuyor`** sayfasına bakın.

Bu belgenin geri kalanı, sunucunuz çalışırken (ağ ile senkronize olamayan aktif süreç dahil) meydana gelen sorunları teşhis etme adımlarını önermektedir.

## server_info Bilgilerini Alın

:::tip
Sunucu durum bilgilerini almak için, komut satırını kullanabilirsiniz.
:::

Yerel `rippled` örneğinizden sunucu durum bilgilerini almak için komut satırını kullanabilirsiniz. Örneğin:

```
rippled server_info
```

Bu komuta verilen yanıt birçok bilgiyi içermektedir; bu bilgiler [server_info yöntemi][] ile belgelenmiştir. Sorun giderme amacıyla, en önemli alanlar (en yaygın kullanılanlardan en az kullanılanlara doğru):

- **`server_state`** - Çoğu zaman, bu alan `doğrulayıcı olarak yapılandırılmış` bir sunucu için `proposing`, ya da doğrulayıcı olmayan bir sunucu için `full` göstermelidir. `connected` değeri, sunucunun diğer eşler ile iletişim kurabileceği anlamına gelir, ancak hâlâ paylaşılan defter durumunun ilerleyişini takip edebilmek için yeterli verilere sahip değildir. Normalde, diğer defter durumlarının senkronizasyonu başlatıldıktan sonra yaklaşık 5-15 dakika sürer.

    - Eğer sunucunuz saatlerce `connected` durumunda kalıyorsa veya `full` veya `proposing` durumlarından sonra tekrar `connected` durumuna dönüyorsa, bu genellikle sunucunuzun ağın geri kalanıyla senkronize olamadığını gösterir. En yaygın darboğazlar disk G/Ç, ağ bant genişliği ve RAM'dir.

    - Örneğin, aşağıdaki sunucu durumu bilgileri, `disconnected`, `connected` ve `syncing` durumları arasında 3 dakikadan daha kısa sürede senkronize olan sağlıklı bir sunucuyu göstermektedir ve şu anda yaklaşık 90 dakikadır tamamen senkronize `proposing` durumundadır:

        ```
        $ ./rippled server_info
        Loading: "/etc/opt/ripple/rippled.cfg"
        2020-Jan-03 22:49:32.834134358 HTTPClient:NFO Connecting to 127.0.0.1:5005
        
        {
          "result" : {
            "info" : {
              ... (kısaltılmış) ...
              "server_state" : "proposing",
              "server_state_duration_us" : "5183282365",
              "state_accounting" : {
                "connected" : {
                  "duration_us" : "126164786",
                  "transitions" : 1
                },
                "disconnected" : {
                  "duration_us" : "2111321",
                  "transitions" : 1
                },
                "full" : {
                  "duration_us" : "5183282365",
                  "transitions" : 1
                },
                "syncing" : {
                  "duration_us" : "5545604",
                  "transitions" : 1
                },
                "tracking" : {
                  "duration_us" : "0",
                  "transitions" : 1
                }
              },
              ... (kısaltılmış) ...
            }
          }
        }
        ```

        > Eğer `full` veya `proposing` durumunuz yoksa, o zaman sunucunuz henüz ağa senkronize olmamıştır. Eğer sunucunuz aynı durumlar arasında birden fazla geçiş gösteriyorsa (`transitions` 2 veya daha fazla), bu, sunucunuzun ağ ile senkronizasyonunu kaybettiğini gösterir. Kısa bir zaman diliminde birçok geçişiniz varsa bu bir problemdir; uzun bir zaman diliminde birkaç geçişiniz varsa bu, internet bağlantınızdaki bazı dalgalanmaların kaçınılmaz olduğu anlamına gelir. Bireysel durumlarda geçirilen süre (`duration_us`), toplam çalışma süresiyle (`server_state_duration_us`) karşılaştırıldığında, sunucunuzun nasıl senkronize kaldığına dair bilgi verebilir. Yaklaşık 24 saatlik çalışma süresinin ardından, sunucunuzun toplam çalışma zamanının %99'unun `full` veya `proposing` durumunda geçmesini bekliyorsanız, olası istikrarsızlık kaynaklarını araştırmak isteyebilirsiniz.

    - Senkronizasyon sorunlarınızı düzeltmek için `Server Doesn't Sync` sayfasına bakın.

- **`complete_ledgers`** - Bu alan, sunucunuzun tamamına sahip olduğu `defter indekslerini` gösterir. Sağlıklı sunucular genellikle son defterlerin tek bir aralığını gösterir, örneğin: `"12133424-12133858"`.

    - Eğer `"11845721-12133420,12133424-12133858"` gibi ayrık bir tamamlanmış defter setiniz varsa, bu sunucunuzun aralıklı kesintilere uğradığını veya ağ ile senkronizasyonunu kaybettiğini gösterebilir. Bunun en yaygın nedenleri yetersiz disk G/Ç veya ağ bant genişliğidir.

    - Normalde, bir `rippled` sunucusu, eşlerinden son defter geçmişini indirir. Eğer defter geçmişinizdeki boşluklar birkaç saatten fazla sürüyorsa, eksik verileri olan eşlerden hiçbirine bağlı olmayabilirsiniz. Bu gerçekleşirse, sunucunuzun eksik veriler ile bir Ripple tam tarihli genel sunucusu ile eşleşmesini sağlamak için aşağıdaki bölümü yapılandırma dosyanıza ekleyebilir ve yeniden başlatabilirsiniz:

        ```
        [ips_fixed]
        s2.ripple.com 51235
        ```

- **`amendment_blocked`** - Bu alan genellikle `server_info` yanıtından atlanır. Eğer bu alan `true` değeri ile görünüyorsa, ağ onaylanmış bir `değişiklik` geçirmiştir; ancak sunucunuz bu değişikliğin bir uygulamasına sahip değildir. Büyük ihtimalle, bunu en son sürüme `rippled'yi güncelleyerek` çözebilirsiniz. Ayrıca, hangi değişiklik IDs'lerinin şu anda etkin olduğunu ve sunucunuzun hangi değişiklikleri destekleyip hangilerini desteklemediğini görmek için [feature yöntemi][] kullanılabilir.

- **`peers`** - Bu alan, XRP Ledger eşler arası ağında sunucunuzun bağlı olduğu diğer sunucu sayısını gösterir. Sağlıklı sunucular genellikle 5 ile 50 arasında eş gösterir, aksi takdirde yalnızca belirli eşlere bağlanacak şekilde yapılandırılmıştır.

    - Eğer 0 eşiniz varsa, sunucunuz ağ ile iletişim kuramıyor olabilir veya sistem saatiniz yanlış olabilir. (Ripple, saatlerinizi senkronize tutmak için tüm sunucularda [NTP](http://www.ntp.org/) daemon'u çalıştırmayı önermektedir.)

    - Eğer 10 eşiniz varsa, bu, `rippled`'nin bir yönlendirici aracılığıyla gelen bağlantıları almadığını gösterebilir [NAT](https://en.wikipedia.org/wiki/Network_address_translation) kullanıyor. Eşler arası bağlantıyı geliştirmek için yönlendiricinizin güvenlik duvarını eşler arası bağlantılar için kullanılan bağlantı noktasını (varsayılan olarak [port 51235](https://github.com/XRPLF/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1065)) iletmek üzere yapılandırabilirsiniz.

---

### Sunucudan Yanıt Yok

`rippled` yürütülebilir dosyası, `rippled` sunucusuna istemci olarak bağlanamadığında şu mesajı döner:

```json
{
   "error" : "internal",
   "error_code" : 71,
   "error_message" : "İç hata.",
   "error_what" : "sunucudan yanıt yok"
}
```

Bu genellikle birkaç sorundan birini gösterir:

- `rippled` sunucusu başlatılıyor, ya da hiç çalışmıyor. Servisin durumunu kontrol edin; eğer çalışıyorsa, birkaç saniye bekleyin ve tekrar deneyin.
- Sunucunuza bağlanmak için `rippled` komut satırı istemcisine farklı `parametreler geçirmeniz` gerekebilir.
- `rippled` sunucusu JSON-RPC bağlantılarını kabul etmeyecek şekilde yapılandırılmış olabilir.

## Sunucu Günlüğünü Kontrol Edin

[Varsayılan olarak,](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142) `rippled`, sunucunun hata ayıklama kaydını `/var/log/rippled/debug.log` dosyasına yazar. Hata ayıklama günlüğünün yeri, sunucunuzun yapılandırma dosyasına bağlı olarak farklılık gösterebilir. Eğer `rippled` hizmetini doğrudan başlatırsanız (bunu başlatmak için `systemctl` veya `service` kullanmak yerine), varsayılan olarak günlüğü konsola da yazdırır.

:::info
Varsayılan yapılandırma dosyası, sunucu başlatılırken dahili olarak [log_level yöntemi][] kullanılarak tüm günlük mesajı kategorileri için geçerlilik "warning" olarak ayarlanmıştır. Hata ayıklama günlüğünün ayrıntı seviyesini `başlatma sırasında `--silent` komut satırı seçeneğini kullanarak` ve sunucu çalışırken [log_level yöntemi][] ile kontrol edebilirsiniz. (Ayarlar için yapılandırma dosyasının `[rpc_startup]` kısmına bakın.)
:::

Bir `rippled` sunucusunun başlangıçta çok sayıda uyarı seviyesinde (`WRN`) mesaj yazdırması ve daha sonra ara sıra birkaç uyarı seviyesinde mesaj içermesi normaldir. Sunucunun başlatılmasının ilk 5 ila 15 dakikasındaki çoğu uyarıyı **güvenle yoksayabilirsiniz**.

Çeşitli günlük mesajı türleri hakkında daha ayrıntılı bir açıklama için `Günlük Mesajlarını Anlama` sayfasına bakın.

## Bilgi Toplama Betiği

Sorunu teşhis etmekte zorluk yaşıyorsanız veya yaygın çözümlerden herhangi biri ile sorunu çözemiyorsanız, bir destek forumunda veya [GitHub sorunlarında](https://github.com/XRPLF/rippled/issues) yardım isteyebilirsiniz. Yardım isterken, başkalarının sorunu teşhis etmesine yardımcı olmak için sisteminizle ilgili bilgi toplamak üzere bir bilgi toplama betiği kullanabilirsiniz.

Resmi paket kurulumu (`Ubuntu/Debian` veya `CentOS/RedHat`) varsayılan olarak böyle bir betiği `/opt/ripple/bin/getRippledInfo` yoluna yükler. Eğer `rippled`'yi kendiniz derlediyseniz, aynı betiği [rippled kaynak kodu deposunda](https://github.com/XRPLF/rippled/blob/develop/bin/getRippledInfo) bulabilirsiniz.

Betiği kullanmak için:

1. `rippled` çalışırken betiği çalıştırın.

    ```
    $ /opt/ripple/bin/getRippledInfo

    ####################################################
      rippled bilgileri toplandı. Lütfen /tmp/ripple_info.Xo8Xr/rippled_info.md
      içeriğini https://gist.github.com/ adresinde bir github gisti olarak kopyalayın.

      LÜTFEN GÖNDERİMDEN ÖNCE BU DOSYAYI HASSAS BİLGİLER AÇISINDAN GÖZDEN GEÇİRİN!
      Bu dosyadan hassas bilgileri çıkarmak için elimizden geleni yaptık,
      ancak göndermeden önce doğrulamanız gerektiğini unutmayın.
    ####################################################
    ```

    Betik, birçok komutun çıktısını toplar ve bunları geçici bir dosyaya yazar. Dosya adı, harfler ve rakamlardan oluşan (büyük/küçük harf duyarlı) bir dizi ile rastgele olarak belirlenir; örneğin: `/tmp/ripple_info.Xo8Xr/rippled_info.md`

2. Geçici dosyayı hassas bilgiler açısından gözden geçirin.

    Betik, çıktıda doğrulayıcı anahtarlar veya tokenlar gibi hassas bilgilerin çıkartılmasını sağlayacak şekilde tasarlanmıştır. Ancak, yine de gönderimden önce, güvenlik açısından çıkışı kontrol etmelisiniz. Örneğin, betik sunucu donanımınızla ilgili ayrıntılı bilgiler çıkartır ve gizlilik nedenleriyle bazı bölümleri kaldırmak isteyebilirsiniz. Çıktı dosyasını okumak ve istemediğiniz her şeyi kaldırmak için bir metin düzenleyici kullanın.

    ```
    nano /tmp/ripple_info.Xo8Xr/rippled_info.md
    ```

3. Çıktı dosyasını başkalarının görebileceği bir yere yükleyin.

    Dosyayı doğrudan [GitHub Gist](https://gist.github.com/), [Pastebin](https://pastebin.com/) veya benzeri bir hizmete yükleyebilirsiniz. Eğer `rippled`'yi uzaktan bir sunucuda çalıştırıyorsanız, dosyayı web tarayıcısına sahip bir makineye aktarmak, `scp` veya benzeri bir araç kullanarak daha kolay olabilir. 

---

## Ayrıca Bakın

- **Kavramlar:**
    - `rippled` Sunucusu`
    - `Değişiklikler`
- **Kılavuzlar:**
    - `Kapak Planlaması`
    - `rippled'yi Yapılandırma`
- **Referanslar:**
    - `rippled API Referansı`
        - `rippled` Komut Satırı Kullanımı`
        - [log_level yöntemi][]
        - [server_info yöntemi][]
        
