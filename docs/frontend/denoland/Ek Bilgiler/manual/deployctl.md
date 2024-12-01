---
title: "deployctl'i komut satırında kullanma"
description: deployctl, terminalinizi terk etmeden Deno Deploy platformuyla çalışmanızı sağlayan bir komut satırı aracıdır. Bu içerik, `deployctl` aracını yüklemek, yapılandırmak ve dağıtım yönetimini gerçekleştirmek için gereken adımları kapsamaktadır.
keywords: [deployctl, Deno, CLI, dağıtım, ortam değişkenleri, proje yönetimi, Deno Deploy]
---

`deployctl`, terminalinizi terk etmeden Deno Deploy platformuyla çalışmanızı sağlayan bir komut satırı aracıdır (CLI). Bununla kodunuzu dağıtabilir, projelerinizi ve dağıtımlarını oluşturup yönetebilir ve kullanımını ve günlüklerini izleyebilirsiniz.

## Bağımlılıklar

`deployctl` için tek bağımlılık Deno çalışma zamanıdır. Bunu aşağıdaki komutu çalıştırarak yükleyebilirsiniz:

```sh
curl -fsSL https://deno.land/install.sh | sh
```

Önceden bir Deno Deploy hesabı oluşturmanıza gerek yoktur. İlk projenizi dağıttığınızda otomatik olarak oluşturulacaktır.

## `deployctl` Yükle

Deno çalışma zamanı yüklü olduğunda, `deployctl` aracını aşağıdaki komutla yükleyebilirsiniz:

```sh
deno install -gArf jsr:@deno/deployctl
```

Deno yükleme komutundaki `-A` seçeneği, yüklü script için tüm izinleri verir. Bunu kullanmamayı tercih edebilirsiniz; bu durumda aracın çalıştırılması sırasında gerekli izinleri vermeniz istenecektir.

## Dağıt

Kodunuzu yeni bir dağıtım yapmak için projenizin kök dizinine gidin ve şu komutu çalıştırın:

```shell
deployctl deploy
```

### Proje ve Giriş Noktası

Bu projenin ilk dağıtımıysa, `deployctl` mevcut olduğu Git repo veya dizinine dayanarak proje adını tahmin eder. Benzer şekilde, yaygın giriş noktası adlarına (main.ts, src/main.ts vb.) bakarak giriş noktasını tahmin eder. İlk dağıtımdan sonra kullanılan ayarlar varsayılan olarak `deno.json` adlı bir yapılandırma dosyasında saklanacaktır.

Proje adını ve/veya giriş noktasını `--project` ve `--entrypoint` argümanlarıyla belirtebilirsiniz. Proje mevcut değilse, otomatik olarak oluşturulacaktır. Varsayılan olarak, kullanıcının kişisel organizasyonunda oluşturulur; ancak `--org` argümanını belirterek özel bir organizasyonda da oluşturulabilir. Organizasyon henüz mevcut değilse, otomatik olarak oluşturulacaktır.

```shell
deployctl deploy --project=helloworld --entrypoint=src/entrypoint.ts --org=my-team
```

### Dosyaları Dahil Et ve Hariç Tut

Varsayılan olarak, deployctl mevcut dizindeki tüm dosyaları dağıtır (dizileri, `node_modules` dizinleri hariç). Bu davranışı `--include` ve `--exclude` argümanlarını kullanarak özelleştirebilirsiniz (ayrıca yapılandırma dosyasında da desteklenir). Bu argümanlar belirli dosyaları, tüm dizinleri ve globları kabul eder. İşte bazı örnekler:

- Sadece kaynak ve statik dosyaları dahil et:

  ```shell
  deployctl deploy --include=./src --include=./static
  ```

- Sadece Typescript dosyalarını dahil et:

  ```shell
  deployctl deploy --include=**/*.ts
  ```

- Yerel araçları ve eserleri hariç tut

  ```shell
  deployctl deploy --exclude=./tools --exclude=./benches
  ```

:::warning
Kaynak kodu modüllerini dahil etmemek yaygın bir hatadır (giriş noktası ve bağımlılıklar). Aşağıdaki örnek, `main.ts` dahil edilmediği için başarısız olacaktır:
```shell
deployctl deploy --include=./static --entrypoint=./main.ts
```
:::

