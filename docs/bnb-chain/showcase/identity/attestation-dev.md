---
description: Bu belge, zincir üzerinde ve zincir dışı taahhüt oluşturma süreçlerini detaylandırmaktadır. Özellikle BAS SDK'sını kullanarak nasıl taahhüt oluşturabileceğinizi ve bu taahhütleri GreenField Depolama alanında nasıl saklayacağınızı keşfedeceksiniz.
keywords: [taahhüt, zincir dışı, GreenField, BAS SDK, Ethereum, kimlik, web3]
---

# Başlarken - Taahhüt

## Zincir Üzerinde Taahhüt Oluşturma

`attest` fonksiyonu, belirli bir şema için güvenle zincir üzerinde bir taahhüt oluşturmanızı sağlar. Bu güçlü fonksiyon, aşağıdaki özelliklere sahip bir nesneyi kabul eder:

* `schema`: Taahhüt oluşturulan şemanın benzersiz tanımlayıcısı (UID).
* `data`: Aşağıdaki özellikleri içeren bir nesne:
	* `recipient`: Taahhüt alıcısının BNB adresi.
	* `expirationTime`: Taahhüt için sona erme zamanını temsil eden bir Unix zaman damgası. Sona ermeyen bir taahhüt için 0 olarak ayarlayabilirsiniz.
	* `revocable`: Taahhütün iptal edilip edilemeyeceğini belirten bir boolean değeri.
	* `refUID`: (Opsiyonel) Referans alınan bir taahhütün UID'si. Referans yoksa ZERO_BYTES32 kullanın.
	* `data`: Taahhüt için oluşturulması gereken kodlanmış veri, SchemaEncoder sınıfı kullanılarak üretilmelidir.

:::tip
Yeni taahhüt oluştururken `revocable` alanının değeri, taahhütün iptal edilip edilmeyeceğini belirler. Eğer şemanız iptal edilemiyorsa, bu alan `false` olmalıdır.
:::

Bu fonksiyon, yeni oluşturulan taahhütün UID'sine çözümlenen bir Promise döner.

```javascript
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";

const bas = new BAS(BASContractAddress);
bas.connect(signer);

// Şema dizesi ile SchemaEncoder'ı başlat
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
  { name: "eventId", value: 1, type: "uint256" },
  { name: "voteIndex", value: 1, type: "uint8" },
]);

const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";

const tx = await bas.attest({
  schema: schemaUID,
  data: {
    recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
    expirationTime: 0,
    revocable: true,// Şemanız iptal edilemiyorsa, bu MUST false olmalıdır
    data: encodedData,
  },
});

const newAttestationUID = await tx.wait();

console.log("Yeni taahhüt UID'si:", newAttestationUID);
```

## GreenField'e Kaydetmeden Zincir Dışı Taahhüt Oluşturma

Zincir dışı bir taahhüt oluşturmak için, BAS SDK'sındaki Off-chain sınıfı tarafından sunulan signOffchainAttestation fonksiyonunu güvenle kullanabilirsiniz. İşte bir örnek:

```javascript
import { SchemaEncoder } from "@bnb-attestation-service/bas-sdk";

const offchain = await bas.getOffchain();

// Şema dizesi ile SchemaEncoder'ı başlat
const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
const encodedData = schemaEncoder.encodeData([
  { name: "eventId", value: 1, type: "uint256" },
  { name: "voteIndex", value: 1, type: "uint8" },
]);

// Signer, ethers.js'den bir Signer örneğidir
const signer = new ethers.Wallet(privateKey, provider);

const offchainAttestation = await offchain.signOffchainAttestation({
  recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
  // Taahhütün sona erme zamanının Unix zaman damgası. (0, süre sona ermeyecek)
  expirationTime: 0,
  // Mevcut zamanın Unix zaman damgası
  time: 1671219636,
  revocable: true,// Şemanız iptal edilemiyorsa, bu MUST false olmalıdır
  version: 1,
  nonce: 0,
  schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
  refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
  data: encodedData,
}, signer);

Bu fonksiyon güvenle zincir dışı bir taahhüt nesnesi oluşturacak, bu nesne imzalanacak ve UID, imza ve taahhüt verilerini içerecektir. Bu nesneyi almak istediğiniz kişiyle güvenle paylaşabilir veya gelecekte kullanım için saklayabilirsiniz.

## Zincir Dışı Taahhüt Oluşturma ve GreenField'e Kaydetme

Zincir dışı bir taahhüt oluşturup sonucu GreenField Depolama alanına kaydetmek için, BAS SDK'sındaki attestOffChain fonksiyonunu güvenle kullanabilirsiniz. İşte bir örnek:

```javascript
  const offchain = await bas.getOffchain();

  // Cüzdan veya istemci kullanarak zincirin BNB olduğundan emin olun
  // :::warning
  // asenkron bir fonksiyon çağrılmalıdır
  await shouldSwitchNetwork(chains[1].id); // BNB chainId

  // Zincir dışı taahhüt
  const attestation = await attestOffChain({
    schemaStr: attestParams.schemaStr,
    schemaUID: attestParams.schemaUID,
    data: attestParams.data,
    recipient: attestParams.recipient,
    revocable: attestParams.revocable,
  });

  const attestationUID = attestation.uid;

  // Cüzdan veya istemci kullanarak zincirin Greenfield Chain olduğundan emin olun
  await shouldSwitchNetwork(chains[0].id);
  const provider = await connector?.getProvider({ chainId: chains[0].id });

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  // Taahhüt nesnesini Greenfield Depolama'ya saklamak için blob'a kodlayın
  const str = JSON.stringify(attestation);
  const bytes = new TextEncoder().encode(str);
  const blob = new Blob([bytes], {
    type: "application/json;charset=utf-8",
  });

  let res;
  try {
    // Taahhütü saklamak için GreenField SDK'sını kullanın
    res = await gfClient.createObject(
      provider,
      new File([blob], `${attestParams.schemaUID}.${attestationUID}`),
      attestParams.isPrivate || true
    );
  } catch (err: any) {
    console.log(err);
    alert(err.message);
  }
```

Bu fonksiyon, zincir dışı bir taahhüt nesnesi oluşturur. Taahhüt nesnesi imzalanacak ve UID, imza ve taahhüt verilerini içerecektir. Önceki fonksiyonda olduğu gibi, bunu greenfield depolama alanına kaydedebilir ve erişimi tercihlerinize göre ayarlayabilirsiniz.

## Daha Fazla Kullanım Durumu

Zincir üzerindeki taahhütler, aşağıdaki gibi güçlü yeni bir web3 uygulamaları yelpazesini mümkün kılacaktır:

* Kimlik
* Güven Puanları
* KYC Hizmetleri
* Sosyal Ağlar
* Oy verme
* Oracle'lar (protokol içinde taahhüt vererek anında ödeme alabilenler)
* Beğeniler/Beğenmemeler
* Taşınabilir Güven Katmanları
* Kredi Skorları
* Etki
* Arazi Kaydı

Ve daha birçokları!

## Kaynaklar
* [BAS JS-SDK](https://doc.bascan.io/sdk/js)