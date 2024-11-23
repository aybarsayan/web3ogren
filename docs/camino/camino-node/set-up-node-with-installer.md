---
sidebar_position: 2
title: Otomatik Kurulum Scripti
description: Hızlı ve kolay bir dağıtım için kurulum scriptini kullanın.
---

# Camino Node Kurulum Scripti

Bilgisayarınıza Camino-Node'u yükleyen bir  mevcut. Bu script, sadece birkaç dakika içinde minimum kullanıcı girişi gerektirerek, tam çalışır bir node kurulumunu sağlamaktadır.

## Başlamadan Önce

Camino, nodların sıradan donanımda çalışmasını sağlayan hafif bir protokoldür. Ağ kullanımı arttıkça, donanım gereksinimlerinin değişebileceğini unutmayın.

- CPU: 8 AWS vCPU eşdeğeri
- RAM: 16 GiB
- Depolama: 512 GiB
- OS: Ubuntu 18.04/20.04/22.04

Bu kurulum scripti şu varsayımlara dayanmaktadır:

- Camino-Node çalışmıyor ve hizmet olarak zaten yüklenmemiştir.
- Scripti çalıştıran kullanıcı süper kullanıcı ayrıcalıklarına sahiptir ( `sudo` çalıştırabilir).

:::caution DÜZENLEMELER

Lütfen yalnızca  sayfasında belirtilen önerilen node versiyonlarını kullanmaya özen gösterin. Ana ağda RC veya Alpha sürümlerini kullanmaktan kaçının.

:::

### Ortam Dikkate Alınacaklar

Farklı bir Linux dağıtımı kullanıyorsanız, script beklediğiniz gibi çalışmayabilir. Script, sistem hizmetlerini çalıştırmak için `systemd` kullanıldığını varsayıyor. Diğer Linux dağıtımları farklı şeyler kullanabilir veya belirli dosyaların başka yerlerde olabileceği varsayımlarda bulunabilir.

Eğer bilgisayarınızda zaten bir node çalışıyorsa, scripti çalıştırmadan önce durdurun.

#### Terminalden Çalışan Node

Eğer node'unuz bir terminalde çalışıyorsa, `ctrl+C` tuşlarına basarak durdurabilirsiniz.

#### Hizmet Olarak Çalışan Node

Eğer node'unuz zaten bir hizmet olarak çalışıyorsa, o zaman bu scripti kullanmanıza gerek yok. İşinizi görüyorsunuz.

#### Arka Planda Çalışan Node

Eğer node'unuz arka planda çalışıyorsa (örneğin, `nohup` ile çalıştırılmışsa), node'u çalıştıran süreci bulmak için `ps aux | grep camino-node` komutunu çalıştırın. Bu, aşağıdaki gibi bir çıktı üretecektir:

```text
ubuntu  6834  0.0  0.0   2828   676 pts/1    S+   19:54   0:00 grep camino-node
ubuntu  2630 26.1  9.4 2459236 753316 ?      Sl   Dec02 1220:52 /home/ubuntu/build/camino-node
```

`grep` içermeyen satırı arayın. Bu örnekte, bu ikinci satırdır. Node'unuz hakkında bilgi göstermektedir. Süreç kimliğini, bu durumda `2630` olarak not edin. Node’u durdurmak için `kill -2 2630` komutunu çalıştırın.

#### Node Çalışma Dosyaları

Eğer daha önce bu bilgisayarda bir Camino-Node çalıştırdıysanız, yerel node dosyaları `$HOME/.caminogo` dizininde depolanmış olacaktır. Bu dosyalar bozulmayacak ve script tarafından kurulan node, daha önce sahip olduğu kimlik ve durum ile çalışmaya devam edecektir. Ancak, node'unuzun güvenliği için, `$HOME/.caminogo/staking` dizininde bulunan `staker.crt` ve `staker.key` dosyalarını yedeklemek için güvenli bir yerde saklayın. Bu dosyaları kullanarak, node'unuzu farklı bir bilgisayarda yeniden oluşturabilirsiniz.

### Ağ Dikkate Alınacaklar

Başarıyla çalışabilmesi için, Camino-Node'un internetteki `9651` ağ portundan bağlantıları kabul etmesi gerekir. Kurulumdan önce, node'unuzun hangi ağ ortamında çalışacağını belirlemeniz gereklidir.

#### Bulut Sağlayıcıda Çalışma

