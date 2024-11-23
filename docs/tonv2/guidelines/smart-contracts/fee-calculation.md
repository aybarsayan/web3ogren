# Ücretlerin Hesaplanması

Sözleşmeniz bir gelen mesajı işlemeye başladığında, mesajın ekli TON miktarını kontrol etmelisiniz, böylece `tüm ücret türlerini` karşılayacak kadar olduğunu doğrulamış olursunuz. Bunu yapmak için, mevcut işlem için ücreti hesaplamanız (veya tahmin etmeniz) gerekir.

Bu belge, yeni TVM opcode'ları kullanarak FunC sözleşmeleri içinde ücretlerin nasıl hesaplanacağını açıklar.

:::info Opcode'lar hakkında daha fazla bilgi  
Aşağıda belirtilenler de dahil olmak üzere TVM opcode'larının kapsamlı bir listesi için `TVM talimat sayfasını` kontrol edin.  
:::

## Depolama Ücreti

### Genel Bakış

Kısacası, **`depoloama ücretleri`**, bir akıllı sözleşmeyi blockchain'de saklamak için ödediğiniz miktarlardır. Akıllı sözleşme blockchain'de saklandığı her saniye için ücret ödersiniz.

Aşağıdaki parametrelerle `GETSTORAGEFEE` opcode'unu kullanın:

| Parametre Adı | Açıklama                                                 |
|:--------------|:--------------------------------------------------------|
| hücre         | Sözleşme hücrelerinin sayısı                            |
| bit           | Sözleşme bitlerinin sayısı                             |
| is_mc         | Kaynak veya hedef masterchain'de ise doğru              |

:::info Depolama ve ileri ücretler için yalnızca benzersiz hash hücreleri sayılır; bu nedenle 3 aynı hash hücresi bir olarak sayılır.  
Özellikle, verileri deduplikler: farklı dallarda referans verilen birden fazla eşdeğer alt hücre varsa, içerikleri yalnızca bir kez saklanır.  
`Deduplikleme hakkında daha fazla bilgi okuyun`.  
:::

### Hesaplama Akışı

Her sözleşmenin bir bakiyesi vardır. Sözleşmenizin belirli bir `saniye` süresi boyunca geçerli kalması için gereken TON miktarını hesaplamak için şu fonksiyonu kullanabilirsiniz:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

O değeri sözleşmeye gömebilir ve mevcut depolama ücretini hesaplamak için şunu kullanabilirsiniz:

```func
;; func stdlib'den fonksiyonlar (mainnet'te sunulmamış)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; stdlib'den sabitler
;;; x nanogramını (y = 0 olduğunda) tam olarak rezerve edecek bir çıktı eylemi oluşturur.
const int RESERVE_REGULAR = 0;
;;; en fazla x nanogramını (y = 2 olduğunda) rezerve edecek bir çıktı eylemi oluşturur.
;;; y'deki +2, belirtilen miktarın rezerve edilememesi durumunda, dış eylemin başarısız olmayacağı anlamına gelir; bunun yerine, tüm geri kalan bakiye rezerv edilir.
const int RESERVE_AT_MOST = 2;
;;; eylem başarısız olursa - işlemi geri çevir. RESERVE_AT_MOST (+2) kullanılıyorsa etkisi yoktur. TVM Yükseltme 2023-07. v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int on_balance_before_msg = my_ton_balance - msg_value;
    int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; SÖZLEŞME KODU GÜNCELLENMEYECEK İSE, KOD HİSSEDİLMELİDİR
    raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

Eğer `storage_fee` sabitlenmişse, **sözleşme güncelleme sürecinde güncellemeyi unutmayın.** Tüm sözleşmeler güncellemeyi desteklemiyor, bu nedenle bu isteğe bağlı bir gereklilik.

---

## Hesaplama Ücreti

### Genel Bakış

Çoğu durumda aşağıdaki parametrelerle `GETGASFEE` opcode'unu kullanın:

| Parametre    | Açıklama                                               |
|:-------------|:--------------------------------------------------------|
| `gas_used`   | Testlerde hesaplanan ve sabitlenen gaz miktarı         |
| `is_mc`      | Kaynak veya hedef masterchain'de ise doğru              |

### Hesaplama Akışı

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

Peki, `gas_used` nasıl elde edilir? Testler aracılığıyla!

`gas_used`'u hesaplamak için, sözleşmenin şu adımları içeren bir testini yazmalısınız:

1. Bir transfer yapar.
2. Başarılı olup olmadığını kontrol eder ve transfer bilgilerini alır.
3. O transfer için hesaplama sırasında kullanılan gerçek gaz miktarını kontrol eder.

Sözleşme hesaplama akışı, giriş verisine bağlı olarak değişebilir. Mümkün olduğunca fazla gaz kullanabilmek için sözleşmeyi bu şekilde çalıştırmalısınız. Sözleşmeyi hesaplamak için en pahalı yolun kullanıldığına emin olun.

```ts
// Sadece Başlatma kodu
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano('0.5');
let forwardAmount = toNano('0.05');
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Her bir bireysel yük için hücre yükü alındığından emin olmak için yükün farklı olduğundan emin olun.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Ücret hesaplamak için bu durumu kullanalım
// İleri yükü özel kullanıcı yükü içine yerleştirin, böylece hesaplama sırasında maksimum gaz kullanılmasını sağlamak için
const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), // ton
    sentAmount, notDeployer.address,
    deployer.address, customPayload, forwardAmount, forwardPayload);