Giriş noktası ayrıca uzaktaki bir script olabilir. Bunu kullanmanın yaygın bir yolu, `std/http/file_server.ts` kullanarak statik bir site dağıtmaktır (daha fazla detay için [Statik Site Eğitimi](https://docs.deno.com/deploy/tutorials/static-site)):

```shell
deployctl deploy --include=dist --entrypoint=jsr:@std/http/file_server
```

### Ortam Değişkenleri

Bireysel ortam değişkenlerini ayarlamak için `--env` veya bir veya daha fazla ortam dosyasını yüklemek için `--env-file` seçeneklerini kullanabilirsiniz. Bu seçenekler birleştirilebilir ve birden fazla kez kullanılabilir:

```shell
deployctl deploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

Dağıtım, bu değişkenlere `Deno.env.get()` kullanarak erişecektir. Unutmayın ki `--env` ve `--env-file` ile ayarlanan ortam değişkenleri, oluşturulmakta olan dağıtıma özgüdür ve proje için yapılandırılmış `env değişkenleri listesine` eklenmez.

### Üretim Dağıtımları

Yarattığınız her dağıtımın benzersiz bir URL'si vardır. Ayrıca, bir projenin "üretim URL'si" ve "üretim" dağıtımına yönlendiren özel alan adları vardır. Dağıtımlar, herhangi bir zamanda üretime terfi ettirilebilir veya doğrudan `--prod` bayrağı ile üretim olarak oluşturulabilir:

```shell
deployctl deploy --prod
```

Üretim dağıtımları hakkında daha fazla bilgi için `Dağıtımlar` belgelerine bakın.

## Dağıtımlar

Dağıtımlar alt komutu, dağıtımlar etrafındaki tüm işlemleri gruplar.

### Listele

Bir projenin dağıtımlarını listelemek için:

```shell
deployctl deployments list
```

Çıktı:

```
✔ 'my-project' projesinin dağıtımlarının liste sayfası 1 hazır
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Dağıtım   │               Tarih               │   Durum    │  Veritabanı  │                       Alan Adı                       │ Giriş Noktası │  Dal  │  Taahhüt  │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ kcbxc4xwe4mc │ 12/3/2024 13:21:40 CET (2 gün)  │ Önizleme   │ Önizleme    │ https://my-project-kcbxc4xwe4mc.deno.dev │ main.ts    │ ana     │ 4b6c506  │
│ c0ph5xa9exb3 │ 12/3/2024 13:21:25 CET (2 gün)  │ Üretim     │ Üretim     │ https://my-project-c0ph5xa9exb3.deno.dev │ main.ts    │ ana     │ 4b6c506  │
│ kwkbev9er4h2 │ 12/3/2024 13:21:12 CET (2 gün)  │ Önizleme   │ Önizleme    │ https://my-project-kwkbev9er4h2.deno.dev │ main.ts    │ ana     │ 4b6c506  │
│ dxseq0jc8402 │ 6/3/2024 23:16:51 CET (8 gün)   │ Önizleme   │ Üretim     │ https://my-project-dxseq0jc8402.deno.dev │ main.ts    │ ana     │ 099359b  │
│ 7xr5thz8yjbz │ 6/3/2024 22:58:32 CET (8 gün)   │ Önizleme   │ Önizleme    │ https://my-project-7xr5thz8yjbz.deno.dev │ main.ts    │ başka  │ a4d2953  │
│ 4qr4h5ac3rfn │ 6/3/2024 22:57:05 CET (8 gün)   │ Başarısız  │ Önizleme   │ n/a                                                │ main.ts    │ başka  │ 56d2c88  │
│ 25wryhcqmb9q │ 6/3/2024 22:56:41 CET (8 gün)   │ Önizleme   │ Önizleme    │ https://my-project-25wryhcqmb9q.deno.dev │ main.ts    │ başka  │ 4b6c506  │
│ 64tbrn8jre9n │ 6/3/2024 8:21:33 CET (8 gün)    │ Önizleme   │ Üretim     │ https://my-project-64tbrn8jre9n.deno.dev │ main.ts    │ ana     │ 4b6c506  │
│ hgqgccnmzg04 │ 6/3/2024 8:17:40 CET (8 gün)    │ Başarısız  │ Üretim     │ n/a                                                │ main.ts    │ ana     │ 8071902  │
│ rxkh1w3g74e8 │ 6/3/2024 8:17:28 CET (8 gün)    │ Başarısız  │ Üretim     │ n/a                                                │ main.ts    │ ana     │ b142a59  │
│ wx6cw9aya64c │ 6/3/2024 8:02:29 CET (8 gün)    │ Önizleme   │ Üretim     │ https://my-project-wx6cw9aya64c.deno.dev │ main.ts    │ ana     │ b803784  │
│ a1qh5fmew2yf │ 5/3/2024 16:25:29 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-a1qh5fmew2yf.deno.dev │ main.ts    │ ana     │ 4bb1f0f  │
│ w6pf4r0rrdkb │ 5/3/2024 16:07:35 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-w6pf4r0rrdkb.deno.dev │ main.ts    │ ana     │ 6e487fc  │
│ nn700gexgdzq │ 5/3/2024 13:37:11 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-nn700gexgdzq.deno.dev │ main.ts    │ ana     │ c5b1d1f  │
│ 98crfqxa6vvf │ 5/3/2024 13:33:52 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-98crfqxa6vvf.deno.dev │ main.ts    │ ana     │ 090146e  │
│ xcdcs014yc5p │ 5/3/2024 13:30:58 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-xcdcs014yc5p.deno.dev │ main.ts    │ ana     │ 5b78c0f  │
│ btw43kx89ws1 │ 5/3/2024 13:27:31 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-btw43kx89ws1.deno.dev │ main.ts    │ ana     │ 663452a  │
│ 62tg1ketkjx7 │ 5/3/2024 13:27:03 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-62tg1ketkjx7.deno.dev │ main.ts    │ ana     │ 24d1618  │
│ 07ag6pt6kjex │ 5/3/2024 13:19:11 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-07ag6pt6kjex.deno.dev │ main.ts    │ ana     │ 4944545  │
│ 4msyne1rvwj1 │ 5/3/2024 13:17:16 CET (9 gün)   │ Önizleme   │ Üretim     │ https://my-project-4msyne1rvwj1.deno.dev │ main.ts    │ ana     │ dda85e1  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
Sonraki sayfayı almak için enter tuşuna basın [Enter]
```

Bu komut, varsayılan olarak 20 dağıtımın sayfalarını çıkarır. Sayfalar arasında enter tuşu ile geçiş yapabilir ve belirli bir sayfa ve sayfa boyutunu sorgulamak için `--page` ve `--limit` seçeneklerini kullanabilirsiniz.

Diğer komutlar gibi, dağıtımları listelemek için, bir proje dizininde değilseniz veya farklı bir projenin dağıtımlarını listelemek istiyorsanız `--project` seçeneğini kullanabilirsiniz.

### Göster

Belirli bir dağıtımın tüm ayrıntılarını almak için:

```shell
deployctl deployments show
```

Çıktı:

```
✔ 'my-project' projesinin üretim dağıtımı 'c0ph5xa9exb3'
✔ 'c0ph5xa9exb3' dağıtımının ayrıntıları hazır:

c0ph5xa9exb3
------------
Durum:       Üretim
Tarih:       2 gün, 12 saat, 29 dakika, 46 saniye önce (12/3/2024 13:21:25 CET)
Proje:       my-project (e54f23b5-828d-4b7f-af12-706d4591062b)
Organizasyon: my-team (d97822ac-ee20-4ce9-b942-5389330b57ee)
Alan Adları: https://my-project.deno.dev
              https://my-project-c0ph5xa9exb3.deno.dev
Veritabanı:  Üretim (0efa985f-3793-48bc-8c05-f740ffab4ca0)
Giriş Noktası:  main.ts
Env Değişkenleri:  HOME
Git
  Ref:        ana [4b6c506]
  Mesaj:      değişiklik adı
  Yazar:      John Doe @johndoe [mailto:johndoe@deno.com]
  Url:        https://github.com/arnauorriols/my-project/commit/4b6c50629ceeeb86601347732d01dc7ed63bf34f
Cronlar:     başka bir cron [*/10 * * * *] 15/3/2024 1:50:00 CET'de 2 saniye sonra başarılı oldu (sonraki 15/3/2024 2:00:00 CET'de)
              en yeni cron [*/10 * * * *] n/a
              bir başka cron [*/10 * * * *] 15/3/2024 1:40:00 CET'de 2 saniye sonra başarısız oldu (sonraki 15/3/2024 1:51:54 CET'de)
