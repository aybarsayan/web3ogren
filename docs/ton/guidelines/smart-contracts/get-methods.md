# Get Methods

:::note
Devam etmeden önce, okuyucuların `FunC programlama dili` hakkında temel bir anlayışa sahip olmaları önerilir. Bu, burada sağlanan bilgileri daha etkili bir şekilde kavramanıza yardımcı olacaktır.
:::

## Giriş

Get metodları, akıllı sözleşmelerde belirli verileri sorgulamak için özel işlevlerdir. Uygulanmaları herhangi bir ücrete tabi değildir ve blok zincirinin dışında gerçekleşir.

Bu işlevler, çoğu akıllı sözleşme için oldukça yaygındır. Örneğin, varsayılan `Cüzdan sözleşmesi`, `seqno()`, `get_subwallet_id()` ve `get_public_key()` gibi birkaç get metoduna sahiptir. Bu metodlar, cüzdanlar, SDK'lar ve API'ler tarafından cüzdanlar hakkında veri çekmek için kullanılır.

## Get Metodları için Tasarım Desenleri

### Temel Get Metodu Tasarım Desenleri

1. **Tek veri noktası edinimi**: Temel bir tasarım deseni, sözleşmenin durumundan bireysel veri noktalarını döndüren metodlar oluşturmaktır. Bu metodların parametreleri yoktur ve tek bir değer döndürür.

    Örnek:

    ```func
    int get_balance() method_id {
        return get_data().begin_parse().preload_uint(64);
    }
    ```

2. **Toplu veri edinimi**: Başka bir yaygın desen, sözleşmenin durumundan birden fazla veri noktasını tek bir çağrıda döndüren metodlar oluşturmaktır. Bu, belirli veri noktalarının sıklıkla birlikte kullanıldığı durumlarda sıklıkla kullanılır. Bunlar genellikle `Jetton` ve `NFT` sözleşmelerinde kullanılmaktadır.

    Örnek:

    ```func
    (int, slice, slice, cell) get_wallet_data() method_id {
        return load_data();
    }
    ```

### İleri Seviyede Get Metodu Tasarım Desenleri

1. **Hesaplanan veri edinimi**: Bazı durumlarda, alınması gereken veri doğrudan sözleşmenin durumunda saklanmaz, bunun yerine durum ve giriş argümanlarına dayalı olarak hesaplanır.

    Örnek:

    ```func
    slice get_wallet_address(slice owner_address) method_id {
        (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
        return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
    }
    ```

2. **Koşullu veri edinimi**: Bazen, alınması gereken veri, geçerli zaman gibi belirli koşullara bağlıdır.

    Örnek:

    ```func
    (int) get_ready_to_be_used() method_id {
        int ready? = now() >= 1686459600;
        return ready?;
    }
    ```

## En Yaygın Get Metodları

### Standart Cüzdanlar

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

Belirli bir cüzdan içindeki işlemin sıra numarasını döndürür. Bu metot esas olarak `tekrar oynatma koruması` için kullanılır.

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

-   `Alt Cüzdan ID'si nedir?`

:::info
Alt cüzdan ID'si, bir cüzdanın alt birimini tanımlamak için kullanılır ve kullanıcılar için önemlidir.
:::

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

Cüzdanla ilişkili olan genel anahtarı döndürür.

### Jettonlar

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

Bu metot, bir jetton cüzdanıyla ilişkili olan veri setinin tamamını döndürür:

-   (int) bakiye
-   (slice) sahip_adresi
-   (slice) jetton_master_adresi
-   (cell) jetton_cüzdan_kodu

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

Bir jetton ustasının verilerini döndürür; bunlar toplam arzını, yöneticinin adresini, jettonun içeriğini ve cüzdan kodunu içerir.

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

Sahibin adresini vererek, bu metot sahibin jetton cüzdan sözleşmesi adresini hesaplayıp döndürür.

### NFT'ler

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

Bir soyut token ile ilişkili verileri döndürür; bu, başlangıç durumunun olup olmadığını, koleksiyondaki dizini, koleksiyonun adresini, sahibin adresini ve bireysel içeriğini içerir.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

Bir NFT koleksiyonunun verilerini döndürür; bunlar mint edilmesi gereken bir sonraki öğenin dizinini, koleksiyonun içeriğini ve sahibin adresini içerir.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

Bir dizin verildiğinde, bu metot ilgili NFT öğe sözleşmesinin adresini hesaplayıp döndürür.

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

Bir NFT için telif hakkı parametrelerini alır. Bu parametreler, NFT satıldığında orijinal yaratıcıya ödenen telif hakkı yüzdesini içerir.

#### get_nft_content(int index, cell individual_nft_content)

```func
cell get_nft_content(int index, cell individual_nft_content) method_id {
    var (_, _, content, _, _) = load_data();
    slice cs = content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain etiketi
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}
```

