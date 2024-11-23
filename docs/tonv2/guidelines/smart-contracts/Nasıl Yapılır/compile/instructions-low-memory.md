# Düşük Bellekli Makinelerde TON Derleme

:::caution
Bu bölüm, TON ile etkileşimde bulunmak için talimatlar ve kılavuzlar içermektedir.
:::

Düşük bellekli (1GB'dan az) bir bilgisayarda TON derlemek için takas partisyonları oluşturma.

## Ön Koşullar

Linux sisteminde C++ derlemesi sırasında aşağıdaki hatalar oluşmakta olup, bu da derlemenin iptal edilmesine neden olmaktadır:

> C++: fatal error: Killed signal terminated program cc1plus compilation terminated.  
> — Hata Mesajı

## Çözüm

Bu durum, **bellek yetersizliğinden** kaynaklanmakta olup, :::tip takas partisyonları oluşturarak çözülmektedir. :::

```bash
# Partisyon yolunu oluştur
sudo mkdir -p /var/cache/swap/
# Partisyonun boyutunu ayarla
# bs=64M blok boyutudur, count=64 blok sayısıdır, böylece takas alanı boyutu bs*count=4096MB=4GB
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64
# Bu dizinin izinlerini ayarla
sudo chmod 0600 /var/cache/swap/swap0
# SWAP dosyasını oluştur
sudo mkswap /var/cache/swap/swap0
# SWAP dosyasını aktive et
sudo swapon /var/cache/swap/swap0
# SWAP bilgilerini kontrol et
sudo swapon -s
```

:::info
Takas partisyonunu silmek için aşağıdaki komutları kullanabilirsiniz:
:::

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

:::note
Boş alan komutunu görüntülemek için aşağıdaki komutu kullanabilirsiniz:
:::

```bash
sudo swapoff -a
#Detaylı kullanım: swapoff --help
#Geçerli bellek kullanımını görüntüle: --swapoff: free -m
```

---

Takas partisyonu oluşturma adımlarını başarıyla tamamladıysanız, derleme işleminiz daha sorunsuz bir şekilde gerçekleşecektir. Unutmayın ki, bellek yetersizliği genellikle performans sorunlarına yol açabilir.