```

Eğer herhangi bir dağıtım belirtilmemişse, komut mevcut üretim dağıtımının detaylarını gösterir. Son dağıtımın detaylarını görmek için `--last`, belirli bir dağıtımın detaylarını görmek için `--id` (veya pozisyonel argüman) kullanabilirsiniz. Ayrıca zaman sırasına göre dağıtımlar arasında gezinmek için `--next` veya `--prev` kullanabilirsiniz.

Örneğin, en son dağıtımın ayrıntılarını görmek için:

```shell
deployctl deployments show --last --prev
```

Ve belirli bir dağıtımdan sonraki 2 dağıtımın ayrıntılarını görmek için:

```shell
deployctl deployments show 64tbrn8jre9n --next=2
```

### Yeniden Dağıt

Yeniden dağıt komutu, mevcut bir dağıtımın yapısını yeniden kullanarak yeni bir dağıtım oluşturur; bu, ona bağlı kaynakların değiştirilmesi için kullanılır. Bu, üretim alan adlarını, ortam değişkenlerini ve KV veritabanlarını içerir.

:::info
Yeniden dağıtım seçimini seçmenin mantığı, `göster alt komutu` ile aynı olup `--last`, `--id`, `--next` ve `--prev` içermektedir.
:::

#### Üretim Alan Adları

Projenin üretim alan adlarının yönlendirmesini belirli bir dağıtıma değiştirmek istiyorsanız, `--prod` seçeneği ile yeniden dağıtım yapabilirsiniz:

```shell
deployctl deployments redeploy --prod 64tbrn8jre9n
```

Bu, belirtilen dağıtım ile aynı kodu ve ortam değişkenlerini kullanarak yeni bir dağıtım oluşturacaktır, ancak projeye ait üretim alan adları buna yönlendirilecektir. Önizleme/üretim veritabanları olan projeler için (yani GitHub ile bağlantılı projeler) bu, yeni dağıtım için üretim veritabanını da ayarlayacaktır.

:::note
Bu özellik, Deno Deploy web uygulamasında bulunan "üretime terfi et" butonuna benzer; ancak "üretime terfi et" butonu yeni bir dağıtım oluşturmaz. Bunun yerine, "üretime terfi et" butonu alan adı yönlendirmesini yerinde değiştirir; ancak bu, yalnızca üretim veritabanını kullanan dağıtımlarla sınırlıdır.
:::

#### KV Veritabanı

Bu bir GitHub dağıtımıysa, bir üretim dağıtımı ve bir önizleme dağıtımı için 2 veritabanı olacaktır. Bir dağıtımın veritabanını değiştirmek için `--db` seçeneği ile yeniden dağıtım yapabilirsiniz:

```shell
deployctl deployments redeploy --db=prod --id=64tbrn8jre9n
```

:::note
Bir dağıtımı üretime yeniden dağıtırken, varsayılan olarak otomatik olarak üretim veritabanını kullanacak şekilde yapılandırılacaktır. Bu davranıştan vazgeçmek için `--prod` ve `--db` seçeneklerini birleştirebilirsiniz. Örneğin, aşağıdaki komut mevcut üretim dağıtımını yeniden dağıtacaktır (poziyonel argüman, `--id` veya `--last` yokluğunda). Yeni dağıtım, yeni üretim dağıtımı olacaktır ancak üretim veritabanı yerine önizleme veritabanını kullanacaktır:
```shell
deployctl deployments redeploy --prod --db=preview
```
:::

Eğer organizasyonunuzun özel veritabanları varsa, UUID ile de ayarlayabilirsiniz:

```shell
deployctl deployments redeploy --last --db=5261e096-f9aa-4b72-8440-1c2b5b553def
```

#### Ortam Değişkenleri

Bir dağıtım oluşturulduğunda, proje ortam değişkenlerini devralır. Dağıtımların değişmez olduğu göz önüne alındığında, ortam değişkenleri asla değiştirilemez. Bir dağıtımda yeni ortam değişkenleri ayarlamak için `--env` (bireysel değişkenleri ayarlamak için) ve `--env-file` (bir veya daha fazla ortam dosyasını yüklemek için) kullanarak yeniden dağıtım yapmanız gerekir.

Aşağıdaki komut, mevcut üretim dağıtımını `.env` ve `.other-env` dosyalarında tanımlı ortam değişkenleriyle yeniden dağıtır; ek olarak `DEPLOYMENT_TS` değişkeni mevcut zaman damgası ile ayarlanır. Ortaya çıkan dağıtım, bir önizleme dağıtımı olacaktır (yani, `--prod` eksikliğinden ötürü, üretim alan adları buna trafik yönlendirmeyecektir):

```shell
deployctl deployments redeploy --env-file --env-file=.other-env --env=DEPLOYMENT_TS=$(date +%s)
```

:::note
Ortam değişkenlerini değiştirirken yalnızca yeniden dağıtım komutundaki ayarlanan ortam değişkenlerinin yeni dağıtım tarafından kullanılacağını unutmayın. Proje ortam değişkenleri ve yeniden dağıtılan dağıtımın ortam değişkenleri görmezden gelinir. Eğer bu ihtiyaçlarınıza uymuyorsa, lütfen geri dönüşlerinizi iletin: https://github.com/denoland/deploy_feedback/issues/
:::

:::note
Deno Deploy web uygulamasında proje ortam değişkenlerini değiştirdiğinizde, mevcut üretim dağıtımı yeni ortam değişkenleri ile yeniden dağıtılır ve yeni dağıtım yeni üretim dağıtımı haline gelir.
:::

### Sil

Bir dağıtımı silmek için `delete` alt komutunu kullanabilirsiniz:

```shell
deployctl deployments delete 64tbrn8jre9n
```

`tahmin`, `göster` ve `yeniden dağıt` gibi komutlar da, silinecek dağıtımı seçmek için `--last`, `--next` ve `--prev` da kullanılabilir. İşte son (dikkatli kullanılmalıdır!) hariç tüm dağıtımları siliyor:

```shell
while deployctl deployments delete --project=my-project --last --prev; do :; done
```

## Projeler

`projects` alt komutu, projelere yönelik tüm işlemleri gruplar; bu, `listele`, `göster`, `yeniden adlandır`, `oluştur` ve `sil` işlemlerini içerir.

### Listele

`deployctl projects list`, kullanıcının erişim sağladığı tüm projeleri, organizasyonlarına göre gruplar:

```
Kişisel org:
    blog
    url-kısaltıcı