Eğer node'unuz bir bulut sağlayıcı bilgisayarında çalışıyorsa, statik bir IP'ye sahip olacaktır. O statik IP'yi öğrenin veya daha önce ayarladıysanız ayarlayın. Script kendi başına IP'yi bulmaya çalışacaktır, fakat bu her ortamda çalışmayabilir, bu nedenle IP'yi kontrol etmeniz veya kendiniz girmeniz gerekecektir.

#### Ev Bağlantısında Çalışma

Eğer bir ev internet bağlantısında bir node çalıştırıyorsanız, dinamik bir IP'ye sahipsiniz; yani, IP'niz periyodik olarak değişecektir. Kurulum scripti, bu duruma uygun olarak node'u yapılandıracaktır. Ancak ev bağlantısı için, internete bağlanan node'un bulunduğu bilgisayara `9651` portunun dışarıdan yönlendirilmesi gerekecektir.

Çok sayıda model ve yönlendirici yapılandırmaları bulunduğundan, ne yapacağımız hakkında kesin talimat veremiyoruz, ancak  veya  gibi çevrimiçi kılavuzlar bulabilirsiniz. Ayrıca, hizmet sağlayıcınızın desteği de yardımcı olabilir.

## Scripti Çalıştırma

Şimdi, sisteminizi hazırladığınıza ve bilgileri aldığınıza göre, işe başlayalım.

Scripti indirmek ve çalıştırmak için terminale aşağıdaki komutu girin:

```bash
wget -nd -m https://raw.githubusercontent.com/chain4travel/camino-docs/c4t/scripts/camino-node-installer.sh;\
chmod 755 camino-node-installer.sh;\
./camino-node-installer.sh
```

İşlem başlıyor! Çıktı aşağıdaki gibi bir şey olmalıdır:

```text
Camino-Node installer
---------------------
Preparing environment...
Found arm64 architecture...
Looking for the latest arm64 build...
Will attempt to download:
 https://github.com/chain4travel/camino-node/releases/download/v0.1.0/camino-node-linux-arm64-v0.1.0.tar.gz
camino-node-linux-arm64-v0.1.0.tar.gz 100%[=========================================================================>]  29.83M  75.8MB/s    in 0.4s
Unpacking node files...
camino-node-v0.1.0/plugins/
camino-node-v0.1.0/camino-node
Node files unpacked into /home/ubuntu/camino-node
```

Ardından, script sizden ağ ortamı hakkında bilgi isteyecektir:

```text
To complete the setup some networking information is needed.
Where is the node installed:
1) residential network (dynamic IP)
2) cloud provider (static IP)
Enter your connection type [1,2]:
```

Eğer dinamik IP'niz varsa `1` girin, Eğer statik IP varsa `2` girin. Statik IP'de, IP'yi otomatik olarak algılamaya çalışacak ve doğrulama isteyecektir.

```text
Detected '104.27.15.23' as your public IP. Is this correct? [y,n]:
```

Belirlenen IP doğruysa `y`, yanlışsa (veya boşsa) `n` girin ve ardından bir sonraki istemde doğru IP'yi girin.

Script, sistem hizmetinin oluşturulması ile devam edecek ve hizmeti başlatma ile tamamlanacaktır.

```text
Installing service with public IP: 104.27.15.23
Created symlink /etc/systemd/system/multi-user.target.wants/camino-node.service → /etc/systemd/system/camino-node.service.

Done!

Your node should now be bootstrapping on the main net.
Node configuration file is /home/ubuntu/.caminogo/configs/node.json
To check that the service is running use the following command (q to exit):
sudo systemctl status camino-node
To follow the log use (ctrl+C to stop):
sudo journalctl -u camino-node -f

Reach us over on https://discord.gg/camino if you're having problems.
```

Script tamamlandı ve tekrar sistem istemini görmelisiniz.

## Testnet Üzerinde Çalışma (columbus)

Oluşturulan yapılandırma dosyasında `network-id` seçeneği yoktur, bu da ana ağ (camino) üzerinde çalışacağı anlamına gelir. Node'u testnet üzerinde çalıştırmak için, `.caminogo/configs/node.json` dosyasında `"network-id": "columbus"` eklemelisiniz. Aşağıdaki gibi görünmelidir:

```json
{
  "public-ip": "111.111.111.111",
  "network-id": "columbus",
  "http-host": ""
}
```

Yapılandırma dosyasını değiştirdiyseniz node'u durdurup tekrar başlatmalısınız. 

## Kurulum Sonrası

Camino-Node, bir hizmet olarak arka planda çalışmalıdır. Bunun çalıştığını kontrol etmek için:

```bash
sudo systemctl status camino-node
```

Bu, node'un en son günlüklerini yazdıracaktır. Günlükler aşağıdaki gibi görünmelidir:

