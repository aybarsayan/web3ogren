---
title: Uygulama Şablonu
description: Bu belge, `e2e/app-template` dizinindeki uygulama şablonunun nasıl güncelleneceğini ve içeriğin detaylarını açıklamaktadır. Test uygulamalarını ve API özelleştirmelerini anlamak için gerekli bilgiler yer almaktadır.
keywords: [uygulama şablonu, test, e2e, API özelleştirmeleri, içerik şemaları]
---

## Genel Bakış

`e2e/app-template` dizininde, testlerin çalışmasını sağlamak için bazı özelleştirmeler ve yardımcı araçlar sunan bir uygulama şablonu oluşturulmuştur. Uygulama şablonunda herhangi bir değişiklik yapıldığında, test uygulamalarını yeni şablonla güncellemek için `yarn test:e2e:clean` komutunu çalıştırmanız gerekecektir.

:::tip
Bir test örneğinin hangi içerik şemalarına sahip olduğu ve oluşturduğumuz API özelleştirmeleri hakkında burada okuyabilirsiniz. 
:::

## Uygulama Şablonunu Güncelleme

Uygulama şablonunu güncellemek için:

- Mevcut şablon bazında bir Strapi uygulaması oluşturmak için testleri çalıştırın: `test-apps/e2e/test-app-`.
- Bu klasöre geçin ve `yarn develop` komutunu çalıştırın.
- `e2e/constants.js` içinde bulunan kimlik bilgilerini kullanarak giriş yapın.
- Gerekli değişiklikleri yapın (yani bir içerik türü oluşturun).
- Mevcut dizindeki içeriği, `e2e/app-template` içindeki şablon ile değiştirin (sadece ihtiyaç duyduğunuz dosyaları saklayın).

## İçerik Şemaları

### Makale

```json
{
  // ...
  "attributes": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "blocks"
    },
    "authors": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::author.author",
      "inversedBy": "articles"
    }
  }
  // ...
}
```

### Yazar

```json
{
  // ...
  "attributes": {
    "name": {
      "type": "string"
    },
    "profile": {
      "allowedTypes": ["images", "files", "videos", "audios"],
      "type": "media",
      "multiple": false
    },
    "articles": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::article.article",
      "mappedBy": "authors"
    }
  }
  // ...
}
```

### Ana Sayfa (Tek Tür)

```json
{
  // ...
  "attributes": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "blocks"
    },
    "admin_user": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "admin::user"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "meta.seo"
    }
  }
  // ...
}
```

### Ürün

Bu koleksiyon türü uluslararasılaştırılmıştır.

```json
{
  // ...
  "attributes": {
    "name": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "string",
      "required": true
    },
    "slug": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "isAvailable": {
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      },
      "type": "boolean",
      "default": true,
      "required": true
    },
    "description": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "blocks"
    },
    "images": {
      "type": "media",
      "multiple": true,
      "required": false,
      "allowedTypes": ["images", "files", "videos", "audios"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "component": "meta.seo"
    },
    "sku": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "integer",
      "unique": true
    },
    "variations": {
      "type": "component",
      "repeatable": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "component": "product.variations"
    }
  }
  // ...
}
```

### Mağaza (Tek Tür)

Bu tek tür uluslararasılaştırılmıştır.

```json
{
  // ...
  "attributes": {
    "title": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "string",
      "required": true
    },
    "content": {
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "type": "dynamiczone",
      "components": [
        "page-blocks.product-carousel",
        "page-blocks.hero-image",
        "page-blocks.content-and-image"
      ],
      "required": true,
      "min": 2
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      },
      "component": "meta.seo"
    }
  }
  // ...
}
```

### Yaklaşan Maç (Tek Tür)

```json
{
  // ...
  "attributes": {
    "title": {
      "type": "string"
    },
    "number_of_upcoming_matches": {
      "type": "integer"
    },
    "next_match": {
      "type": "date"
    }
  }
  // ...
}
```

## API Özelleştirmeleri

### Konfigürasyon

`template/src/api/config` altında bulunur.

#### Oran Sınırı

##### Kullanım

```ts
async function toggleRateLimiting(page, enabled = true) {
  await page.request.fetch('/api/config/ratelimit/enable', {
    method: 'POST',
    data: { value: enabled },
  });
}
```

##### Ne yapar?

Bu uç nokta, oran sınırlama ara katmanını etkinleştirmek veya devre dışı bırakmak için kullanılabilir. Etkinleştirildiğinde, her kullanıcı için giriş istekleri 5 dakikada 5 ile sınırlandırılır.

:::info
Yanlış giriş denemelerini test etmek için oran sınırlamasını devre dışı bıraktığımız durumlar vardır.
:::

#### Yönetici Otomatik Açma

##### Kullanım

```ts
  bootstrap({ strapi }) {
    strapi.service('api::config.config').adminAutoOpenEnable(false);
  },
```

##### Ne yapar?

Bu uç nokta, yönetici otomatik açmayı etkinleştirmek veya devre dışı bırakmak için kullanılabilir.

##### Neden var?

E2E testleri ile yerel olarak çalışmak zorlayıcı olabilir. Otomatik açma true olarak ayarlandığında, E2E testlerini çalıştırdığınızda her seferinde bir tarayıcı penceresi açılır, zira Strapi uygulaması ilk kez başlar. Bu nedenle, test uygulaması örneğinin başlatma aşamasında bunu devre dışı bırakıyoruz.