'my-team' org:
    admin-site
    ana-site
    analiz
```

Organizasyona göre filtrelemek için `--org` kullanabilirsiniz:

```shell
deployctl projects list --org=my-team
```

### Göster

Belirli bir projenin ayrıntılarını görmek için `projects show` kullanın. Eğer bir proje içindeyseniz, yapılandırma dosyasından proje kimliğini alacaktır. Projeyi `--project` veya pozisyonel argüman kullanarak da belirtebilirsiniz:

```shell
deployctl projects show main-site
```

Çıktı:

```
main-site
---------
Organizasyon: my-team (5261e096-f9aa-4b72-8440-1c2b5b553def)
Alan Adları:   https://my-team.com
                https://main-site.deno.dev
Dash URL:      https://dash.deno.com/projects/8422c515-f68f-49b2-89f3-157f4b144611
Depo:         https://github.com/my-team/main-site
Veritabanları:  [ana] dd28e63e-f495-416b-909a-183380e3a232
                [*] e061c76e-4445-409a-bc36-a1a9040c83b3
Cronlar:       başka bir cron [*/10 * * * *] 12/3/2024 14:40:00 CET'de 2 saniye sonra başarılı oldu (sonraki 12/3/2024 14:50:00 CET'de)
                en yeni cron [*/10 * * * *] n/a
                bir başka cron [*/10 * * * *] 12/3/2024 14:40:00 CET'de 2 saniye sonra başarısız oldu (sonraki 12/3/2024 14:50:00 CET'de)
