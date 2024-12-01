---
title: Veri Transferi
description: Bu belge, Strapi uygulamalarında veritabanının nasıl sıfırlanıp tohumlanacağına dair bilgi sağlar. Ayrıca, DTS özelliğinin ne olduğunu ve nasıl kullanıldığını açıklar.
keywords: [veri transferi, Strapi, veritabanı, DTS, test]
---

## Genel Bakış

Bu belge, veritabanını sıfırlamak ve tohumlamak için `@strapi/data-transfer` kullanmamızın nasıl ve nedenini açıklar. Bu, `@strapi/data-transfer`'ın nasıl kullanılacağına dair kapsamlı bir açıklama değildir. Özelliği hakkında daha fazla bilgi edinmek için [Strapi belgeleri](https://docs.strapi.io/developer-docs/latest/developer-resources/data-management.html) sayfasına bakın.

### Neden Veri Transferi Kullanmalıyız?

Uygulamanın özel API uç noktalarını kullanabiliriz ve bu kötü bir çözüm değil, ancak şema girdileri için verileri ayarlamak için _muhtemelen_ biraz kod yazmayı gerektirecektir. Ancak, `4.6.0` sürümünde Strapi, `DTS` (DTS – Veri Transfer Sistemi) özelliğini yayınladı. Bu, Strapi'nin herhangi bir üyesinin kendi örneğinin verilerini dışa aktarabileceği ve bunu bir `.tar` dosyası olarak üretebileceği anlamına geliyor; bu dosyayı daha sonra programatik olarak içe aktararak veritabanını o zamana geri yükleyebilir ve "saf" bir test ortamı sağlayabiliriz.

### Veri Transferinin Sınırlamaları

Veri transferinin ana sınırlaması, verilerin versiyonunu oluşturamamamız veya değişikliklerini gözden geçiremiyor olmamızdır. :::warning
Veri setinde değişiklik yapmak dikkatle yapılmalıdır, çünkü veritabanında bilinmeyen değişikliklerle veri dışa aktarmak ve bu durumun diğer testleri etkileyebilmesi oldukça kolaydır.
:::

## Testler için Veriyi Güncelleme

Her test izole edilmeli ve başka bir teste bağımlı olmamalıdır. Bir testten yapılan veri değişiklikleri başka bir teste sızmamalıdır. Örneğin, bir test durumunda bir içerik türü için yeni bir girdi oluşturursanız, bu sonraki test durumunda mevcut olmamalıdır. Bu, testlerin daha stabil olmasını ve hata ayıklamayı kolaylaştırır.

### Veri transfer motoru

Strapi CLI, `@strapi/data-transfer`'ı doğrudan kullanacağı için, varsayılan olarak yönetici kullanıcıları, API token'ları veya hariç tutma listesindeki diğer herhangi bir özelliği dışa veya içe aktarmayacaktır.

:::info
Lütfen Strapi test örneğinde içe aktarma veya dışa aktarma komutunu kullanmayın. Test durumlarımız için özel olarak oluşturulmuş bir DTS motoru bulunmaktadır. Bu, testlerimiz için neyin dahil edilmesi gerektiğini yeniden tanımlamamıza olanak tanır. 
:::

Betikler, `tests/e2e/scripts/dts-import.ts` ve `tests/e2e/scripts/dts-export.ts` içinde bulunabilir.

### Varolan bir veri paketini içe aktarma

Yeni bir test için veri paketini güncellemeniz gerektiğinde, öncelikle sonuca dayalı testlerde şu anda kullanılan verilerle bir Strapi uygulamasına ihtiyacınız olacaktır.

`yarn test:e2e` komutunu çalıştırdığınızda, test uygulama örnekleri `test-apps/e2e/test-app-{n}` dizininde oluşturulur. Verileri güncellemek için bu uygulamalardan birini kullanabilirsiniz.

Test uygulamalarından birine gidin ve `yarn install && yarn develop` komutunu çalıştırın.

Geliştirme sunucusunu açık bırakın ve ardından veritabanını mevcut e2e veri paketi ile sıfırlayıp tohumlamak için aşağıdaki komutu çalıştırın. Betik, `tests/e2e/data` içinde bulanan içe aktarmak istediğiniz veri paketinin adını beklemektedir.

```shell
STRAPI_LICENSE=<lisans-ee-özelliği-ile> npx ts-node <SCRIPT_YOLU>/dts-import.ts with-admin.tar
```

Bu betik, yönetici kullanıcılarını ve `tests/e2e/constants.ts` içinde belirtilen tüm içerik türlerini içerecektir.

Test uygulaması kimlik bilgileri ile giriş yapabilmelisiniz.

| E-posta           | Şifre        |
| ----------------- | ------------ |
| test@testing.com  | Testing123!  |

Artık her e2e'nin başladığı aynı verilerle bir Strapi örneğiniz olduğuna göre, yeni bir veri dışa aktarıma hazırlık amacıyla CMS'deki verileri değiştirebilirsiniz.

:::note
İçerik şemalarından herhangi birini değiştirirseniz (yeni eklemeler dahil) lütfen `app-template'i` güncellemeyi unutmayın, aksi takdirde DTS, var olmayan şemalar için verileri içe aktaramayacaktır.
:::

### Güncellenmiş bir veri paketini dışa aktarma

Test örneğinden yeni verinizi oluşturduğunuzda, bunu dışa aktarmanız gerekecek, böylece bu veriyi sonuca dayalı testlerde kullanabilirsiniz.

`tests/e2e/constants.js` içinde bulunan `ALLOWED_CONTENT_TYPES` dizisine dışa aktarmak istediğiniz içerik türlerini dahil ettiğinizden emin olun.

Betik, yedekleme hedef dosya adını bir argüman olarak kabul eder. Daha önce oluşturduğunuz test-app şablonuna dayalı Strapi örneğinizin dizininden çalıştırın.

```shell
npx ts-node <SCRIPT_YOLU>/dts-export.ts güncellenmiş-veri-paketi
```

EE özelliği için veri dışa aktarıyorsanız, betiği `STRAPI_LICENSE` ortam değişkeni ile çalıştırmanız gerekir.

```shell
STRAPI_LICENSE=<lisans-ee-özelliği-ile> npx ts-node <SCRIPT_YOLU>/dts-export.ts güncellenmiş-veri-paketi
```

Betiğiniz `güncellenmiş-veri-paketi.tar` adlı bir dosya oluşturacaktır. Bu dosyayı `tests/e2e/data` dizinine kopyalayabilirsiniz, böylece uygun testlerde kullanılabilir.

### Test senaryolarında veri paketini içe aktarma

Testler sırasında verileri programatik olarak içe aktarmak için `resetDatabaseAndImportDataFromPath` adlı bir soyutlama bulunmaktadır; bu veri `tests/e2e/utils/dts-import.ts` içinde bulunabilir. Genellikle, bunu her testten **önce** çalıştırmak isteyeceksiniz:

```ts
import { test } from '@playwright/test';
import { resetDatabaseAndImportDataFromPath } from './utils/dts-import';

test.describe('Strapi Uygulaması', () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabaseAndImportDataFromPath('yedek.tar');
    await page.goto('/admin');
  });

  test('bir kullanıcı ... yapabilmeli', async ({ page }) => {
    // benim testim
  });
});
``` 