```text
● camino-node.service - Camino-Node systemd service
Loaded: loaded (/etc/systemd/system/camino-node.service; enabled; vendor preset: enabled)
Active: active (running) since Tue 2021-01-05 10:38:21 UTC; 51s ago
Main PID: 2142 (camino-node)
Tasks: 8 (limit: 4495)
Memory: 223.0M
CGroup: /system.slice/camino-node.service
└─2142 /home/ubuntu/camino-node/camino-node --dynamic-public-ip=opendns --http-host=

Jan 05 10:38:45 ip-11-11-11-11 camino-node[2142]: INFO [01-05|10:38:45]  caminogo/vms/platformvm/vm.go#322: initializing last accepted block as 2FUFPVPxbTpKNn39moGSzsmGroYES4NZRdw3mJgNvMkMiMHJ9e
Jan 05 10:38:45 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:38:45]  caminogo/snow/engine/snowman/transitive.go#58: initializing consensus engine
Jan 05 10:38:45 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:38:45] caminogo/api/server.go#143: adding route /ext/bc/11111111111111111111111111111111LpoYY
Jan 05 10:38:45 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:38:45] caminogo/api/server.go#88: HTTP API server listening on ":9650"
Jan 05 10:38:58 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:38:58]  caminogo/snow/engine/common/bootstrapper.go#185: Bootstrapping started syncing with 1 vertices in the accepted frontier
Jan 05 10:39:02 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:39:02]  caminogo/snow/engine/snowman/bootstrap/bootstrapper.go#210: fetched 2500 blocks
Jan 05 10:39:04 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:39:04]  caminogo/snow/engine/snowman/bootstrap/bootstrapper.go#210: fetched 5000 blocks
Jan 05 10:39:06 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:39:06]  caminogo/snow/engine/snowman/bootstrap/bootstrapper.go#210: fetched 7500 blocks
Jan 05 10:39:09 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:39:09]  caminogo/snow/engine/snowman/bootstrap/bootstrapper.go#210: fetched 10000 blocks
Jan 05 10:39:11 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:39:11]  caminogo/snow/engine/snowman/bootstrap/bootstrapper.go#210: fetched 12500 blocks
```

`active (running)` ifadesine dikkat edin; bu, hizmetin düzgün çalıştığını belirtmektedir. Komut istemine geri dönmek için `q` tuşuna basmanız gerekebilir.

Node'unuzun ağa kimliğini belirtmek için kullanılan NodeID'sini öğrenmek için aşağıdaki komutu çalıştırın:

```bash
sudo journalctl -u camino-node | grep "NodeID"
```

Bu, aşağıdaki gibi bir çıktı üretecektir:

```text
Jan 05 10:38:38 ip-11-11-11-11 caminogo[2142]: INFO [01-05|10:38:38] caminogo/node/node.go#428: Set node's ID to 6seStrauyCnVV7NEVwRbfaT9B6EnXEzfY
```

`NodeID-` ifadesini değerin önüne ekleyin; örneğin, `NodeID-6seStrauyCnVV7NEVwRbfaT9B6EnXEzfY`. Bunu saklayın; staking veya node'unuzu sorgulamak için gereklidir.

Node'unuzun şu anda başlatıldığı süreçte olduğunu kontrol edebilirsiniz. İlerlemeyi izlemek için aşağıdaki komutu çalıştırın:

```bash
sudo journalctl -u camino-node -f
```

Node çıktısını okumayı durdurmak istediğinizde `ctrl+C` tuşuna basın.

## Node’u Durdurma

Camino-Node'u durdurmak için:

```bash
sudo systemctl stop camino-node
```

Tekrar başlatmak için:

```bash
sudo systemctl start camino-node
```

## Node Güncellemesi

Camino-Node sürekli bir projedir ve düzenli sürüm güncellemeleri yapılmaktadır. Çoğu güncelleme önerilmektedir ancak zorunlu değildir. Geriye dönük uyumluluğu olmayan güncellemeler için önceden bilgilendirme yapılacaktır. Node'un yeni bir versiyonu yayımlandığında, günlüklerde aşağıdaki gibi ifade göreceksiniz:

```text
Jan 08 10:26:45 ip-172-31-16-229 caminogo[6335]: INFO [01-08|10:26:45] caminogo/network/peer.go#526: beacon 9CkG9MBNavnw7EVSRsuFr7ws9gascDQy3 attempting to connect with newer version camino/0.1.0. You may want to update your client
```

