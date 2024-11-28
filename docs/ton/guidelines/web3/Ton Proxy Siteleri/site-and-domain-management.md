# Site & Domain Management

## Alan adı düzenlemek için nasıl açılır

1. Bilgisayarınızdaki Google Chrome tarayıcısını açın.

2. Bu [bağlantıyı](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) kullanarak Google Chrome TON uzantısını yükleyin.

3. Uzantıyı açın, "Cüzdanı içe aktar" butonuna tıklayın ve alan adının kayıtlı olduğu cüzdanı içe aktarın.

> **Kurtarma Kelimeleri**  
> Kurtarma kelimeniz, cüzdanınızı oluşturduğunuzda yazdığınız 24 kelimeden oluşur.  
> Kurtarma kelimenizi kaybederseniz, herhangi bir TON Cüzdanı kullanarak geri yükleyebilirsiniz.  
> Tonkeeper'da: Ayarlar > Cüzdan koruması > Özel anahtarınız bölümüne gidin.  
> 
> Bu 24 kelimeyi yazdığınızdan ve güvenli bir yerde sakladığınızdan emin olun. **Acil bir durumda**, yalnızca kurtarma kelimenizi kullanarak cüzdana erişimi geri kazanabileceksiniz.  
> Kurtarma kelimelerinizi **kesinlikle gizli** tutun. Kurtarma kelimelerinize erişimi olan herkes, fonlarınıza tam erişime sahip olacaktır.  

4. Şimdi alan adınızı [https://dns.ton.org](https://dns.ton.org) adresinde açın ve "Düzenle" butonuna tıklayın.

---

## Bir cüzdanı bir alana nasıl bağlayabilirsiniz

Bir cüzdanı bir alan adına bağlayarak, kullanıcıların cüzdan adresi yerine alan adını alıcı adresi olarak girerek o cüzdana coin göndermesine olanak tanıyabilirsiniz.

1. Yukarıda açıklandığı gibi alan adını düzenlemek için açın.

2. Cüzdan adresinizi "Cüzdan adresi" alanına kopyalayın ve "Kaydet" butonuna tıklayın.

3. Uzantıda işlemi gönderdiğinizi onaylayın.

---

## Bir TON Sitesini bir alana nasıl bağlayabilirsiniz

1. Yukarıda açıklandığı gibi alan adını düzenlemek için açın.

2. TON Sitelerinizin ADNL Adresini HEX formatında "Site" alanına kopyalayın ve "Kaydet" butonuna tıklayın.

3. Uzantıda işlemi gönderdiğinizi onaylayın.

---

## Alt alan adlarını nasıl ayarlayabilirsiniz

1. Web sitenizin veya hizmetinizin alt alan adlarını yönetmek için ağda bir akıllı sözleşme oluşturun. Hazır [manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc) veya [auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc) akıllı sözleşmelerini veya TON DNS arayüzünü uygulayan başka herhangi bir akıllı sözleşmeyi kullanabilirsiniz.

2. Yukarıda açıklandığı gibi alan adını düzenlemek için açın.

3. "Alt alan adları" alanına alt alanların akıllı sözleşme adresini kopyalayın ve "Kaydet" butonuna tıklayın.

4. Uzantıda işlemi gönderdiğinizi onaylayın.