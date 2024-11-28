# Önceden Derlenmiş Sözleşmeler

*Önceden derlenmiş akıllı sözleşme*, node'da C++ uygulamasına sahip bir sözleşmedir. Bir doğrulayıcı, böyle bir akıllı sözleşme üzerinde bir işlem gerçekleştirdiğinde, bu uygulamayı TVM yerine çalıştırabilir. Bu, performansı artırır ve hesaplama ücretlerini azaltmayı sağlar.

## Konfigürasyon

Önceden derlenmiş sözleşmeler listesi ana zincir konfigürasyonunda saklanmaktadır:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

`list:(HashmapE 256 PrecompiledSmc)` bir harita `(code_hash -> precomplied_smc)` 'dir. Eğer bir sözleşmenin kod hash'i bu haritada bulunursa, sözleşme *önceden derlenmiş* olarak kabul edilir.

---

## Sözleşme yürütme

Bir *önceden derlenmiş akıllı sözleşme* üzerindeki her işlem (yani `ConfigParam 45` içinde bulunan kod hash'ine sahip herhangi bir sözleşme) şu şekilde yürütülür:

1. Ana zincir konfigürasyonundan `gas_usage` alınır.
2. Eğer bakiye `gas_usage` gazını ödemek için yeterli değilse, hesaplama aşaması `cskip_no_gas` atlama nedeni ile başarısız olur.
3. Kod iki şekilde çalıştırılabilir:
   1. Eğer önceden derlenmiş yürütme devre dışı bırakıldıysa veya C++ uygulaması geçerli node versiyonunda mevcut değilse, TVM normal şekilde çalıştırılır. TVM için gaz limiti işlem gaz limitine (1M gaz) ayarlanır.
   2. Eğer önceden derlenmiş uygulama etkinleştirildi ve mevcutsa, C++ uygulaması yürütülür.

:::tip
**Hesaplama aşaması değerlerini geçersiz kılın**: `gas_used` 'i `gas_usage` olarak ayarlayın; `vm_steps`, `vm_init_state_hash`, `vm_final_state_hash` 'ı sıfıra ayarlayın.
:::

4. Hesaplama ücretleri, actual TVM gaz kullanımına değil, `gas_usage` 'e dayanmaktadır.

> Önceden derlenmiş sözleşme TVM'de yürütüldüğünde, `c7` 'nin 17. elemanı `gas_usage` olarak ayarlanır ve `GETPRECOMPILEDGAS` talimatı ile alınabilir. Önceden derlenmiş olmayan sözleşmeler için bu değer `null`dır.  
> — *Önemli Not*

Önceden derlenmiş sözleşmelerin yürütülmesi varsayılan olarak devre dışıdır. Bunu etkinleştirmek için `--enable-precompiled-smc` bayrağı ile `validator-engine` çalıştırın.

:::info
Her iki yöntemle önceden derlenmiş bir sözleşme yürütmek aynı işlemi verir. Bu nedenle, C++ uygulamasına sahip ve olmayan doğrulayıcılar ağda güvenle bir arada var olabilir. Bu, tüm doğrulayıcıların node yazılımını hemen güncellemelerini gerektirmeden `ConfigParam 45` 'e yeni girişler eklemeye olanak tanır.
:::

## Mevcut uygulamalar

Hic sunt dracones.

## Ayrıca Bakınız

- `Yönetim Sözleşmeleri`