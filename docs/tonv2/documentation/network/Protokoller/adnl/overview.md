# ADNL Protokolü

Uygulama:  
* [TON Github Repository](https://github.com/ton-blockchain/ton/tree/master/adnl)

## Genel Bakış

TON'un temel taşını Soyut Datagram Ağı Katmanı (ADNL) oluşturmaktadır.

Bu, **UDP** üzerinde (gelecekte IPv6 ile birlikte) çalışan, üst düzey, eşler arası, güvenilmez (küçük boyutlu) bir datagram protokolüdür ve UDP mevcut değilse isteğe bağlı **TCP yedekleme** sunar.

:::info  
ADNL protokolü, yüksek düzeyde esneklik ve güvenlik sunma özelliği taşır.  
:::

## ADNL adresi

Her bir katılımcının 256-bit ADNL Adresi vardır.

ADNL Protokolü, yalnızca ADNL Adreslerini kullanarak (güvenilmez) datagramlar göndermenize ve almanıza olanak tanır. **IP Adresleri** ve **Portlar** ADNL Protokolü tarafından gizlenmektedir.

> Bir ADNL Adresi esasen 256-bit ECC genel anahtarı ile eşdeğerdir.  
> — ADNL Protokolü, alıcı adresine yönelik iletileri almak için karşılık gelen özel anahtara ihtiyaç duyar.

Bir ADNL Adresi genel anahtar değildir; bir serileştirilmiş TL-objesinin 256-bit SHA256 hash'idir.

## Şifreleme ve güvenlik

Normalde, gönderilen her datagram, gönderen tarafından imzalanır ve yalnızca alıcının iletinin şifrelerini çözmesine ve imzayla bütünlüğünü doğrulamasına olanak tanıyacak şekilde şifrelenir.

:::tip  
**Gönderim ve alım süreçlerinde dikkat edilmesi gereken en iyi uygulamalar**:  
- Her zaman geçerli bir özel anahtar kullanın.  
- İletilerinizi şifreleyerek güvenliğinizi artırın.  
:::

## Komşu tabloları

Normalde, bir TON ADNL düğümünün, diğer bilinen düğümler hakkında, soyut adresleri, genel anahtarları, IP Adresleri ve UDP Portlarını içeren bir "komşu tablosu" olacaktır. Zamanla, bu tablonun, bu bilinen düğümlerden topladığı bilgileri kullanarak kademeli olarak genişletilecektir. 


Ek Bilgiler
Bu yeni bilgiler, özel sorgulara yanıtlar ya da bazen eski kayıtların kaldırılması biçiminde olabilir.  


ADNL, nokta-nokta kanallar ve tüneller (proxy zinciri) kurmanıza olanak tanır.

ADNL üzerinde TCP-benzeri bir akış protokolü oluşturulabilir.

## Sırada ne var?

* ADNL hakkında daha fazla bilgi için `Düşük Seviye ADNL makalesini` okuyun.
* [TON Beyaz Kitabı](https://docs.ton.org/ton.pdf) 3.1. bölüm.