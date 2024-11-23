# TON DNS çözücüleri

## Giriş

TON DNS güçlü bir araçtır. Sadece TON Siteleri/Depolama çantalarını alanlara atamakla kalmaz, aynı zamanda alt alan adlarını çözme işlemini de ayarlamanıza olanak sağlar.

## İlgili bağlantılar

1. `TON akıllı sözleşme adres sistemi`
2. [TEP-0081 - TON DNS Standardı](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
3. [ton DNS koleksiyonunun kaynak kodu](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
4. [t.me DNS koleksiyonunun kaynak kodu](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
5. [Alan adları sözleşmeleri arayıcı](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
6. [Basit alt alan yöneticisi kodu](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## Alan adı sözleşmeleri arayıcı

Alt alan adlarının pratik bir kullanımı vardır. Örneğin, blok zinciri gözlemcileri, şu anda bir alan adını adını kullanarak bulma olanağı sunmamaktadır. Bu tür alanları bulma fırsatı veren bir sözleşme oluşturmayı keşfedeceğiz.

:::info
Bu sözleşme [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) adresinde dağıtılmıştır ve `resolve-contract.ton` ile bağlantılıdır. Bunun testini yapmak için, favori TON gözlemcinizin adres çubuğuna `.resolve-contract.ton` yazabilirsiniz ve TON DNS alan adı sözleşmesi sayfasına ulaşabilirsiniz. Alt alan adları ve .t.me alan adları da desteklenmektedir.
:::

:::note
Çözümleyici kodunu görmek için `resolve-contract.ton.resolve-contract.ton` adresine gidebilirsiniz. Ne yazık ki, bu alt çözümleyiciyi göstermez (bu farklı bir akıllı sözleşmedir), sadece alan adı sözleşmesinin sayfasını göreceksiniz.
:::

### dnsresolve() kodu

Bazı tekrar eden kısımlar atlanmıştır.

```func
(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; 'subdomain' boş olmadığını varsayıyoruz
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; mevcut sözleşmenin kendine ait DNS kayıtları yok
      return (8, null());
    }
  }
  
  ;; bazı alt alan adlarını yüklüyoruz
  ;; desteklenen alt alan adları "ton\\0", "me\\0t\\0" ve "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; çözümleme yapıyoruz
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; alan adı okunuyor
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; alan adı çözümlemesi örneği:
    ;; [ilk, bu sözleşmede erişilemez] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [bu sözleşmede erişilebilir] "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; çözüm sonucunun 'ratelance.ton' sözleşmesinin adresine işaret etmesini istemeliyiz, sahibine değil
    ;; bu nedenle, çözümlemenin tamamlandığı ve "wallet"H'ye 'ratelance.ton' sözleşmesinin adresinin olduğu cevabını vermeliyiz
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; \\0'ı daha ileriye geçmemiz gerekiyor, böylece sonraki çözümleyici yalnızca bir baytı işleyebilir
    
    ;; sonraki çözümleyici 'resolve-contract<.ton>' sözleşmesidir
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}
```

### dnsresolve() açıklaması

- Kullanıcı `"stabletimer.ton.resolve-contract.ton"` talep eder.
- Uygulama bunu `"\0ton\0resolve-contract\0ton\0stabletimer\0"`'a çevirir (ilk sıfır baytı isteğe bağlıdır).
- Root DNS çözücü isteği TON DNS koleksiyonuna yönlendirir, kalan kısım `"\0resolve-contract\0ton\0stabletimer\0"` olur.
- TON DNS koleksiyonu isteği belirli alana devreder, geriye `"\0ton\0stabletimer\0"` kalır.
- .TON DNS alan adı sözleşmesi çözümü, editör tarafından belirtilen alt çözücüye geçer, alt alan adı `"ton\0stabletimer\0"` olur.

**Burada dnsresolve() çağrılır.** İşleyişini adım adım inceleyelim:

1. Alt alan adı ve kategori girdi olarak alınır.
2. Başlangıçta sıfır baytı varsa, bu atlanır.
3. Alt alan adının `"ton\0"` ile başlayıp başlamadığını kontrol eder. Eğer öyleyse,
    1. ilk 32 biti atlar (subdomain = `"resolve-contract\0"`)
    2. `subdomain_sfx` değeri subdomain'e atanır ve fonksiyon sıfır baytı bitene kadar baytları okur
    3. (subdomain = `"resolve-contract\0"`, subdomain_sfx = `""`)
    4. Sıfır baytı ve subdomain_sfx, alt alan adı diliminden çıkartılır (subdomain = `"resolve-contract"`)
    5. Functions slice_hash ve get_ton_dns_nft_address_by_index kullanılarak alan adı sözleşme adresine dönüştürülür. Bunları [[Alt Çözümleyiciler#Ek 1. resolve-contract.ton Kodu|Ek 1]]'de görebilirsiniz.
4. Aksi takdirde, dnsresolve() alt alan adının `"address\0"` ile başlayıp başlamadığını kontrol eder. Eğer öyleyse, bu öneki atlar ve base64 adresini okur.
5. Verilen çözümleme için sağlanan alt alan adı bu öneklerden hiçbirine uymuyorsa, fonksiyon başarısızlığı `(0, null())` döndürerek gösterir (sıfır bayt öneki hiçbir DNS kaydı ile çözülmedi).
6. Alt alan adı sarmalayıcısının boş olup olmadığını kontrol eder. Boş bir sarmalayıcı, isteğin tamamen karşılandığını gösterir. Eğer sarmalayıcı boşsa:
    1. dnsresolve() alanın "wallet" alt bölümüne yönelik bir DNS kaydı oluşturur, geri aldıkları TON Alan sözleşmesi adresini kullanarak.
    2. Eğer kategori 0 (tüm DNS girişleri) talep ediliyorsa, kayıt bir sözlük içine sarılmış olarak döndürülür.
    3. Eğer kategori "wallet"H isteniyorsa, kayıt olduğu gibi döndürülür.
    4. Aksi takdirde, belirtilen kategori için herhangi bir DNS girişi yoktur, dolayısıyla fonksiyon çözümlemenin başarılı olduğunu ancak sonuç bulamadığını gösterir.
7. Eğer sarmalayıcı boş değilse:
    1. Önceden elde edilen sözleşme adresi bir sonraki çözücü olarak kullanılır. Fonksiyon, ona işaret eden bir sonraki çözücü kaydını oluşturur.
    2. `"\0ton\0stabletimer\0"` o sözleşmeye geçer: işlenmiş bitler alt alan adresinin bitleridir.

Özetle, dnsresolve() ya:

- Alt alan adını bir DNS kaydına tamamen çözer
- Başka bir sözleşmeye geçiş yapmak için bir çözümleyici kaydına kısmı olarak çözümleme yapar
- Bilinmeyen alt alan adları için "alan bulunamadı" sonucunu döndürür

:::warning
Aslında, base64 adreslerinin ayrıştırılması çalışmamaktadır: `.address.resolve-contract.ton` girmeyi denerken, alanın yanlış yapılandırıldığı veya mevcut olmadığına dair bir hata alacaksınız. Bunun nedeni, alan adlarının büyük/küçük harfe duyarsız olmasıdır (gerçek DNS'ten miras alınan özellik) ve bu nedenle küçük harfe dönüştürülüp, sizi var olmayan bir çalışma zincirine yönlendirmesidir.
:::

### Çözümleyicinin bağlanması

Artık alt çözümleyici sözleşmesi dağıtıldığında, alanı ona işaret etmemiz gerekiyor yani alan `dns_next_resolver` kaydını değiştirmemiz gerekiyor. Bunu, alan adı sözleşmesine aşağıdaki TL-B yapısına sahip bir mesaj göndererek yapabiliriz.

1. `change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`

## Kendi alt alan yöneticinizi oluşturma

Alt alan adları, kullanıcılar için faydalı olabilir - örneğin, birkaç projeyi tek bir alan adı ile bağlamak veya arkadaşların cüzdanlarına bağlanmak için.

### Sözleşme verileri

Sözleşme verilerine sahip olmanın yanında sahibinin adresini ve *alan*->*kayıt hash*->*kayıt değeri* sözlüğünü depolamamız gerekiyor.

```func
global slice owner;
global cell domains;

() load_data() impure {
  slice ds = get_data().begin_parse();
  owner = ds~load_msg_addr();
  domains = ds~load_dict();
}
() save_data() impure {
  set_data(begin_cell().store_slice(owner).store_dict(domains).end_cell());
}
```

### Kayıt güncellemesini işleme

```func
const int op::update_record = 0x537a3491;
;; op::update_record#537a3491 domain_name:^Cell record_key:uint256
;;     value:(Maybe ^Cell) = InMsgBody;

() recv_internal(cell in_msg, slice in_msg_body) {
  if (in_msg_body.slice_empty?()) { return (); }   ;; basit para transferi

  slice in_msg_full = in_msg.begin_parse();
  if (in_msg_full~load_uint(4) & 1) { return (); } ;; geri dönen mesaj

  slice sender = in_msg_full~load_msg_addr();
  load_data();
  throw_unless(501, equal_slices(sender, owner));
  
  int op = in_msg_body~load_uint(32);
  if (op == op::update_record) {
    slice domain = in_msg_body~load_ref().begin_parse();
    (cell records, _) = domains.udict_get_ref?(256, string_hash(domain));

    int key = in_msg_body~load_uint(256);
    throw_if(502, key == 0);  ;; "tüm kayıtlar" kaydını güncelleyemezsiniz

    if (in_msg_body~load_uint(1) == 1) {
      cell value = in_msg_body~load_ref();
      records~udict_set_ref(256, key, value);
    } else {
      records~udict_delete?(256, key);
    }

    domains~udict_set_ref(256, string_hash(domain), records);
    save_data();
  }
}
```

Gelen mesajın bir istek içerdiğini, geri dönmediğini, sahibinden geldiğini ve isteğin `op::update_record` olduğunu kontrol ediyoruz.

Sonra, mesajdan alan adını yüklüyoruz. Alanları sözlükte olduğu gibi saklayamayız: farklı uzunluklara sahip olabilirler, ancak TVM non-prefix sözlükleri yalnızca eşit uzunluktaki anahtarları içerebilir. Bu nedenle, `string_hash(domain)` - alan adı SHA-256'sını hesaplıyoruz; alan adı, tam sayıda oktet içerecek şekilde garanti edilmektedir.

Bundan sonra, belirtilen alan için kaydı güncelleyip, yeni verileri sözleşme depolamasına kaydediyoruz.

### Alanları Çözme

```func
(slice, slice) ~parse_sd(slice subdomain) {
  ;; "test\0qwerty\0" -> "test" "qwerty\0"
  slice subdomain_sfx = subdomain;
  while (subdomain_sfx~load_uint(8)) { }  ;; sıfır baytını arıyoruz
  subdomain~skip_last_bits(slice_bits(subdomain_sfx));
  return (subdomain, subdomain_sfx);
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, subdomain_bits % 8 == 0);
  if (subdomain.preload_uint(8) == 0) { subdomain~skip_bits(8); }
  
  slice subdomain_suffix = subdomain~parse_sd();  ;; "test\0" -> "test" ""
  int subdomain_suffix_bits = slice_bits(subdomain_suffix);

  load_data();
  (cell records, _) = domains.udict_get_ref?(256, string_hash(subdomain));

  if (subdomain_suffix_bits > 0) { ;; "<SUBDOMAIN>\0" den fazla istenmiş
    category = "dns_next_resolver"H;
  }

  int resolved = subdomain_bits - subdomain_suffix_bits;

  if (category == 0) { ;; tüm kategoriler istenmiş
    return (resolved, records);
  }

  (cell value, int found) = records.udict_get_ref?(256, category);
  return (resolved, value);
}
```

`dnsresolve` fonksiyonu, istenen alt alan adının tam sayı bayt içerip içermediğini kontrol eder, subdomain diliminin başındaki isteğe bağlı sıfır bayt atlanır, ardından üst düzey alan adı ile diğer her şeyi ayırır (`test\0qwerty\0` `test` ve `qwerty\0` olarak ayrılır). İstenen alanla ilgili kayıt sözlüğü yüklenir.

Eğer boş olmayan bir alt alan sarmalayıcı varsa, fonksiyon bayt sayısını çözülen ve `"dns_next_resolver"H` anahtarında bulunan bir sonraki çözümleyici kaydını döndürür. Aksi takdirde, fonksiyon çözülen bayt sayısını (yani, tam dilim uzunluğu) ve istenen kaydı döndürür.

Bu fonksiyonu hataları daha zarif bir şekilde ele alarak iyileştirme imkanı vardır, ancak bu kesinlikle zorunlu değildir.

## Ek 1. resolve-contract.ton Kodu


subresolver.fc

```func showLineNumbers
(builder, ()) ~store_slice(builder to, slice s) asm "STSLICER";
int starts_with(slice a, slice b) asm "SDPFXREV";

const slice ton_dns_minter = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"a;
cell ton_dns_domain_code() asm """
  B{<TON DNS NFT kodu HEX formatında>}
  B>boc
  PUSHREF
""";

const slice tme_minter = "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"a;
cell tme_domain_code() asm """
  B{<T.ME NFT kodu HEX formatında>}
  B>boc
  PUSHREF
""";

cell calculate_ton_dns_nft_item_state_init(int item_index) inline {
  cell data = begin_cell().store_uint(item_index, 256).store_slice(ton_dns_minter).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(ton_dns_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

cell calculate_tme_nft_item_state_init(int item_index) inline {
  cell config = begin_cell().store_uint(item_index, 256).store_slice(tme_minter).end_cell();
  cell data = begin_cell().store_ref(config).store_maybe_ref(null()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(tme_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

builder calculate_nft_item_address(int wc, cell state_init) inline {
  return begin_cell()
      .store_uint(4, 3)
      .store_int(wc, 8)
      .store_uint(cell_hash(state_init), 256);
}

builder get_ton_dns_nft_address_by_index(int index) inline {
  cell state_init = calculate_ton_dns_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

builder get_tme_nft_address_by_index(int index) inline {
  cell state_init = calculate_tme_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

(slice, builder) decode_base64_address_to(slice readable, builder target) inline {
  builder addr_with_flags = begin_cell();
  repeat(48) {
    int char = readable~load_uint(8);
    if (char >= "a"u) {
      addr_with_flags~store_uint(char - "a"u + 26, 6);
    } elseif ((char == "_"u) | (char == "/"u)) {
      addr_with_flags~store_uint(63, 6);
    } elseif (char >= "A"u) {
      addr_with_flags~store_uint(char - "A"u, 6);
    } elseif (char >= "0"u) {
      addr_with_flags~store_uint(char - "0"u + 52, 6);
    } else {
      addr_with_flags~store_uint(62, 6);
    }
  }
  
  slice addr_with_flags = addr_with_flags.end_cell().begin_parse();
  addr_with_flags~skip_bits(8);
  addr_with_flags~skip_last_bits(16);
  
  target~store_uint(4, 3);
  target~store_slice(addr_with_flags);
  return (readable, target);
}

slice decode_base64_address(slice readable) method_id {
  (slice _remaining, builder addr) = decode_base64_address_to(readable, begin_cell());
  return addr.end_cell().begin_parse();
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);

  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; 'subdomain' boş olmadığını varsayıyoruz
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; mevcut sözleşmenin kendine ait DNS kayıtları yok
      return (8, null());
    }
  }
  
  ;; bazı alt alan adlarını yüklüyoruz
  ;; desteklenen alt alan adları "ton\\0", "me\\0t\\0" ve "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; çözümleme yapıyoruz
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; alan adı okunuyor
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6D65007400"s)) {
    ;; "t" \\0 "me" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(40);
    
    ;; alan adı okunuyor
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_tme_nft_address_by_index(string_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; alan adı çözümlemesi örneği:
    ;; [ilk, bu sözleşmede erişilemez] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [bu sözleşmede erişilebilir] "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; çözüm sonucunun 'ratelance.ton' sözleşmesinin adresine işaret etmesini istemeliyiz, sahibine değil
    ;; bu nedenle, çözümlemenin tamamlandığı ve "wallet"H'ye 'ratelance.ton' sözleşmesinin adresinin olduğu cevabını vermeliyiz
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; alan adı çözümlemesi örneği:
    ;; [ilk, bu sözleşmede erişilemez] "ton\\0resolve-contract\\0ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [bu sözleşmede erişilebilir] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; \\0'ı daha ileriye geçmemiz gerekiyor, böylece sonraki çözümleyici yalnızca bir baytı işleyebilir
    
    ;; sonraki çözümleyici 'resolve-contract<.ton>' sözleşmesidir
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}

() recv_internal() {
  return ();
}
```

