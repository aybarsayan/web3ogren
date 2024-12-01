---
title: İnceleme İş Akışları
description: Bu döküman, İnceleme İş Akışı özelliğinin arka uç tasarımını ve tanımlarını ele almaktadır. Strapi projelerinde iş akışlarını yönetmek için gerekli olan teknik bilgileri sağlamaktadır.
keywords: [Strapi, iş akışı, teknik tasarım, içerik yönetimi, kurumsal sürüm]
---

# İnceleme İş Akışları

## Özeti

İnceleme iş akışı özelliği sadece Kurumsal Sürümlerde mevcuttur. Bu nedenle, kısmen, Topluluk Sürümünün kodundan tamamen ayrılmıştır.

:::info
Bu özelliğin amacı, kullanıcıların Strapi projelerinin çeşitli varlıklarına bir etiket atamasını sağlamaktır. Bu etiket "aşama" olarak adlandırılır ve bir iş akışında kullanılabilir.
:::

## Ayrıntılı arka uç tasarımı

İnceleme İş Akışı özelliği, Topluluk Sürümünden ayrılması gerektiği düşüncesiyle inşa edilmiştir. Bu nedenle, uygulama, bir eklentinin nasıl inşa edileceğiyle ilgili birçok ilişkiye sahiptir.

İnceleme İş Akışı ile ilgili tüm arka uç kodu `packages/core/admin/ee` içinde bulunabilir. Bu kod birkaç unsurdan oluşmaktadır:

- **İçerik türleri**
  - _strapi_workflows_: `packages/core/admin/ee/server/content-types/workflow/index.js`
  - _strapi_workflows_stages_: `packages/core/admin/ee/server/content-types/workflow-stage/index.js`
- **Denetleyiciler**
  - _workflows_: `packages/core/admin/ee/server/controllers/workflows/index.js`
  - _stages_: `packages/core/admin/ee/server/controllers/workflows/stages/index.js`
  - _assignees_: `packages/core/admin/ee/server/controllers/workflows/assignees/index.js`
- **Ara katmanlar**
  - 
    _KALDIRILMIŞ_ contentTypeMiddleware
    
    Nesnenin kök düzeyinde içerik türü için seçenekleri düzgün bir şekilde yönetmek amacıyla, `reviewWorkflows` seçeneğinin içerik türü verisi içindeki `options` nesnesine yerleştirilmesi gereklidir. Bunu yaparak, tüm seçeneklerin düzenli bir şekilde organize edilmesini ve kendi veri yapılarında kolayca erişilebilir olmasını sağlarız.
    
    :::warning
    Bu, aynı zamanda, geliştiricilerin sistemle çalışırken seçenekleri gerektiği gibi korumayı ve güncellemeyi kolaylaştırır.
    :::
    
    
- **Yollar**
  - `packages/core/admin/ee/server/routes/index.js`
- **Servisler**
  - _review-workflows_: `packages/core/admin/ee/server/services/review-workflows/review-workflows.js`
  - _workflows_: `packages/core/admin/ee/server/services/review-workflows/workflows.js`
  - _stages_: `packages/core/admin/ee/server/services/review-workflows/stages.js`
  - _metrics_: `packages/core/admin/ee/server/services/review-workflows/metrics.js`
  - _weekly-metrics_: `packages/core/admin/ee/server/services/review-workflows/weekly-metrics.js`
  - _validation_: `packages/core/admin/ee/server/services/review-workflows/validation.js`
  - _assignees_: `packages/core/admin/ee/server/services/review-workflows/assignees.js`
  - _stage-permissions_: `packages/core/admin/ee/server/services/review-workflows/stage-permissions.js`
- **Kullanım dosyası**
  - _İnceleme iş akışları yardımcı programları_: `packages/core/admin/ee/server/utils/review-workflows.js`
- **Bir başlatma ve bir kayıt bölümü**
  - `packages/core/admin/ee/server/bootstrap.js`
  - `packages/core/admin/ee/server/register.js`

### İçerik türleri

#### strapi_workflows

Bu içerik türü, iş akış bilgilerini saklar ve aşamaları ile bunların sıralarını tutan sorumluluğa sahiptir. MVP'de, Strapi veritabanında yalnızca bir iş akışı tutulur.

#### strapi_workflows_stages

Bu içerik türü, aşamanın adını içeren aşama bilgilerini saklar.

### Denetleyiciler

#### workflows

`strapi_workflows` içerik türüyle etkileşimde bulunmak için kullanılır.

#### stages

`strapi_workflows_stages` içerik türüyle etkileşimde bulunmak için kullanılır.

#### assignees

İnceleme iş akışı etkinleştirilmiş içerik türleriyle ilişkili olan `admin_users` içerik türü varlıklarıyla etkileşimde bulunmak için kullanılır.

### Yollar

Kurumsal Sürümün Admin API'si, İnceleme İş Akışı özelliğiyle ilişkili birkaç yolu içermektedir. İşte o yolların bir listesi:

#### GET `/review-workflows/workflows`

Bu yol, tüm iş akışlarının bir listesini döndürür.

#### POST `/review-workflows/workflows`

