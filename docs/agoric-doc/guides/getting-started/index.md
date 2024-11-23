---
title: Hadi Başlayalım!
---

# Hadi Başlayalım!

Bu adımları takip ederek ilk Agoric dapp'inizi kurup çalıştıracaksınız!

::: tip Video Anlatım

Bu eğitimi takip ederken, her bir adımı ve istenen sonucu gösteren bu video anlatımı izlemeniz faydalı olabilir.




:::

## İlk Agoric Dapp'iniz - Teklif Ver

Teklif Ver Dapp'i kullanıcıların bir pazarda satılığa çıkarılmış tüm ürünleri görüntülemesine olanak tanır. Dapp varsayılan olarak 3 ürün gösterir (haritalar, iksirler ve parşömenler). Kullanıcı olarak toplamda 3 ürünü (herhangi bir kombinasyonla) seçebilirsiniz. Daha sonra en az 0.25 IST tutarında bir teklif oluşturabilirsiniz. İşlemi imzaladığınızda, cüzdanınızda 3 ürünü görecek ve cüzdan bakiyeniz teklif tutarından azalacaktır.



## Yardım Alma Yöntemleri

Başlamadan önce, takıldığınızda, sorularınız olduğunda veya bileşenlere dair merak ettiğiniz konularla ilgili bazı kaynakları elinizin altında bulundurmanız faydalı olabilir. Bizimle iletişim kurmak son derece kolay!

- Haftalık  katılın
- Resmi  sunucusunda bizimle ve diğer geliştiricilerle sohbet edin
-  içerisinde  arayın ve paylaşın
-  üzerinden bize bir mesaj gönderin
-  ile iletişime geçin

## Platform Gereksinimleri

Agoric şu an için macOS ve Linux'u (Windows için  dahil) desteklemektedir. Bu eğitim,  üzerinde bir yükleme ile ilişkilendirilmiştir. Farklı bir işletim sistemi kullanıyorsanız, bazı farklılıklar gerekebilir.

## Ön Gereksinimleri Yükleme

Bu bölümde, ortamınıza ön gereksinim bileşenlerini yükleyeceksiniz. Eğer yeni bir Ubuntu yüklemesi yerine kendi ortamınızda çalışıyorsanız, bu bileşenlerden bazılarının zaten yüklenmiş olabileceğini unutmayın.

### Node.js Yükleme


Node.js Yüklemek

Bu eğitim, özel bir  sürümünü gerektirir.

 (Node Version Manager) aracı doğru sürümü seçmeyi kolaylaştırır. 

Öncelikle,  takip edin ve `nvm.sh` dosyasını kabuğunuza dahil edin.


Ubuntu'da nvm Yüklemek

Aşağıdaki komutu kabuğunuzda kopyalayarak çalıştırabilirsiniz.

```sh
# Örneğin:
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Bu nvm'i yükler
```




MacOS'da nvm Yüklemek

nvm, Mac'in varsayılan paket yöneticisinde mevcut değildir, bu nedenle önce Homebrew yüklemeniz gerekecek. Bunu yapmak için bir terminal penceresi açın ve şu komutu çalıştırın:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

Ardından, Brew kullanarak nvm'i yükleyebilirsiniz:

```sh
brew install nvm
```

Her yeni terminal penceresi açıldığında nvm'i kullanılabilir hale getirmek için, shell profilinize (örn. ~/.bash_profile veya ~/.zshrc) aşağıdaki satırı eklemeniz gerekecek:

```sh
source $(brew --prefix nvm)/nvm.sh
```



Ardından, Node.js'i yükleyin.

```sh
nvm install v18.18.0
```

Son olarak, Node.js sürümünü doğrulayın.

```sh
node --version
```



### Yarn Yükleme

Yarn'ı yüklemek için `npm install --global yarn` komutunu çalıştırabileceğiniz gibi, daha fazla bilgi için https://classic.yarnpkg.com/en/docs/install adresini ziyaret edebilirsiniz. Aşağıda, `corepack enable` komutu Corepack shim'lerini yükleme dizinlerine ekleyecek ve `yarn --version` komutu, yarn'ın doğru şekilde yüklendiğini doğrulayacaktır.

```sh
corepack enable
yarn --version # doğrulama için
```

Bu uygulama Yarn 1 kullanmaktadır, bu nedenle yukarıdaki komut `1.x.x` formatında bir sürüm göstermelidir. Eğer farklı bir yarn sürümü kullanıyorsanız, `yarn set version ` komutuyla geçiş yapabilirsiniz, örneğin:

```sh
yarn set version 1.22.5
```

### Docker Yükleme


Docker Yükleme

Docker'ı,  veya  adımlarını takip ederek indirebilirsiniz.

CLI üzerinden yüklemek için, aşağıdaki adımları kontrol edebilirsiniz.


Ubuntu'da Docker Yükleme

