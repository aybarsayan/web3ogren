---
title: RBAC
description: RBAC'nin içerik yöneticisindeki belgelerle nasıl çalıştığını ve kullanıcı izinlerini nasıl yönettiğini keşfedin. Bu makalede, izin nesneleri ve DocumentRBAC bileşeninin sağladığı işlevler hakkında bilgi bulacaksınız.
keywords: [RBAC, içerik yöneticisi, izinler, DocumentRBAC, kullanıcı izinleri]
---

:::note
Bu, strapi içerisindeki izinlerin detaylı bir analizi değildir, eğer arayışınız buysa `İzinler Girişi` sayfasına bakmalısınız.
:::

Her belgenin **izin nesnesi**, `properties.fields` içeren bir dizi dize barındırır. Bu dizi, izin konusuna göre hangi özelliklerin oluşturulabileceğini veya güncellenebileceğini anlamamıza yardımcı olabilir.

> **Önemli Not**: Aşağıdaki örnek, bir izin nesnesinin yapısını göstermektedir. 
> — Örnek, kullanıcı izinlerini anlamak için kritik öneme sahiptir.

```json
// Bir örnek izin nesnesi
{
  "id": 666,
  "action": "plugin::content-manager.explorer.create",
  "actionParameters": {},
  "subject": "api::article.article",
  "properties": {
    "fields": ["short_text", "blocks", "single_compo.name", "single_compo.test", "dynamiczone"]
  },
  "conditions": []
}
```

Yukarıdaki izinler, kullanıcının makale içerik türünde hangi alanları oluşturabileceği ile ilgilidir. Alanların listesi, **şemadaki isimleridir**, etiketleri değildir. (etiketler EditViewSettings'te geçersiz kılınabilir). Bileşenler nokta ile ayrılmış yollar olup, bileşen adı bu yolun ilk parçasını oluşturur. Tekrarlanabilir bileşenler **yolda** indekslere sahip olmayacak ve son olarak dinamik bölgelerde tüm alanlar her zaman izinlidir.

---

## DocumentRBAC Bileşeni

`DocumentRBAC` bileşeni, ListView & EditView sayfalarını sararak aşağıdaki işlevleri sunar:

- Bir kullanıcının bir belgeyi `oluşturma / okuma / güncelleme / silme / yayınlama` işlemlerini yapıp yapamayacağını kontrol eder.
- Her işlem için alanların listesini sağlar.
- Bir kullanıcının `işlem yapıp yapamayacağını` kontrol eden bir yardımcı işlevi sunar.

```ts
interface DocumentRBACContextValue {
  canCreate?: boolean;
  canCreateFields: string[];
  canDelete?: boolean;
  canPublish?: boolean;
  canRead?: boolean;
  canReadFields: string[];
  canUpdate?: boolean;
  canUpdateFields: string[];
  canUserAction: (
    fieldName: string,
    fieldsUserCanAction: string[],
    fieldType: Attribute.Kind
  ) => boolean;
  isLoading: boolean;
}
```

:::note
`useRBAC` kancası, izinlerin `koşulları` ile karşılaştırmak için API'den veri çektiğinden, bir bileşenin buna karşı beklemesi gerekiyorsa, isteğe bağlı olarak `isLoading` döndürülmektedir.
:::

Tüm bu bilgileri kullanarak, uygulamadaki alanları kullanıcının izinlerine göre devre dışı bırakabilir ve gizleyebiliriz.