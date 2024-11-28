# TON DNS & Domainlar

TON DNS, insan tarafından okunabilir alan adlarını (örneğin `test.ton` veya `mysite.temp.ton`) TON Akıllı Sözleşme Adreslerine, TON Ağı'nda çalışan servisler tarafından kullanılan ADNL Adreslerine (örneğin TON Siteleri) ve benzerlerine çevirmek için bir servistir.

## Standart

[TON DNS Standartı](https://github.com/ton-blockchain/TIPs/issues/81), alan adlarının formatını, bir alanın çözümleme sürecini, DNS akıllı sözleşmelerinin arayüzünü ve DNS kayıtlarının formatını tanımlar.

## SDK

TON DNS ile çalışmak, JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) ve [TonLib](https://ton.org/#/apis/?id=_2-ton-api) içinde uygulanmıştır.

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// veya 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

Ayrıca `lite-client` ve `tonlib-cli`, DNS sorguları tarafından desteklenmektedir.

## Birinci seviye alan

**Uyarı:** Şu anda yalnızca `.ton` ile biten alanlar geçerli TON DNS alanları olarak tanınmaktadır.

Root DNS akıllı sözleşme kaynak kodu - [root-dns.fc](https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc).

Bu gelecekte değişebilir. Yeni bir birinci seviye alan eklemek yeni bir root akıllı sözleşme ve [ağ yapılandırmasını değiştirmek için genel bir oylama](https://ton.org/#/smart-contracts/governance?id=config) gerektirecektir.

## *.ton alanları

*.ton alanları, bir NFT biçiminde uygulanmıştır. NFT standardını uyguladıkları için, düzenli NFT hizmetleri (örneğin NFT pazar yerleri) ve NFT'yi görüntüleyebilen cüzdanlarla uyumludurlar.

*.ton alanları kaynak kodu - [dns-contract](https://github.com/ton-blockchain/dns-contract).

**Not:** .ton alanları çözücü, bir NFT koleksiyon arayüzünü uygular ve .ton alanı bir NFT öğesi arayüzünü uygular.



**Satış Duyurusu:** *.ton alanlarının ana satışı, [https://dns.ton.org](https://dns.ton.org) adresinde merkeziyetsiz bir açık ihale ile gerçekleşmektedir. Kaynak kodu - [dns](https://github.com/ton-blockchain/dns).

## Alt alanlar

Alan sahibi, DNS kaydındaki `sha256("dns_next_resolver")` altında alt alanları çözmekten sorumlu akıllı sözleşmenin adresini belirleyerek alt alanlar oluşturabilir.


İlginç Bilgi

Bu, DNS standardını uygulayan herhangi bir akıllı sözleşme olabilir.