Dağıtımlar:   kcbxc4xwe4mc    c0ph5xa9exb3*    kwkbev9er4h2    dxseq0jc8402    7xr5thz8yjbz
                4qr4h5ac3rfn    25wryhcqmb9q    64tbrn8jre9n    hgqgccnmzg04    rxkh1w3g74e8
                wx6cw9aya64c    a1qh5fmew2yf    w6pf4r0rrdkb    nn700gexgdzq    98crfqxa6vvf
                xcdcs014yc5p    btw43kx89ws1    62tg1ketkjx7    07ag6pt6kjex    4msyne1rvwj1
```

### Yeniden Adlandır

Projeleri `rename` alt komutu ile kolayca yeniden adlandırabilirsiniz. Diğer komutlarda olduğu gibi, eğer komutu bir projenin dizininde çalıştırıyorsanız, mevcut proje adını belirtmenize gerek yoktur:

```shell
deployctl projects rename my-personal-blog
```

Çıktı:

```
ℹ Yapılandırma dosyası '/private/tmp/blog/deno.json' kullanılıyor
✔ 'blog' (8422c515-f68f-49b2-89f3-157f4b144611) projesi bulundu
✔ 'blog' projesi 'my-personal-blog' olarak yeniden adlandırıldı
```

:::note
Proje adının önizleme alan adlarının (https://my-personal-blog-kcbxc4xwe4mc.deno.dev) ve varsayılan üretim alan adının (https://my-personal-blog.deno.dev) bir parçası olduğunu unutmayın. Bu nedenle, proje adını değiştirdiğinizde, önceki adla olan URL'ler projeye ait dağıtımlara yönlendirme yapmamaya başlayacaktır.
:::

### Oluştur

Boş bir proje oluşturmak için:

```shell
deployctl projects create my-new-project
```

### Sil

Bir projeyi silmek için:

```shell
deployctl projects delete my-new-project
```

---
description: Bu sayfa, `deployctl top` komutunu kullanarak projedeki kaynak kullanımının gerçek zamanlı izlenmesi hakkında bilgiler sunar. Ayrıca, günlüklerin alınması, API kullanımı, yerel geliştirme ve JSON çıktısı gibi konuları kapsamaktadır.
keywords: [deployctl, kaynak kullanımı, günlükler, API, yerel geliştirme, JSON, deno]
---

## Üst

`top` alt komutu, bir projedeki kaynak kullanımını gerçek zamanlı olarak izlemek için kullanılmaktadır:

```shell
deployctl top
```

Çıktı:

```
┌────────┬────────────────┬────────────────────────┬─────────┬───────┬─────────┬──────────┬─────────────┬────────────┬─────────┬─────────┬───────────┬───────────┐
│ (idx)  │ dağıtım        │ bölge                 │ İstek/dk │ CPU%  │ CPU/istek │ RSS/5dk │ Geliş/dk    │ Çıkış/dk   │ KVr/dk │ KVw/dk │ QSenq/dk  │ QSdeq/dk  │
├────────┼────────────────┼────────────────────────┼─────────┼───────┼─────────┼──────────┼─────────────┼────────────┼─────────┼─────────┼───────────┼───────────┤
│ 6b80e8 │ "kcbxc4xwe4mc" │ "asya-kuzeydoğu1"      │      80 │ 0.61  │ 4.56    │ 165.908  │ 11.657      │ 490.847    │       0 │       0 │         0 │         0 │
│ 08312f │ "kcbxc4xwe4mc" │ "asya-kuzeydoğu1"      │      76 │ 3.49  │ 27.58   │ 186.278  │ 19.041      │ 3195.288   │       0 │       0 │         0 │         0 │
│ 77c10b │ "kcbxc4xwe4mc" │ "asya-güney1"          │      28 │ 0.13  │ 2.86    │ 166.806  │ 7.354       │ 111.478    │       0 │       0 │         0 │         0 │
│ 15e356 │ "kcbxc4xwe4mc" │ "asya-güney1"          │      66 │ 0.97  │ 8.93    │ 162.288  │ 17.56       │ 4538.371   │       0 │       0 │         0 │         0 │
│ a06817 │ "kcbxc4xwe4mc" │ "asya-güneydoğu1"      │     126 │ 0.44  │ 2.11    │ 140.087  │ 16.504      │ 968.794    │       0 │       0 │         0 │         0 │
│ d012b6 │ "kcbxc4xwe4mc" │ "asya-güneydoğu1"      │     119 │ 2.32  │ 11.72   │ 193.704  │ 23.44       │ 8359.829   │       0 │       0 │         0 │         0 │
│ 7d9a3d │ "kcbxc4xwe4mc" │ "avustralya-güneydoğu1" │       8 │ 0.97  │ 75      │ 158.872  │ 10.538      │ 3.027      │       0 │       0 │         0 │         0 │
│ 3c21be │ "kcbxc4xwe4mc" │ "avustralya-güneydoğu1" │       1 │ 0.04  │ 90      │ 105.292  │ 0.08        │ 1.642      │       0 │       0 │         0 │         0 │
│ b75dc7 │ "kcbxc4xwe4mc" │ "avrupa-batı2"         │     461 │ 5.43  │ 7.08    │ 200.573  │ 63.842      │ 9832.936   │       0 │       0 │         0 │         0 │
│ 33607e │ "kcbxc4xwe4mc" │ "avrupa-batı2"         │      35 │ 0.21  │ 3.69    │ 141.98   │ 9.438       │ 275.788    │       0 │       0 │         0 │         0 │
│ 9be3d2 │ "kcbxc4xwe4mc" │ "avrupa-batı2"         │     132 │ 0.92  │ 4.19    │ 180.654  │ 15.959      │ 820.513    │       0 │       0 │         0 │         0 │
│ 33a859 │ "kcbxc4xwe4mc" │ "avrupa-batı3"         │    1335 │ 7.57  │ 3.4     │ 172.032  │ 178.064     │ 10967.918  │       0 │       0 │         0 │         0 │
│ 3f54ce │ "kcbxc4xwe4mc" │ "avrupa-batı4"         │     683 │ 4.76  │ 4.19    │ 187.802  │ 74.696      │ 7565.017   │       0 │       0 │         0 │         0 │
│ cf881c │ "kcbxc4xwe4mc" │ "avrupa-batı4"         │     743 │ 3.95  │ 3.19    │ 177.213  │ 86.974      │ 6087.454   │       0 │       0 │         0 │         0 │
│ b4565b │ "kcbxc4xwe4mc" │ "me-batı1"             │       3 │ 0.21  │ 55      │ 155.46   │ 2.181       │ 0.622      │       0 │       0 │         0 │         0 │
│ b97970 │ "kcbxc4xwe4mc" │ "güneyamerika-doğu1"   │       3 │ 0.08  │ 25      │ 186.049  │ 1.938       │ 0.555      │       0 │       0 │         0 │         0 │
│ fd7a08 │ "kcbxc4xwe4mc" │ "us-doğu4"             │       3 │ 0.32  │ 80      │ 201.101  │ 0.975       │ 58.495     │       0 │       0 │         0 │         0 │
│ 95d68a │ "kcbxc4xwe4mc" │ "us-doğu4"             │     133 │ 1.05  │ 4.77    │ 166.052  │ 28.107      │ 651.737    │       0 │       0 │         0 │         0 │
│ c473e7 │ "kcbxc4xwe4mc" │ "us-doğu4"             │       0 │ 0     │ 0       │ 174.154  │ 0.021       │ 0          │       0 │       0 │         0 │         0 │
│ ebabfb │ "kcbxc4xwe4mc" │ "us-doğu4"             │      19 │ 0.15  │ 4.78    │ 115.732  │ 7.764       │ 67.054     │       0 │       0 │         0 │         0 │
│ eac700 │ "kcbxc4xwe4mc" │ "us-güney1"            │     114 │ 2.37  │ 12.54   │ 183.001  │ 18.401      │ 22417.397  │       0 │       0 │         0 │         0 │
│ cd2194 │ "kcbxc4xwe4mc" │ "us-güney1"            │      35 │ 0.33  │ 5.68    │ 145.871  │ 8.142       │ 91.236     │       0 │       0 │         0 │         0 │
│ 140fec │ "kcbxc4xwe4mc" │ "us-batı2"             │     110 │ 1.43  │ 7.84    │ 115.298  │ 18.093      │ 977.993    │       0 │       0 │         0 │         0 │
│ 51689f │ "kcbxc4xwe4mc" │ "us-batı2"             │    1105 │ 7.66  │ 4.16    │ 187.277  │ 154.876     │ 14648.383  │       0 │       0 │         0 │         0 │
│ c5806e │ "kcbxc4xwe4mc" │ "us-batı2"             │     620 │ 4.38  │ 4.24    │ 192.291  │ 109.086     │ 9685.688   │       0 │       0 │         0 │         0 │
└────────┴────────────────┴────────────────────────┴─────────┴───────┴─────────┴──────────┴─────────────┴────────────┴─────────┴─────────┴───────────┴───────────┘
⠼ Yayın yapılıyor...
```

:::tip
Sütunların doğru bir şekilde anlaşılması, çıktıyı daha etkili bir şekilde yorumlamanıza yardımcı olabilir.
:::

Sütunlar şu şekilde tanımlanmıştır:

| Sütun      | Açıklama                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| idx         | Örnek ayrıştırıcısı. Aynı bölgede çalışan farklı yürütmeleri ayırt etmek için opak kimlik.       |
| dağıtım     | Yürütme örneğinde çalışan dağıtımın kimliği.                                                    |
| İstek/dk    | Projeye gelen dakika başına istek.                                                              |
| CPU%        | Proje tarafından kullanılan CPU yüzdesi.                                                         |
| CPU/istek   | İstek başına CPU süresi, milisaniye cinsinden.                                                  |
| RSS/5dk     | Proje tarafından son 5 dakikada kullanılan maksimum RSS, MB cinsinden.                          |
| Geliş/dk    | Proje tarafından dakikada alınan veri, KB cinsinden.                                            |
| Çıkış/dk    | Proje tarafından dakikada üretilen veri, KB cinsinden.                                          |
| KVr/dk      | Proje tarafından dakikada gerçekleştirilen KV okumaları.                                         |
| KVw/dk      | Proje tarafından dakikada gerçekleştirilen KV yazımları.                                        |
| QSenq/dk    | Proje tarafından dakikada gerçekleştirilen kuyruk eklemeleri.                                   |
| QSdeq/dk    | Proje tarafından dakikada gerçekleştirilen kuyruk çıkarma işlemleri.                             |

`--region` seçenekleri ile bölgeye göre filtreleme yapabilirsiniz; bu seçenek birçok kez kullanılabilir:

```shell
deployctl top --region=asia --region=southamerica
```

## Günlükler

Dağıtımlarınızın günlüklerini `deployctl logs` komutuyla alabilirsiniz. Hem günlüklerin oluşturuldukça konsola akıtıldığı canlı günlükleri hem de geçmişte üretilen günlükleri sorgulamak için kullanılabilir.

:::info
Bir projenin mevcut üretim dağıtımının canlı günlüklerini göstermek için şu komutu kullanabilirsiniz:
:::

```shell
deployctl logs
```

:::note
Deno Deploy web uygulamasında olduğu gibi, şu anda günlük alt komutunun dağıtım değiştiğinde otomatik olarak yeni üretim dağıtımına geçiş yapmadığını unutmayın.
:::

Belirli bir dağıtımın canlı günlüklerini göstermek için:

```shell
deployctl logs --deployment=1234567890ab
```

Günlükler seviyeye, bölgeye ve metne göre `--levels`, `--regions` ve `--grep` seçeneklerini kullanarak filtrelenebilir:

```shell
deployctl logs --levels=error,info --regions=region1,region2 --grep='unexpected'
```

Kalıcı günlükleri göstermek için, `--since` ve/veya `--until` seçeneklerini kullanın:


Örnekler için tıklayın


  

```sh
deployctl logs --since=$(date -Iseconds -v-2H) --until=$(date -Iseconds -v-30M)
```




```sh
deployctl logs --since=$(date -Iseconds --date='2 hours ago') --until=$(date -Iseconds --date='30 minutes ago')
```





## API

`alt alan API'sini` kullanıyorsanız, `deployctl api` API ile etkileşim kurmanıza yardımcı olarak kimlik doğrulamasını ve başlıkları sizin için yönetir:

