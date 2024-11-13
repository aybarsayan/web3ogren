---
sidebar_position: 3
title: Docker Görseli Kullanımı
---

# Camino Node Docker Kurulumu

Camino-Node'un sürümlerini barındıran bir docker kayıt defterimiz bulunmaktadır. Bu sürümler  üzerinde mevcuttur. Docker görselleri,  üzerinde barındırılan Camino-Node'un önceden derlenmiş, kullanıma hazır sürümleridir.

## Başlamadan Önce

Camino, düğümlerin standart donanımda çalışmasına olanak tanıyan hafif bir protokoldür. Ağ kullanımı arttıkça, donanım gereksinimlerinin değişebileceğini unutmayın.

- CPU: 8 AWS vCPU eşdeğeri
- RAM: 16 GiB
- Depolama: 512 GiB
- OS: Ubuntu 18.04/20.04/22.04

Docker konteyneri, varsayılan yapılandırmada aşağıdaki varsayımlar ile birlikte gelir:

- Camino-Node, henüz başlatılmamış olan `Main-Net` ile bağlantı kuracak ve entegre olacaktır.
- Düğümler arasındaki eşler arası iletişim için yalnızca staking-API etkinleştirilmiştir.
- `/root/.caminogo` dizini, kalıcı bir depolama alanına bağlanmak için kullanılacaktır.
- 9651 portu, internetten erişilebilir durumdadır.

:::caution DÜĞÜM SÜRÜMLERİ

Lütfen yalnızca  sayfasında belirtilen önerilen düğüm sürümlerini kullanın. Ana ağda RC veya Alpha sürümlerinin kullanılmaması önerilir.

:::

## Yapılandırma

Yapılandırmayı değiştirmek için Camino-Node'un yürütülmesine başka bir yapılandırma bayrağı seti geçmeniz gerekir. Yapılandırma bayraklarının listesi  bulunmaktadır.

Örnekler:

- Kamu Test Ağı `Columbus` ile bağlantı kurmak için `--network-id=columbus` bayrağını geçmelisiniz.
- Düğümün HTTP/RPC API'sini etkinleştirmek (örneğin MetaMask erişimi için gereklidir) için `--http-host=` bayrağını geçmelisiniz.

Düğümün bir Validator-Node olarak kullanılacağı durumlarda, staking-API dışındaki tüm diğer API'lerin devre dışı bırakılması şiddetle önerilir!

### docker-compose ile Yapılandırma

Yapılandırmayı daha kolay ve daha kolay hale getirmek için ayrıca düğümünüzü ihtiyaçlarınıza göre yapılandırmak için docker-compose kullanabilirsiniz:

Örnek docker-compose.yml dosyası:

```
version: '3.1'

services:
  camino-columbus:
    image: c4tplatform/camino-node:v0.1.0
    ports:
      - 9650:9650
      - 9651:9651
    volumes:
      - ./camino-data:/root/.caminogo
    command: [ "./camino-node", "--network-id=columbus" , "--http-host=0.0.0.0" ]
```

Bu docker-compose yapılandırmasıyla, Camino-Node Düğümü Kamu Test Ağı Columbus'un bir parçası olarak başlatılır ve HTTP/RPC API'si yalnızca localhost'tan değil, aynı zamanda dışarıdan; standart portu `9650` üzerinden erişilebilir olacaktır.

docker-compose kullanımıyla ilgili referansa  ve bir docker-compose dosyasının olası içeriğine  ulaşabilirsiniz.

## Düğüm Çalışma Dosyaları

Yerel düğüm dosyaları, konteyner içinde `$HOME/.caminogo` dizininde saklanmaktadır. Bu dosyaların kalıcı bir depolama alanında bulunması ve dizinin anahtarlık dosyalarının ve günlüklerin konteyner kapatıldığında kaybolmaması için bağlanması gerekir. Düğümünüzün güvenliği için, `$HOME/.caminogo/staking` dizininde bulunan `staker.crt` ve `staker.key` dosyalarını yedeklemek ve güvenli bir yerde saklamak önemlidir. Bu dosyaları, düğümünüzü farklı bir bilgisayarda yeniden oluşturmanız gerekirse kullanabilirsiniz.

## Ağ Şartları

Camino-Node'un başarılı bir şekilde çalışabilmesi için, internetten `9651` ağ portuna bağlantıları kabul etmesi gerekir. Kuruluma geçmeden önce, düğümünüzün çalışacağı ağ ortamını belirlemeniz gerekmektedir.

### Bulut sağlayıcısında çalıştırma