Docker'ı iki adımda yükleyeceksiniz. İlk olarak, Docker GPG anahtarlarını sisteminize ekleyecek komut bloğunu çalıştırın ve ardından Apt için kurulum deposunu ekleyin.

```sh
# Docker'ın resmi GPG anahtarını ekleyin:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Depoyu Apt kaynaklarına ekleyin:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

Artık Docker'ı yükleyebilirsiniz!

```sh
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Docker yüklendikten sonra, kullanıcı hesabınızı Docker grubuna eklemeniz gerekecek.

```sh
sudo usermod -aG docker $USER
```

Kullanıcı hesabınız yeni Docker grubuna eklendiğinden, grup üyeliklerinizi yeniden değerlendirmek için aşağıdaki komutu çalıştırın.

```sh
exec su -l $USER
```




MacOS'da Docker Yükleme

Docker'ı resmi belgeleri veya Homebrew kullanarak yükleyebilirsiniz.

**Docker Web Sitesini Kullanarak:**

 izleyin.

Docker Desktop'ı yükledikten sonra, docker'ı başlatmak için:

```sh
open -a Docker
```

**Homebrew Kullanarak:**

Önceden brew yüklediniz. Docker'ı yüklemek için aynı komutu kullanabilirsiniz.

```sh
brew cask install docker
```

veya

```sh
brew install docker --cask
```



Docker'ın çalıştığını test etmek için `hello-world` örneğini çalıştırın.

```sh
docker run hello-world
```