Bir dizin ve `bireysel NFT içeriği` verildiğinde, bu metot NFT'nin ortak ve bireysel içeriğini alır ve döndürür.

## Get Metodları ile Çalışma

### Popüler Keşifcilerde Get Metodlarını Çağırma

#### Tonviewer

Sayfanın alt kısmında "Metodlar" sekmesinde get metodlarını çağırabilirsiniz.

-   [Tonviewer](https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method)

#### Ton.cx

"Get metodları" sekmesinde get metodlarını çağırabilirsiniz.

-   [Ton.cx](https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI)

### Koddan Get Metodlarını Çağırma

Aşağıdaki örnekler için Javascript kütüphaneleri ve araçlarını kullanacağız:

-   [ton](https://github.com/ton-org/ton) kütüphanesi
-   `Blueprint` SDK'sı

Bir sözleşmenin aşağıdaki get metoduna sahip olduğunu varsayalım:

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; verilerden 32-bit sayıyı yükleyip döndür
}
```

Bu metot, sözleşme verisinden yüklenen tek bir sayıyı döndürür.

Aşağıdaki kod parçacığı, bilinen bir adrese dağıtılmış bir sözleşmede bu get metodunu çağırmak için kullanılabilir:

```ts
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

async function main() {
    // İstemci oluştur
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    // Get metodunu çağır
    const result = await client.runMethod(
        Address.parse('EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k'),
        'get_total'
    );
    const total = result.stack.readNumber();
    console.log('Toplam:', total);
}

