# Rastgele sayı üretimi

Rastgele sayı üretimi, birçok farklı projede ihtiyaç duyabileceğiniz yaygın bir görevdir. FunC belgelerinde `random()` fonksiyonunu zaten görmüş olabilirsiniz, ancak sonuçlarının bazı ek hileler kullanılmadığı takdirde kolayca tahmin edilebileceğini unutmayın.

## Birisi rastgele bir sayıyı nasıl tahmin edebilir?

Bilgisayarlar, rastgele bilgi oluşturma konusunda pek başarılı değildir çünkü sadece kullanıcıların talimatlarını takip ederler. Ancak, insanlar sıklıkla rastgele sayılara ihtiyaç duyduğundan, _pseudo-rastgele_ sayılar oluşturmak için çeşitli yöntemler geliştirmişlerdir.

Bu algoritmalar genellikle, bir dizi _pseudo-rastgele_ sayı üretmek için kullanılacak bir _tohum_ değeri sağlamanızı gerektirir. Böylece, aynı programı aynı _tohum_ ile birden fazla kez çalıştırırsanız, sürekli olarak aynı sonucu elde edersiniz. TON'da, her blok için _tohum_ farklıdır.

-   `Blok rastgele tohumunun üretilmesi`

> **Anahtar Nokta:** Bir akıllı sözleşmede `random()` fonksiyonunun sonucunu tahmin etmek için, blokun mevcut `tohumunu` bilmeniz yeterlidir; bu da bir doğrulayıcı olmadığınız sürece mümkün değildir.  
> — Rastgelelik Tahmin Yöntemi

## Basitçe `randomize_lt()` kullanın

Rastgele sayı üretimini tahmin edilemez hale getirmek için mevcut `Mantıksal Zaman` değerini tohuma ekleyebilirsiniz, böylece farklı işlemler farklı tohumlara ve sonuçlara sahip olacaktır.

Rastgele sayıları üretmeden önce `randomize_lt()` çağrısını ekleyin, bu sayede rastgele sayılarınız tahmin edilemez hale gelecektir:

```func
randomize_lt();
int x = random(); ;; kullanıcılar bu sayıyı tahmin edemez
```

:::tip
Doğrulayıcıların veya grupların rastgele sayı sonucunu etkileyebileceğini unutmayın; çünkü mevcut blokun tohumunu belirlerler.
:::

## Doğrulayıcıların manipülasyonuna karşı koruma var mı?

Doğrulayıcıların tohumu değiştirmesini önlemek (veya en azından karmaşıklaştırmak) için daha karmaşık şemalar kullanabilirsiniz. Örneğin, rastgele bir sayı üretmeden önce bir bloğu atlayabilirsiniz. Bir bloğu atlarsak, tohum daha az tahmin edilebilir bir şekilde değişecektir.

Blok atlamak karmaşık bir görev değildir. Bunu, ana zincire bir mesaj göndererek ve sözleşmenizin çalışma zincirine geri dönerek basitçe yapabilirsiniz. Hadi basit bir örneği inceleyelim!

:::caution
Bu örnek sözleşmeyi gerçek projelerde kullanmayın, bunun yerine kendi sözleşmenizi yazın.
:::

### Herhangi bir çalışma zincirindeki ana sözleşme

Bir örnek olarak basit bir piyango sözleşmesi yazalım. Bir kullanıcı buna 1 TON gönderecek ve %50 şansla 2 TON geri alacak.

```func
;; yankı sözleşmesi adresini ayarla
const echo_address = "Ef8Nb7157K5bVxNKAvIWreRcF0RcUlzcCA7lwmewWVNtqM3s";

() recv_internal (int msg_value, cell in_msg_full, slice in_msg_body) impure {
    var cs = in_msg_full.begin_parse();
    var flags = cs~load_uint(4);
    if (flags & 1) { ;; reddedilen mesajları göz ardı et
        return ();
    }
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    if ((op == 0) & equal_slice_bits(in_msg_body, "bahis")) { ;; kullanıcıdan bahis
        throw_unless(501, msg_value == 1000000000); ;; 1 TON

        send_raw_message(
            begin_cell()
                .store_uint(0x18, 6)
                .store_slice(echo_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakınız)
                .store_uint(1, 32) ;; sözleşmemizde 1'in yankı opcode'u olduğunu varsayalım
                .store_slice(sender) ;; kullanıcı adresini ilet
            .end_cell(),
            64 ;; gelen mesajın kalan değerini gönder
        );
    }
    elseif (op == 1) { ;; yankı
        throw_unless(502, equal_slice_bits(sender, echo_address)); ;; yalnızca yankı sözleşmesinden yankı kabul et

        slice user = in_msg_body~load_msg_addr();

        {-
            bu noktada 1+ blok atladık
            bu yüzden rastgele sayıyı oluşturalım
        -}
        randomize_lt();
        int x = rand(2); ;; rastgele bir sayı üret (ya 0 ya da 1)
        if (x == 1) { ;; kullanıcı kazandı
            send_raw_message(
                begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(user)
                    .store_coins(2000000000) ;; 2 TON
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; varsayılan mesaj başlıkları (mesaj gönderme sayfasına bakınız)
                .end_cell(),
                3 ;; hataları göz ardı et & ücretleri ayrı öde
            );
        }
    }
}
```

Bu sözleşmeyi ihtiyaç duyduğunuz herhangi bir çalışma zincirinde (muhtemelen Temel Zincir) dağıtın ve işiniz bitti!

## Bu yöntem %100 güvenli mi?

Kesinlikle yardımcı olurken, bir intruder birden fazla doğrulayıcı üzerinde kontrol sahibi olduğunda manipülasyon olasılığı hala vardır. Bu durumda, `etkileyebilirler` _tohumun_, rastgele sayının bağımlı olduğu. Bu olasılık son derece küçük olsa bile, dikkate alınması gereken bir durumdur.

:::info
Son TVM güncellemesi ile `c7` kaydına yeni değerlerin eklenmesi, rastgele sayı üretiminin güvenliğini daha da artırabilir. Özellikle, bu güncelleme son 16 masterchain bloğu hakkında bilgiler ekler.
:::

Masterchain blok bilgisi sürekli değişen doğası gereği, rastgele sayı üretimi için ek bir entropi kaynağı olarak kullanılabilir. Bu verileri rastgelelik algoritmanıza dahil ederek, potansiyel rakiplerin tahmin etmesi daha zor olan sayılar oluşturabilirsiniz.

Bu TVM güncellemesi hakkında daha fazla ayrıntılı bilgi için lütfen `TVM Güncellemesi` sayfasına başvurun.