`hello-world` örneğinin çıktısı şu şekilde olmalıdır:

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```



## Şablondan Dapp Oluşturma

Şimdi, yarn kullanarak örnek dapp'i indireceksiniz. Örnek dapp, `demo` adında bir alt klasöre yerleştirilecektir.

```sh
yarn create @agoric/dapp demo
```

## Dapp Bağımlılıklarını Yükleme

Şimdi `demo` dizinine gidin ve `yarn install` komutunu çalıştırarak herhangi bir çözüm bağımlılıklarını yükleyin.

Gerekli tüm bağımlılıkların indirilmesi birkaç dakika sürebilir. UI, React çerçevesine dayanır ve sözleşme Agoric çerçevesine dayanır. Bu projedeki paketler ayrıca testler, kod formatlama ve statik analiz için geliştirme bağımlılıklarına sahiptir.

```sh
cd demo
```

```sh
yarn install
```


Yarn install hatalarını giderme

`yarn install` sırasında hatalarla karşılaşırsanız,  arasında olduğunuzu ve yerel Windows kullanmadığınızı kontrol edin.

Ardından, ilgili geliştirici araçlarının yüklü olduğundan emin olun. Örneğin, Debian veya Ubuntu Linux'ta şu komutu çalıştırın: `sudo apt get install build-essential`.
MacOS üzerinde,  yüklediğinizden emin olun.



## Yerel Agoric Blockchain'i Başlatma

Artık `yarn start:docker` komutunu kullanarak yerel bir Agoric blockchain başlatabilirsiniz. Not: Bu konteynerin boyutu birkaç gigabayttır ve indirilmesi birkaç dakika sürebilir.

```sh
yarn start:docker
```

Ağ başlatıldıktan sonra, günlükleri kontrol edebilirsiniz. `commit` durumunda bloklar gösteren mesajlar gördüğünüzde, ağın düzgün çalıştığından emin olabilirsiniz.

```sh
yarn docker:logs
```

Çıktınız şu şekilde olmalıdır:

```
demo-agd-1  | 2023-12-27T04:08:06.384Z block-manager: block 1003 begin
demo-agd-1  | 2023-12-27T04:08:06.386Z block-manager: block 1003 commit
demo-agd-1  | 2023-12-27T04:08:07.396Z block-manager: block 1004 begin
demo-agd-1  | 2023-12-27T04:08:07.398Z block-manager: block 1004 commit
demo-agd-1  | 2023-12-27T04:08:08.405Z block-manager: block 1005 begin
demo-agd-1  | 2023-12-27T04:08:08.407Z block-manager: block 1005 commit
```

::: details Not: günlükler benign hata mesajları içerir

Şu gibi mesajları göz ardı edebilirsiniz:

- `v5: TypeError: target has no method "getDisplayInfo"`

Bu mesajlar, geçmiş olayların yeniden oynatılmasının kalıntılarıdır.

:::

## Dapp Akıllı Sözleşmesini Başlatma

Günlüklerden çıkmak için control-C tuşlarına basın, ardından akıllı sözleşmeyi başlatın. Sözleşme başlaması bir veya iki dakika sürebilir, bu nedenle bu komutu çalıştırdıktan sonra bir sonraki adıma geçin.

```sh
yarn start:contract
```


Sahne Arkası
Bu `start:contract` scripti birçok şeyi gerçekleştirecektir ve daha sonra daha ayrıntılı olarak ele alınacaktır (_, _):

1. Sözleşmeyi `agoric run ...` ile paketleyin.
2. `agd tx bank send ...` ile biraz ATOM toplayın. _ATOM, Cosmos Ağı'nın yerel kripto para birimidir._
3. Yeterli IST basmak için bir kasa açmak için ATOM kullanın, `agops vaults open ...`.
4. Zincir üzerinde paketleri yüklemek için `agd tx swingset install-bundle ...` komutunu kullanın.
5. Yönetim mevduatı için yeterli BLD toplayın `agd tx bank send ...`
6. Sözleşmeyi başlatmak için bir yönetim teklifi oluşturun `agd tx gov submit-proposal swingset-core-eval ...`.
7. Teklif için oy kullanın; geçmesini bekleyin.


## Keplr Cüzdan Demo Hesabı Kurma

Sonraki adımda,  yüklediğinizden emin olun.

Keplr Cüzdanını Yüklemek

Tarayıcınızda  adresine gidin. Tarayıcınıza uygun olan sürümü seçin.





::: warning

Unutmayın, bu sadece bir demo. Gerçek dünya senaryolarında, mnemonik ifadelerin etrafında uygun güvenliği sağlamak kritik öneme sahiptir!

- Kendi varlıklarınızı güvence altına almak için kullandığınız herhangi bir mnemonik ifade için, **tamamen gizli tutulmasına dikkat edin!** Burada kullanılan mnemonik sadece test amaçlıdır.
- **Ayrı bir tarayıcı profili** kullanmak, test ederken yanlış hesap kullanma olasılığınızı azaltmanın iyi bir yoludur.

:::

Eklenti yüklendikten sonra, Keplr'yi açın ve **Mevcut bir cüzdanı takip et** seçeneğini seçin. Ardından, **kurtarma ifadesini veya özel anahtarı kullan** seçeneğini belirleyin.





Cüzdanınızı içe aktarmak için, aşağıdaki mnemonik ifadeyi Keplr'ye kopyalamanız gerekecek.

```
spike siege world rather ordinary upper napkin voice brush oppose junior route trim crush expire angry seminar anchor panther piano image pepper chest alone
```





Yeni cüzdanınıza bir isim ve şifre verin. Sonraki adımda tıklayın.




Sonraki adımda, yalnızca **Cosmos Hub** dışındaki hiçbir **ağ** seçeneğini işaretlemeyin. Kaydet'e tıklayın.





## Dapp'i Başlatma

Örnek dapp'in kullanıcı arayüzünü başlatın.

```sh
yarn start:ui
```

Terminal penceresinde görünen localhost bağlantısını not edin. Bu bağlantıyı tarayıcınızda açın.





Tarayıcı kullanıcı arayüzünden **Cüzdanı Bağla** butonuna tıklayarak Keplr cüzdanınızı bağlayın.

Keplr'a yerel Agoric ekleme

Herhangi bir  gibi, yerel Agoric blockchain'ini ilk kez kullanıyorsanız, Keplr sizden onay isteyecektir:





## Teklif Yapma

Cüzdanınız bağlandığında, 3 mülk satın almak için **Teklif Yap** butonuna tıklayın. Keplr cüzdanınızdaki işlemi onaylayın.



İşlem tamamlandığında cüzdanınızdan bazı IST'lerin alındığını göreceksiniz ve artık üç yeni mülkün sahibi olacaksınız. Gerekli 0.25 IST'den daha az teklif vermek veya üçten fazla ürün satın almayı denemekten çekinmeyin. Bu tekliflerin kabul edilmeyeceğini göreceksiniz. Bu tür koşullu teklifler, Agoric platformunun önemli bir parçasıdır!



Tebrikler! İlk Agoric dapp'inizi kurup çalıştırmayı başardınız! Artık ilk Agoric dapp'inizi çalıştırdığınıza göre, bu alıştırmadan bazı önemli derslere odaklanalım:

- **Agoric Zinciri Başlatma**: Yerel bir Agoric blockchain başlatma deneyimi kazandınız.

- **Sözleşme Dağıtımı**: Agoric platformuna bir akıllı sözleşme dağıttınız!
  _Not:  daha sonra ele alınacaktır._

- **Teklif Yapma**: Nihayet, bir teklif vermeyi öğrendiniz ve teklif kısıtlamalarının Agoric platformu tarafından uygulandığını gördünüz. Bu, kullanıcı arayüzünün, gerçek ücretleri çok daha yüksek bir miktar (örneğin 500 IST) göstermeye çalışarak kullanıcıyı yanıltamayacağı anlamına gelir. Ayrıca, sözleşmenin 0.25 IST'yi almak için isteği yerine getirmeden veya 'verme' kısıtlaması içinde 0.25 IST'den fazlasını almasına izin verilmediğini unutmamak önemlidir.

Bu eğitim, Agoric platformunda merkeziyetsiz uygulama geliştirmek isteyen geliştiriciler için temel bir adım taşını temsil eder. Agoric dapp'leri oluşturmayı daha fazla öğrenmek için bu sitedeki diğer belgelere göz atmayı unutmayın!