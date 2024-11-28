# Fift ve TVM Assembly

Fift, hücrelerle çalışabilen, TON'a özgü özelliklere sahip olan bir yığın tabanlı programlama dilidir. TVM assembly de, hücrelerle çalışabilen, TON'a özgü bir yığın tabanlı programlama dilidir. O zaman aralarındaki fark nedir?

## Fark

Fift, **derleme zamanında** - akıllı sözleşme kodu BOC'su derlenirken, FunC kodu işlendiğinde yürütülmektedir. Fift farklı şekillerde görünebilir:

```
// tuple primitive'leri
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```
> TVM opcode tanımları Asm.fif içinde

```
"Asm.fif" dahil et
<{ SETCP0 DUP IFNOTRET // recv_internal dönerse
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" ve "get_public_key" alma yöntemleri
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // sayıcı veya pubk
   }>
   INC 32 THROWIF	// recv_external olmadıkça başarısız
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU 	//  imza in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF	//  imza in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS	//  imza in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT	//  imza in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT	//  imza in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU	//  imza stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU	//  public_key stored_seqno stored_subwallet cs msg_hash imza public_key
   CHKSIGNU 35 THROWIFNOT	//  public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno stored_subwallet cs _51
   }>DO<{	//  public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno stored_subwallet cs _56 mod
     SENDRAWMSG
   }>	//  public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC	//  public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```
> wallet_v3_r2.fif

Kodun son parçası, TVM assembly gibi görünmektedir ve aslında çoğu gerçekten öyledir! Bu nasıl olabilir?

> **Hayal edin**: Bir stajyer programcı ile konuştuğunuzu ve ona "şimdi fonksiyonun sonuna bunu, şunu ve şunu yapan komutlar ekle" dediğinizi. Komutlarınız, stajyerin programında yer alır. İşlenmeleri iki kez gerçekleşir - burada olduğu gibi, büyük harfle yazılmış opcode'lar (SETCP0, DUP vb.) hem Fift hem de TVM tarafından işlenir.

Yüksek seviyeli soyutlamaları stajyerinize açıklayabilirsiniz, sonunda anlayacak ve bunları kullanmayı öğrenebilecektir. Fift de genişletilebilir - kendi komutlarınızı tanımlayabilirsiniz. Aslında, Asm[Tests].fif TVM opcode'larını tanımlamakla ilgilidir.

Öte yandan, TVM opcode'ları **çalışma zamanında** yürütülür - bunlar akıllı sözleşmelerin kodudur. Stajyerinizin programı gibi düşünülebilirler - TVM assembly daha az şey yapabilir (örneğin, imzalama verileri için yerleşik primitive'ler yoktur - çünkü TVM'nin blok zincirinde yaptığı her şey kamuya açıktır), ancak çevresiyle gerçekten etkileşime girebilir.

---

## Akıllı Sözleşmelerde Kullanım

### [Fift] - Büyük BOC'u Sözleşmeye Eklemek

:::tip 
Bu, `toncli` kullanıyorsanız mümkündür. Sözleşmeyi oluşturmak için diğer derleyicileri kullanıyorsanız, büyük BOC'u dahil etmenin başka yolları olabilir.
:::

Akıllı sözleşme kodu oluşturulurken `fift/blob.fif` dosyasının dahil edilmesi için `project.yaml` dosyasını düzenleyin:
```
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

BOC'u `fift/blob.boc` dosyasına koyun, ardından `fift/blob.fif` dosyasına şu kodu ekleyin:
```
<b 8 4 u, 8 4 u, "fift/blob.boc" dosyası>B B>boc ref, b> <s @Defop LDBLOB
```

Artık bu blob'u akıllı sözleşmeden çıkartabilirsiniz:
```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [TVM Assembly] - Tamsayıyı Dizeye Dönüştürmek

:::warning 
"Üzücü bir şekilde", Fift primitive'lerini kullanarak tamsayıdan dizeye dönüşüm girişimi başarısız olur.
:::

```
slice int_to_string(int x) asm "(.) $>s PUSHSLICE";
```
Nedeni açıktır: Fift, henüz dönüşüm için mevcut olmayan `x` ile hesaplamalar yaptığı derleme zamanında çalışır. Sabit olmayan bir tamsayıyı dize dilimine dönüştürmek için TVM assembly kullanmalısınız. Örneğin, bu, TON Smart Challenge 3 katılımcılarından birinin kodudur:
```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(- v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [TVM Assembly] - Ucuz Modulo Çarpımı

```
int mul_mod(int a, int b, int m) inline_ref {               ;; 1232 gaz birimi
  (_, int r) = muldivmod(a % m, b % m, m);
  return r;
}
int mul_mod_better(int a, int b, int m) inline_ref {        ;; 1110 gaz birimi
  (_, int r) = muldivmod(a, b, m);
  return r;
}
int mul_mod_best(int a, int b, int m) asm "x{A988} s,";     ;; 65 gaz birimi
```

`x{A988}` kodu, `5.2 Bölme` belirlendiği gibi, üçüncü argümanın modülünü dönen tek sonuç olduğu ön çarpma ile bölmeyi ifade eden opcode formatındadır. Ancak opcode'u akıllı sözleşme koduna dahil etmek gerekir - `s,` bunu yapar: yığın üzerindeki dilimi, oluşturucuya biraz daha altta saklar.