```shell
deployctl api /projects/my-personal-blog/deployments
```

HTTP metodunu ve istek gövdesini belirtmek için `--method` ve `--body` seçeneklerini kullanın:

```shell
deployctl api --method=POST --body='{"name": "main-site"}' organizations/5261e096-f9aa-4b72-8440-1c2b5b553def/projects
```

## Yerel Geliştirme

Yerel geliştirme için `deno` CLI'sini kullanabilirsiniz. `deno`'yu kurmak için [Deno kılavuzundaki](https://deno.land/manual/getting_started/installation) talimatları izleyin.

Kurulumdan sonra, betiklerinizi yerel olarak çalıştırabilirsiniz:

```shell
$ deno run --allow-net=:8000 ./main.ts
Listening on http://localhost:8000
```

Dosya değişikliklerini izlemek için `--watch` bayrağını ekleyin:

```shell
$ deno run --allow-net=:8000 --watch ./main.ts
Listening on http://localhost:8000
```

Deno CLI'si hakkında daha fazla bilgi için, geliştirme ortamınızı ve IDE'nizi nasıl yapılandıracağınızla ilgili Deno Kılavuzu'nun [Başlarken][manual-gs] bölümüne göz atın.

[manual-gs]: https://deno.land/manual/getting_started

## JSON çıktısı

Veri üreten tüm komutların, veriyi JSON nesneleri halinde çıktı olarak veren `--format=json` seçeneği bulunmaktadır. Bu çıktı modu, standart çıkış bir TTY olmadığında, özellikle başka bir komutla yönlendirildiğinde varsayılan hale gelir. `jq` ile birlikte kullanıldığında, bu mod `deployctl` tarafından sağlanan tüm verilerin programatik olarak kullanılmasını sağlar:

Mevcut üretim dağıtımının kimliğini alın:

```shell
deployctl deployments show | jq .build.deploymentId
```

Her bölgedeki her izolasyonun istek başına CPU süresinin bir CSV akışını alın:

```shell
deployctl top | jq -r '[.id,.region,.cpuTimePerRequest] | @csv'