main();
```

Bu kod, `Toplam: 123` çıktısını verecektir. Sayı farklı olabilir, bu sadece bir örnektir.

### Get Metodlarını Test Etme

Oluşturulan akıllı sözleşmeleri test etmek için, yeni Blueprint projelerinde varsayılan olarak kurulu olan [Sandbox](https://github.com/ton-community/sandbox) kullanabiliriz.

Öncelikle, get metodunu çalıştıracak ve yazılı sonuç döndürecek özel bir metot eklemeniz gerekir. Sözleşmenizin adı _Counter_ olduğunu ve saklanan sayıyı güncelleyen bir metodu zaten uyguladığınızı varsayalım. `wrappers/Counter.ts` dosyasını açın ve aşağıdaki metodu ekleyin:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

Get metodunu çalıştırmış ve elde edilen yığın verilerini almıştır. Get metodları durumunda, yığın esasen döndüğü veridir. Bu kod parçasında, buradan tek bir sayı okuyoruz. Birden fazla değer döndüren daha karmaşık durumlarda, yığından tüm yürütme sonucunu ayrıştırmak için birkaç kez `readSomething` türü yöntemleri çağırabilirsiniz.

Son olarak, bu metodu testlerimizde kullanabiliriz. `tests/Counter.spec.ts` dosyasına gidin ve yeni bir test ekleyin:

```ts
it('get metodundan doğru sayıyı döndürmelidir', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

Bunun doğru çalıştığını kontrol etmek için terminalinizde `npx blueprint test` komutunu çalıştırın; her şeyi doğru yaptıysanız, bu test başarılı olarak işaretlenmelidir!

## Diğer Sözleşmelerden Get Metodlarını Çağırma

Göründüğü kadar sezgisel olmasa da, diğer sözleşmelerden get metodlarını zincir üzerinde çağırmak mümkün değildir; bu, esas olarak blok zinciri teknolojisinin doğası ve uzlaşma ihtiyacı nedeniyle geçerlidir.

Öncelikle, başka bir shardchain'den veri almak zaman alabilir. Bu tür bir gecikme, sözleşme yürütme akışını kolayca bozabilir; çünkü blok zinciri işlemleri belirleyici ve zamanında bir şekilde yürütülmesi beklenmektedir.

İkincisi, doğrulayıcılar arasında uzlaşma sağlamak sorunlu olacaktır. Bir işlemin doğruluğunu doğrulamak için doğrulayıcılar aynı get metodunu da çağırmak zorundadır. Ancak, hedef sözleşmenin durumu bu çoklu çağrılar arasında değişirse, doğrulayıcılar işlem sonucunun farklı sürümleriyle karşılaşabilirler.

Son olarak, TON'daki akıllı sözleşmeler saf fonksiyonlar olarak tasarlanmıştır: aynı girdi için her zaman aynı çıktıyı üretirler. Bu ilke, mesaj işleme sırasında kolay uzlaşma sağlar. Rastgele, dinamik olarak değişen verilerin çalışma zamanında edinilmesi, bu belirleyici özelliği bozacaktır.

### Geliştiriciler İçin Sonuçlar

:::warning
Bu sınırlamalar, bir sözleşmenin diğer bir sözleşmenin get metodları aracılığıyla doğrudan durumuna erişemeyeceğini ifade eder.
:::

Belirleyici bir akışta gerçek zamanlı, dış verilerin dahil edilememesi kısıtlayıcı görünebilir. Ancak, bu kısıtlamalar, blok zinciri teknolojisinin bütünlüğünü ve güvenilirliğini sağlamak için gereklidir.

### Çözümler ve Alternatifler

TON Blok Zinciri'nde akıllı sözleşmeler, diğer bir sözleşmeden doğrudan metodları çağırmak yerine mesajlar aracılığıyla iletişim kurar. Belirli bir metodun yürütülmesi için bir mesaj, hedeflenen bir sözleşmeye gönderilebilir. Bu talepler genellikle özel `işlem kodları` ile başlar.

Bu talepleri kabul edecek şekilde tasarlanmış bir sözleşme, istenen metodu yürütür ve sonuçları ayrı bir mesajla geri gönderir. Bu karmaşık görünebilir, ancak aslında sözleşmeler arasındaki iletişimi akıc hale getirir ve blok zinciri ağının ölçeklenebilirliğini ve performansını artırır.

Bu mesajlaşma mekanizması, TON Blok Zinciri'nin işleyişine entegre olmuş ve shardlar arasında geniş bir senkronizasyon gerektirmeden ölçeklenebilir ağ büyümesine olanak tanımaktadır.

Etkili sözleşmeler arası iletişim sağlamak için, sözleşmelerinizin doğru bir şekilde talepleri kabul edip yanıt verecek şekilde tasarlanmış olması önemlidir. Bu, zincir üzerinde yanıt döndürmek için çağrılabilecek metodların belirlenmesini içerir.

Basit bir örneği düşünelim:

```func
#include "imports/stdlib.fc";

int get_total() method_id {
    return get_data().begin_parse().preload_uint(32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_bits() < 32) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    cs~skip_bits(4);
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32); ;; işlem kodunu yükle

    if (op == 1) { ;; sayıyı artır ve güncelle
        int number = in_msg_body~load_uint(32);
        int total = get_total();
        total += number;
        set_data(begin_cell().store_uint(total, 32).end_cell());
    }
    elseif (op == 2) { ;; sayıyı sorgula
        int total = get_total();
        send_raw_message(begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender)
            .store_coins(0)
            .store_uint(0, 107) ;; varsayılan mesaj başlıkları (mesaj gönderim sayfasına bakınız)
            .store_uint(3, 32) ;; yanıt işlem kodu
            .store_uint(total, 32) ;; istenen sayı
        .end_cell(), 64);
    }
}
```

Bu örnekte, sözleşme iç mesajları alır ve işlem kodlarını yorumlayarak işler; belirli metodları yürütür ve yanıtları uygun şekilde döndürür:

-   Op-kodu `1`, sözleşmenin verisindeki sayıyı güncellemek için bir talebi belirtir.
-   Op-kodu `2`, sözleşmeden sayıyı sorgulamak için bir isteği belirtir.
-   Op-kodu `3`, istemci akıllı sözleşmesinin sonucu almak için kullanması gereken yanıt mesajında kullanılır.

Basitlik açısından, işlem kodları olarak sadece 1, 2 ve 3 kullandık. Ancak gerçek projelerde bunları standarda göre ayarlamayı düşünün:

-   `Op-kodlar için CRC32 Hash'leri`

## Yaygın Hatalar ve Bunlardan Kaçınma Yolları

1. **Get metodlarının yanlış kullanımı**: Daha önce bahsedildiği gibi, get metodları, sözleşmenin durumundan veri döndürmek için tasarlanmıştır ve sözleşmenin durumunu değiştirmek için kullanılmamalıdır. Bir get metodunda sözleşmenin durumunu değiştirmeye çalışmak, aslında bu durumu değiştirmeyecektir.

2. **Dönüş türlerini göz ardı etme**: Her get metodu, döndürülen verilerle uyumlu bir dönüş türüne sahip olmalıdır. Eğer bir metodun belirli bir türde veri döndürmesi bekleniyorsa, metod içerisindeki tüm yollarda bu türde dönüş sağlanmalıdır. Tutarsız dönüş türlerinden kaçının; bu, hatalara ve sözleşmeyle etkileşimde zorluklara yol açabilir.

3. **Sözleşten arası çağrıları varsaymak**: Get metodlarının başka sözleşmelerden zincir üzerinde çağrılabileceği sıklıkla yanlış anlaşılmaktadır. Ancak, daha önce tartıştığımız gibi, bu, blok zinciri teknolojisinin doğası ve uzlaşma ihtiyacı nedeniyle mümkün değildir. Her zaman get metodlarının zincir dışı kullanılmasını ve sözleşmeler arasındaki etkileşimlerin iç mesajlar aracılığıyla gerçekleştirildiğini hatırlayın.