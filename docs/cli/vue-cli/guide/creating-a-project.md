---
title: Proje Oluşturma
description: Vue.js ile yeni bir proje oluşturma yöntemi ve komutları hakkında bilgiler. CLI ve GUI ile proje yönetimi detayları. 
keywords: [Vue.js, proje oluşturma, CLI, GUI, vue create, json, preset]
---

# Proje Oluşturma

## vue create

Yeni bir proje oluşturmak için şunu çalıştırın:

```bash
vue create hello-world
```

::: warning
Eğer Windows'ta Git Bash kullanıyorsanız ve minTTY ile çalışıyorsanız, etkileşimli istemler çalışmayacaktır. Komutu `winpty vue.cmd create hello-world` olarak başlatmalısınız. Ancak `vue create hello-world` söz dizimini kullanmaya devam etmek istiyorsanız, `~/.bashrc` dosyanıza aşağıdaki satırı ekleyerek komutu alias yapabilirsiniz.
`alias vue='winpty vue.cmd'`
Güncellenmiş bashrc dosyasını almak için Git Bash terminal oturumunuzu yeniden başlatmanız gerekecektir.
:::

Bir ön ayar seçmeniz için sizden istenecektir. Temel bir Babel + ESLint kurulumuyla gelen varsayılan ön ayarı seçebilir veya ihtiyaç duyduğunuz özellikleri seçmek için "Özellikleri manuel olarak seç" seçeneğini belirleyebilirsiniz.

![CLI önizleme](../../images/cikti/vue-cli/public/cli-new-project.png)

Varsayılan kurulum, **yeni bir projeyi hızlı bir şekilde prototiplemek** için harikadır, manuel kurulum ise daha **üretim odaklı projeler** için muhtemelen gerekli daha fazla seçenek sunar.

![CLI önizleme](../../images/cikti/vue-cli/public/cli-select-features.png)

Eğer özellikleri manuel olarak seçmeyi tercih ettiyseniz, istemlerin sonunda seçimlerinizi **gelecekte** yeniden kullanabilmeniz için bir ön ayar olarak kaydetme seçeneğiniz de olacaktır. Ön ayarlar ve eklentiler hakkında bir sonraki bölümde tartışacağız.

::: tip ~/.vuerc
Kayıtlı ön ayarlar, kullanıcı ana dizininde `.vuerc` adında bir JSON dosyasında saklanacaktır. Kayıtlı ön ayarları / seçenekleri değiştirmek isterseniz, bu dosyayı düzenleyerek yapabilirsiniz.

Proje oluşturma süreci sırasında, tercih ettiğiniz bir paket yöneticisini seçmeniz veya daha hızlı bağımlılık kurulumu için [Taobao npm kayıt aynasını](https://npmmirror.com/) kullanmanız istendiğinde, seçimleriniz `~/.vuerc` dosyasında kaydedilecektir.
:::

`vue create` komutunun birçok seçeneği vardır ve hepsini keşfetmek için şunu çalıştırabilirsiniz:

```bash
vue create --help
```

```
Kullanım: create [seçenekler] <app-name>

vue-cli-service tarafından desteklenen yeni bir projeyi oluştur


Seçenekler:

  -p, --preset <presetName>       İstemleri atlayın ve kaydedilen veya uzak ön ayarı kullanın
  -d, --default                   İstemleri atlayın ve varsayılan ön ayarı kullanın
  -i, --inlinePreset <json>       İstemleri atlayın ve ön ayar olarak satır içi JSON dizesi kullanın
  -m, --packageManager <komut>    Bağımlılıkları yüklerken belirtilen npm istemcisini kullanın
  -r, --registry <url>            Bağımlılıkları yüklerken belirtilen npm kayıt defterini kullanın
  -g, --git [message|false]       Git başlatmayı zorla / atla; isteğe bağlı olarak ilk taahhüt mesajını belirt
  -n, --no-git                    Git başlatmayı atla
  -f, --force                     Hedef dizini mevcutsa üzerine yaz
  --merge                         Hedef dizini mevcutsa birleştir
  -c, --clone                     Uzak ön ayarı alma sırasında git clone kullan
  -x, --proxy                     Proje oluştururken belirtilen proxy'i kullan
  -b, --bare                      Başlangıç talimatları olmadan proje iskeleti oluştur
  --skipGetStarted                "Başlarken" talimatlarını gösterme
  -h, --help                      Kullanım bilgilerini çıktılar
```

## GUI Kullanımı

Ayrıca, `vue ui` komutuyla grafiksel arayüz kullanarak projeleri oluşturabilir ve yönetebilirsiniz:

```bash
vue ui
```

Yukarıdaki komut, proje oluşturma sürecinde size rehberlik eden bir GUI ile bir tarayıcı penceresi açacaktır.

![UI önizleme](../../images/cikti/vue-cli/public/ui-new-project.png)

## 2.x Şablonlarını Çekme (Eski)

Vue CLI >= 3 aynı `vue` ikili dosyasını kullandığı için Vue CLI 2'yi (`vue-cli`) üzerine yazar. Eğer hala eski `vue init` işlevselliğine ihtiyacınız varsa, global bir köprü kurabilirsiniz:

```bash
npm install -g @vue/cli-init
# vue init artık vue-cli@2.x ile aynı şekilde çalışıyor
vue init webpack my-project
```