Bu yol, yeni bir iş akışı oluşturur.

#### GET `/review-workflows/workflows/:id`

Bu yol, id parametresiyle tanımlanan belirli bir iş akışının ayrıntılarını döndürür.

#### PUT `/review-workflows/workflows/:id`

Bu yol, id parametresiyle tanımlanan belirli bir iş akışını günceller.

#### DELETE `/review-workflows/workflows/:id`

Bu yol, id parametresiyle tanımlanan belirli bir iş akışını siler.

#### GET `/review-workflows/workflows/:workflow_id/stages`

Bu yol, workflow_id parametresiyle tanımlanan belirli bir iş akışına ait tüm aşamaların bir listesini döndürür.

#### GET `/review-workflows/workflows/:workflow_id/stages/:id`

Bu yol, id parametresiyle tanımlanan ve workflow_id parametresiyle ilişkili belirli bir aşamanın ayrıntılarını döndürür.

#### PUT `/review-workflows/workflows/:workflow_id/stages`

Bu yol, workflow_id parametresiyle tanımlanan belirli bir iş akışına ait aşamaları günceller. **Güncellenen aşamalar**, istek gövdesinde gönderilir.

### Servisler

Kurumsal Sürümün İnceleme İş Akışı özelliği, iş akışlarını ve aşamaları manipüle etmek için birkaç servis içermektedir. İşte o servislerin bir listesi:

#### review-workflows

Bu servis, Strapi'nin başlatma ve kayıt aşamaları sırasında kullanılır. Temel sorumluluğu, ihtiyaç duyuldukça varlıklar üzerinde veri almak ve varlık şemalarına aşama alanını eklemektir.

#### workflows

Bu servis, iş akış varlıklarını manipüle etmek için kullanılır. **İş akışlarını oluşturma, alma ve güncelleme işlevselliği** sağlar.

#### stages

Bu servis, aşama varlıklarını manipüle etmek ve diğer varlıklar üzerinde aşamaları güncellemek için kullanılır. Aşama oluşturma, alma, güncelleme ve silme işlevselliği sağlar.

#### metrics

Bu, bu özelliğin kullanımına ilişkin bilgi toplamak için kullanılan telemetri servisidir. Oluşturulan iş akışlarının ve aşamaların sayısı ile varlıklardaki aşama güncellemelerinin sıklığı hakkında bilgi sağlar.

#### weekly-metrics

Haftada bir, inceleme iş akışları kullanım istatistiği rapor edilir. Bu servis, aktif iş akışlarının sayısı, bir iş akışındaki ortalama aşama sayısı, tüm iş akışlarındaki maksimum aşama sayısı ve inceleme iş akışlarının etkinleştirildiği içerik türleri hakkında istatistikleri toplamak ve göndermekle sorumlu olan cron görevini ayarlamak için kullanılır.

#### assignees

Bu servis, inceleme iş akışı etkinleştirilmiş içerik türleri üzerindeki admin kullanıcı atanan kişi ilişkileriyle etkileşimde bulunmak için kullanılır. Bir varlığın atanan kişinin kimliğini bulma, atanan kişiyi güncelleme ve silme (yani, atama işlemini kaldırma) yeteneğini sağlar.

#### stage-permissions

Bu servis, inceleme iş akışı aşamaları için RBAC işlevselliğini etkinleştirmek için kullanılır. **`strapi_workflows_stages`** listesindeki her bir giriş, `admin_permissions` ile çoktan çoğa bir ilişkiye sahiptir. Bu ilişkideki izinler, hangi rollerin bu aşamadaki bir girişin inceleme aşamasını değiştirebileceğini belirtir.

:::note
Servis, aşama ve rol kimliklerine dayalı olarak yeni aşama izinlerini kaydetme ve kaydını silme yeteneğini sunar ve bir rolün belirli bir aşamadan geçip geçemeyeceğini belirlemenin yollarını sağlar.
:::

#### validation

Bu servis, özelliğin beklendiği gibi çalıştığını sağlamak ve verilerin geçerliliğini doğrulamak için kullanılır.

## Alternatifler

İnceleme İş Akışı özelliği, şu anda Strapi deposunun temel bir özelliği olarak bulunmaktadır. Ancak, gelecekte bunu bir eklentiye taşıma ihtimali üzerine tartışmalar yapılmıştır.

> Bu konuyla ilgili henüz bir karar verilmiş olmasa da, gelecekte bunun olabileceği mümkündür. — Strapi Geliştiricileri

## Kaynaklar

- [Strapi Dökümantasyonu - İnceleme İş Akışları](https://docs.strapi.io/user-docs/settings/review-workflows)
- [Strapi Dökümantasyonu - İçerik Türü Oluşturma](https://docs.strapi.io/user-docs/content-type-builder/creating-new-content-type#creating-a-new-content-type)
- [Strapi Dökümantasyonu - Kullanıcı Rolleri ve İzinleri](https://docs.strapi.io/user-docs/users-roles-permissions/configuring-administrator-roles#plugins-and-settings)
- `İçerik Yöneticisi İnceleme İş Akışları`
- `İçerik Türü Oluşturucu İnceleme İş Akışları`