Eğer düğümünüz bir bulut sağlayıcı bilgisayarında çalışıyorsa, sabit bir IP'ye sahip olacaktır. O sabit IP'nin ne olduğunu öğrenin veya henüz ayarlamadıysanız bunu ayarlayın.

### Ev bağlantısında çalıştırma

Eğer bir konut internet bağlantısında çalışan bir düğümünüz varsa, dinamik bir IP'niz olacaktır; yani, IP adresiniz periyodik olarak değişecektir. Ev bağlantısı için dışarıdan bilgisayara, düğümün kurulu olduğu bilgisayara `9651` portunun yönlendirilmesini ayarlamanız gerekecektir.

Çok fazla model ve yönlendirici yapılandırması olduğu için, ne yapmanız gerektiği konusunda kesin talimatlar veremiyoruz, ancak çevrimiçi kılavuzlar bulabilirsiniz (şu  veya bu  gibi), ve servis sağlayıcınızın desteği de yardımcı olabilir.

### Düğüm Kimliği

Düğümünüzü ağa tanımlamak için kullanılan Düğüm Kimliğinizi bulmak için, docker günlüklerinizdeki log satırını arayabilir veya konteynerle ilişkili bir shell içinde aşağıdaki komutu çalıştırabilirsiniz:

Docker günlükleri:

```bash
docker logs  | grep -oP "node ID is:.*" | cut -d" " -f4 | sort -u
```

Konteyner içindeki komut satırı:

```bash
grep -oP "node ID is:.*" /root/.caminogo/logs/main.log | cut -d" " -f4 | sort -u
```

Bu, aşağıdaki gibi bir çıktı verecektir:

```text
NodeID-6seStrauyCnVV7NEVwRbfaT9B6EnXEzfY
```

Bu, Düğümünüzün Kimliğidir. Bunu saklayın; staking veya düğümünüzü kontrol etmek için gerekecektir.

## Düğüm Güncellemesi

Camino-Node, sürekli bir proje olup düzenli olarak sürüm güncellemeleri yapılmaktadır. Çoğu güncelleme önerilir, ancak zorunlu değildir. Geriye dönük uyumsuz olan güncellemeler için önceden bilgi verilecektir. Yeni bir düğüm sürümü yayımlandığında, günlüklerde aşağıdaki gibi log satırları göreceksiniz:

```text
Jan 08 10:26:45 ip-172-31-16-229 caminogo[6335]: INFO [01-08|10:26:45] caminogo/network/peer.go#526: beacon 9CkG9MBNavnw7EVSRsuFr7ws9gascDQy3 attempting to connect with newer version camino/0.1.0. You may want to update your client
```

Her zaman en son sürüme yükseltmeniz önerilir, çünkü yeni sürümler hata düzeltmeleri, yeni özellikler ve yükseltmeler getirir.

Düğümünüzü güncellemek için, DockerHub deposundan elde edilen docker konteynerinin etiketini değiştirmeniz yeterlidir.

## İleri Düzey Düğüm Yapılandırması

Düğümün çalışma yapılandırmasını yapan dosya `~/.caminogo/configs/node.json` dosyasıdır. Yapılandırma seçeneklerini eklemek veya değiştirmek için düzenleyebilirsiniz. Yapılandırma seçenekleri ile ilgili belgeler  bulunmaktadır. Varsayılan yapılandırma şu şekilde görünebilir:

```json
{
  "dynamic-public-ip": "opendns",
  "http-host": ""
}
```

Yapılandırma dosyasının düzgün bir biçimlendirilmiş `JSON` dosyası olması gerektiğini unutmayın; bu yüzden, seçenekler ile komut satırındaki anahtarlar farklı formatta yazılır. Örneğin `--dynamic-public-ip=opendns` şeklinde girmeyin, yukarıdaki örneğe uygun şekilde yazmalısınız.

## Sonraki Adımlar

Hepsi bu kadar, şimdi Docker üzerinde bir Camino-Node düğümü çalıştırıyorsunuz! Tebrikler! Bunu  veya  üzerinden paylaşabilirsiniz!

Eğer ev ağı (dinamik IP) üzerindeyseniz, port yönlendirmesini ayarlamayı unutmayın. Eğer bir bulut hizmet sağlayıcısında iseniz, her şey yolunda!

Artık .

Son olarak, eğer yapmadıysanız, düğümünüzü farklı bir makineye geri yüklemeniz gerektiğinde önemli dosyaları yedeklemeniz iyi bir fikir olacaktır.

Herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa,  sunucumuz üzerinden bize ulaşmaktan çekinmeyin.