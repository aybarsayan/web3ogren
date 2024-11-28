# TON Hack Challenge'tan Sonuçlar Çıkarmak

TON Hack Challenge 23 Ekim'de gerçekleştirildi. TON ana ağına, sentetik güvenlik ihlalleri ile birden fazla akıllı sözleşme dağıtıldı. Her sözleşmenin 3000 veya 5000 TON'luk bir bakiyesi vardı, bu da katılımcının bunları hackleyip hemen ödüller almasına olanak tanıyordu.

Kaynak kodu ve yarışma kuralları GitHub'da [burada](https://github.com/ton-blockchain/hack-challenge-1) barındırılmaktaydı.

## Sözleşmeler

### 1. Yatırım Fonu

:::note GÜVENLİK KURALI
Her zaman `impure` değiştiricisini kontrol edin.
:::

İlk görev çok basitti. Saldırgan, `authorize` fonksiyonunun `impure` olmadığını bulabilirdi. Bu değiştiricinin eksikliği, derleyicinin bu fonksiyona yapılan çağrıları, eğer hiçbir şey döndürmüyorsa veya dönen değer kullanılmıyorsa atlamasına izin verir.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Banka

:::note GÜVENLİK KURALI
Her zaman `değiştiren/değiştirmeyen` yöntemleri kontrol edin.
:::

> `udict_delete_get?` çağrısı `~` yerine `.` ile yapıldı, böylece gerçek sözlük etkilenmedi.  
> — Dan Volkov

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note GÜVENLİK KURALI
Gerçekten ihtiyacınız varsa, imzalı tamsayılar kullanın.
:::

Oy kullanma gücü mesajda bir tamsayı olarak saklandı. Bu nedenle saldırgan, güç aktarımı sırasında negatif bir değer gönderebilir ve sonsuz oy kullanma gücüne sahip olabilirdi.

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; from_votes'un pozitif olduğunu kontrol etmeye gerek yok: set_voting_power negatif oylarda hata fırlatacak
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. Şans Oyunu

:::note GÜVENLİK KURALI
`rand()` yapmadan önce her zaman tohumları rastgele hale getirin.
:::

Tohum, işlemin mantıksal zamanından alındı ve bir hacker, mevcut bloktaki mantıksal zamanı zorlayarak kazanabilir (çünkü lt bir blok içinde ardışık).

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; çok büyük jackpot'u yasakla
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...ödül gönder... }
```

### 5. Cüzdan

:::note GÜVENLİK KURALI
Her şeyin blok zincirinde saklandığını unutmayın.
:::

Cüzdan, bir şifre ile korundu, şifrenin hash'i sözleşme verilerinde saklandı. Ancak blok zinciri her şeyi hatırlar—şifre işlem tarihçesinde vardı.

### 6. Kasası

:::note GÜVENLİK KURALI
Her zaman `geri dönen` mesajları kontrol edin.  
`Standart` fonksiyonlardan kaynaklanan hataları unutmayın.  
Koşullarınızı mümkün olduğunca katılaştırın.
:::

Kasada, veritabanı mesaj işleyicisinde şu kod bulunur:

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Kalan kontrol-TON'ları iade et
               ;; addr_hash, kontrol talep edenine karşılık gelir
} else {
     mode = 128; ;; Ödülü ver
                 ;; addr_hash, kazanan kaydından çekim adresine karşılık gelir
}
```

Kasa, kullanıcı "kontrol" gönderirse geri dönen bir işleyici veya veritabanına bir proxy mesajına sahip değildir. Veritabanında `msg_addr_none` ödül adresi olarak ayarlanabilir çünkü `load_msg_address` buna izin verir. Kasadan bir kontrol talep ediliyor, veritabanı `msg_addr_none`'ı `parse_std_addr` ile ayrıştırmaya çalışıyor ve başarısız oluyor. Mesaj veritabanından kasaya geri dönüyor ve op `op_not_winner` değil.

### 7. İyi Banka

:::note GÜVENLİK KURALI
Eğlence amaçlı hesabı asla yok etmeyin.  
Kendinize para göndermek yerine `raw_reserve` yapın.  
Olası yarış koşullarını düşünün.  
Hashmap gaz tüketimine dikkat edin.
:::

Sözleşmede yarış koşulları vardı: para yatırabilir, ardından aynı anda iki mesajda geri çekme işlemi yapmaya çalışabilirsiniz. Mesajın ayrılmış paranın işleneceği garantisi yoktur, bu nedenle banka ikinci çekimden sonra kapanabilir. Bunun ardından sözleşme yeniden dağıtılabilir ve kimse talep edilmemiş parayı çekebilir.

### 8. Dehasher

:::note GÜVENLİK KURALI
Sözleşmenizde üçüncü taraf kodu çalıştırmaktan kaçının.
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; dehasher bozulursa c4'ü geri yükle
  set_data(c4);
  ;; dehasher bunları bozarsa temiz eylemleri yap
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

Sözleşmede üçüncü taraf kodunu güvenli bir şekilde çalıştırmanın bir yolu yoktur çünkü `gazdan çıkma` istisnası `CATCH` ile ele alınamaz. Saldırgan, sözleşmenin herhangi bir durumunu basitçe `COMMIT` edebilir ve "gazdan çıkma" hatası artırabilir.

## Sonuç

Umarım bu makale FunC geliştiricileri için sıradan olmayan kurallara ışık tutmuştur.

---

## Referanslar

Orijinal yazar Dan Volkov'dur.

- [dvlkv GitHub'da](https://github.com/dvlkv)
- [Orijinal makale](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)