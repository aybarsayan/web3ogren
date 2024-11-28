# TON Depolama SSS

## TON alan adını bir TON Depolama dosya çantasına nasıl atarsınız

1. Ağına dosya çantasını `yükleyin` ve Çanta Kimliği alın.
   
2. Bilgisayarınızda Google Chrome tarayıcısını açın.
   
3. Google Chrome için [TON eklentisini](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) yükleyin. Ayrıca [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc) kullanabilirsiniz.
   
4. Eklentiyi açın, "Cüzdanı içe aktar" butonuna tıklayın ve alan adının sahibi olan cüzdanı kurtarma ifadesini kullanarak içe aktarın.
   
5. Şimdi alan adınızı https://dns.ton.org adresinde açın ve "Düzenle"ye tıklayın.
   
6. Çanta Kimliğinizi "Depolama" alanına kopyalayın ve "Kaydet"e tıklayın.

---

## TON Depolama'da statik TON sitesi nasıl barındırılır

1. Website dosyaları içeren klasörden Çantayı `oluşturun`, ağına yükleyin ve Çanta Kimliğini alın. Klasör `index.html` dosyasını içermelidir.

2. Bilgisayarınızda Google Chrome tarayıcısını açın.

3. Google Chrome için [TON eklentisini](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) yükleyin. Ayrıca [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc) kullanabilirsiniz.

4. Eklentiyi açın, "Cüzdanı içe aktar" butonuna tıklayın ve alan adının sahibi olan cüzdanı kurtarma ifadesini kullanarak içe aktarın.

5. Şimdi alan adınızı https://dns.ton.org adresinde açın ve "Düzenle"ye tıklayın.

6. Çanta Kimliğinizi "Site" alanına kopyalayın, "TON Depolama'da barındır" onay kutusunu işaretleyin ve "Kaydet"e tıklayın.

:::tip
Not: Klasörünüzün `index.html` dosyasını içerdiğinden emin olun!
:::

---

## TON NFT içeriğini TON Depolama'ya nasıl taşınır

Koleksiyonunuz için bir [standart NFT akıllı sözleşmesi](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc) kullandıysanız, koleksiyonun sahibinin cüzdanından koleksiyon akıllı sözleşmesine yeni bir URL ön eki ile bir [mesaj](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132) göndermeniz gerekir.

> Örneğin, URL ön eki `https://mysite/my_collection/` ise, yeni ön ek `tonstorage://my_bag_id/` olacaktır.
> — Önemli Bilgi

---

## TON alan adını bir TON Depolama çantasına nasıl atarsınız (Düşük Seviye)

TON alan adınızın sha256("storage") DNS Kayıt değerine aşağıdaki değeri atamanız gerekir:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

:::info
Bu kayıt, alan adınızın doğru bir şekilde yönlendirilmesi için önemlidir.
:::

---

## TON Depolama'da statik TON sitesi nasıl barındırılır (Düşük Seviye)

Website dosyaları içeren klasörden Çantayı `oluşturun`, ağına yükleyin ve Çanta Kimliğini alın. Klasör `index.html` dosyasını içermelidir.

TON alan adınızın sha256("site") DNS Kayıt değerine aşağıdaki değeri atamanız gerekir:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

:::warning
Lütfen işlemleri dikkatlice takip edin; hata yapmanız durumunda veri kaybı yaşayabilirsiniz.
:::