expect(sendResult.transactions).toHaveTransaction({ // fazlalıklar
    from: notDeployerJettonWallet.address,
    to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({ // bildirim
    from: notDeployerJettonWallet.address,
    to: notDeployer.address,
    value: forwardAmount,
    body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) // varsayılan queryId
        .storeCoins(sentAmount)
        .storeAddress(deployer.address)
        .storeUint(1, 1)
        .storeRef(forwardPayload)
        .endCell()
});
const transferTx = findTransactionRequired(sendResult.transactions, {
    on: deployerJettonWallet.address,
    from: deployer.address,
    op: Op.transfer,
    success: true
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if(transaction.description.type !== "generic")
    throw("Beklenen genel işlem eylemi");
  if(transaction.description.computePhase.type !== "vm")
    throw("Hesaplama aşaması beklendi")
  return transaction.description.computePhase;
}

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
    const txComputed = computedGeneric(transaction);
    console.log(`${name} ${txComputed.gasUsed} gaz kullandı`);
    console.log(`${name} gaz maliyeti: ${txComputed.gasFees}`);
    return txComputed.gasFees;
}

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

---

## İleri Ücret

### Genel Bakış

**İleri ücret**, giden mesajlar için alınır.

Genel olarak, ileri ücret işleminde üç durumda vardır:

1. Mesaj yapısı belirleyicidir ve ücreti tahmin edebilirsiniz.
2. Mesaj yapısı büyük ölçüde gelen mesaj yapısına bağlıdır.
3. Giden mesaj yapısını tamamen tahmin edemezsiniz.

### Hesaplama Akışı

Eğer mesaj yapısı belirleyici ise, aşağıdaki parametrelerle `GETFORWARDFEE` opcode'unu kullanın:

| Parametre Adı | Açıklama                                                                            |
|:--------------|:-----------------------------------------------------------------------------------|
| hücre         | Hücre sayısı                                                                       |
| bit           | Bit sayısı                                                                        |
| is_mc         | Kaynak veya hedef masterchain'de ise doğru                                          |

:::info Depolama ve ileri ücretler için yalnızca benzersiz hash hücreleri sayılır; bu nedenle 3 aynı hash hücresi bir olarak sayılır.  
Özellikle, verileri deduplikler: farklı dallarda referans verilen birden fazla eşdeğer alt hücre varsa, içerikleri yalnızca bir kez saklanır.  
`Deduplikleme hakkında daha fazla bilgi okuyun`.  
:::

Ancak, bazen giden mesaj, gelen yapıya önemli ölçüde bağlıdır ve bu durumda ücreti tam olarak tahmin edemezsiniz. Aşağıdaki parametrelerle `GETORIGINALFWDFEE` opcode'unu kullanmaya çalışın:

| Parametre Adı | Açıklama                                         |
|:--------------|:-------------------------------------------------|
| fwd_fee       | Gelen mesajdan ayrıntılı olarak alınmış          |
| is_mc         | Kaynak veya hedef masterchain'de ise doğru       |

:::warning `SENDMSG` opcode'u ile dikkatli olun  
Sonraki opcode, `SENDMSG`, **ücreti hesaplamak için en az optimal yoldur**, ancak **kontrol etmemekten daha iyidir**.  
Bu, **öngörülemeyen bir gaz miktarı** kullanır.  
Gerekmedikçe kullanmayın.  
:::

Eğer `GETORIGINALFWDFEE` bile kullanılamıyorsa, bir seçeneğiniz daha vardır. Aşağıdaki parametrelerle `SENDMSG` opcode'unu kullanın:

| Parametre Adı | Açıklama  |
|:--------------|:-----------|
| hücre         | Hücre sayısı |
| mod           | Mesaj modu |

Modlar ücret hesaplamasını şu şekilde etkiler:
- `+1024`: eylem yaratmaz, yalnızca ücreti tahmin eder. Diğer modlar, eylem aşamasında bir mesaj gönderecektir.
- `+128`: hesaplama aşaması başlamadan önce sözleşmenin toplam bakiyesinin değerini değiştirir (tam olarak doğru değil, çünkü hesaplama aşamasının tamamlanmadan önce tahmin edilemeyen gaz giderleri dikkate alınmaz).
- `+64`: gelen mesajın tüm bakiyesini gelen bir değer olarak değiştirir (tam olarak doğru değil, hesaplama tamamlanmadan önce tahmin edilemeyen gaz giderleri dikkate alınmaz).
- Diğer modlar hakkında daha fazla bilgi `mesaj modları sayfasında` bulunabilir.

Bir çıktı eylemi oluşturur ve bir mesaj yaratmanın ücretini döndürür. Ancak, formüller kullanarak hesaplanamayan bir öngörülemeyen gaz miktarı kullanır, peki nasıl hesaplanır? `GASCONSUMED` kullanın:

```func
int send_message(cell msg, int mode) impure asm "SENDMSG";
int gas_consumed() asm "GASCONSUMED";
;; ... bazı kod ...

() calculate_forward_fee(cell msg, int mode) inline {
  int gas_before = gas_consumed();
  int forward_fee = send_message(msg, mode);
  int gas_usage = gas_consumed() - gas_before;
  
  ;; ileri ücret -- ücret değeri
  ;; gaz kullanımı -- mesajı göndermek için kullanılan gaz miktarı
}
```

## Ayrıca Bakınız
- [Ücret hesaplaması ile stablecoin sözleşmesi](https://github.com/ton-blockchain/stablecoin-contract)