Her zaman en son sürüme güncelleneceği önerilmektedir, çünkü yeni sürümler hata düzeltmeleri, yeni özellikler ve güncellemeler getirmektedir.

Node'unuzu güncellemek için, kurulum scriptini tekrar çalıştırmalısınız:

```bash
./camino-node-installer.sh
```

Zaten Camino-Node'unuzun yüklü olduğunu tespit edecek:

```text
Camino-Node installer
---------------------
Preparing environment...
Found 64bit Intel/AMD architecture...
Found Camino-Node systemd service already installed, switching to upgrade mode.
Stopping service...
```

Daha sonra, node'unuzu en son versiyona güncelleyerek işlemi tamamlayacak ve bitirdiğinde en son sürüm bilgilerini yazdıracaktır:

```text
Node upgraded, starting service...
New node version:
camino/0.1.0 [network=camino, database=v1.0.0, commit=f76f1fd5f99736cf468413bbac158d6626f712d2]
Done!
```

## Node Yapılandırması

Node'un çalışma yapılandırmasını ayarlayan dosya `~/.caminogo/configs/node.json`'dır. Yapılandırma seçeneklerini eklemek veya değiştirmek için düzenleyebilirsiniz. Yapılandırma seçeneklerinin belgelerini  bulabilirsiniz. Varsayılan yapılandırma aşağıdaki gibi görünebilir:

```json
{
  "dynamic-public-ip": "opendns",
  "http-host": ""
}
```

Yapılandırma dosyasının düzgün biçimlendirilmiş bir `JSON` dosyası olması gerektiğine dikkat edin, bu nedenle anahtarlar komut satırından farklı biçimlendirilmiştir. Bu yüzden, `--dynamic-public-ip=opendns` gibi seçenekler girmemelisiniz; yukarıdaki örnekte olduğu gibi girmeniz gerekmektedir.

## Önceki Bir Sürüm Kullanma

Kurulum scripti, en son sürüm dışındaki bir Camino-Node sürümünü yüklemek için de kullanılabilir.

Yüklenebilir sürümlerin listesine bakmak için:

```bash
./camino-node-installer.sh --list
```

 aşağıdaki gibi bir liste yazdıracaktır:

```text
Camino-Node installer
---------------------
Available versions:
v0.1.0
v0.0.0
```

Belirli bir sürümü yüklemek için, scripti `--version` ile sürüm etiketini takiben çalıştırmalısınız. Örneğin:

```bash
./camino-node-installer.sh --version v0.1.0
```

:::danger
Unutmayın ki, tüm Camino-Node sürümleri uyumlu değildir. Genel olarak, en son sürümü çalıştırmalısınız. En son sürüm dışında bir sürüm çalıştırmak, node'unuzun düzgün çalışmamasına veya doğrulayıcılar için staking ödüllerini alamamanıza neden olabilir.
:::

## Yeniden Yükleme ve Script Güncellemesi

Kurulum scripti, zaman zaman güncellemeler alır; yeni özellikler ve yetenekler eklenir. Yeni özelliklerden yararlanmak veya node'unuzun çalışmamasına neden olan değişikliklerden kurtulmak için node'u yeniden yüklemek isteyebilirsiniz. Bunu yapmak için, scriptin en son sürümünü webden indirin:

```bash
wget -nd -m https://raw.githubusercontent.com/chain4travel/camino-docs/main/scripts/camino-node-installer.sh
```

Script güncellendikten sonra, `--reinstall` yapılandırma bayrağı ile tekrar çalıştırın:

```bash
./camino-node-installer.sh --reinstall
```

Bu, mevcut hizmet dosyasını silecektir ve scripti ilk kez çalıştırıyormuş gibi baştan çalıştıracaktır. Veritabanı ve NodeID korunacaktır.

## Sonra Ne Olacak?

İşte bu kadar, artık bir Camino-Node nodu çalıştırıyorsunuz! Tebrikler! Bunu gerçekleştirdiğinizi  veya  üzerinden bize bildirin!

Eğer bir ev ağında (dinamik IP) çalışıyorsanız, port yönlendirmeyi ayarlamayı unutmayın. Eğer bir bulut hizmet sağlayıcısında iseniz, sorun yok.

Artık .

Son olarak, eğer yapmadıysanız, önemli dosyalarınızı yedeklemeniz iyi bir fikir olabilir; böylece node'unuzu farklı bir makineye geri yüklemeniz gerektiğinde kullanabilirsiniz.

Herhangi bir sorunuz olursa veya yardıma ihtiyacınız olursa, lütfen  sunucumuz üzerinden bize ulaşmaktan çekinmeyin.