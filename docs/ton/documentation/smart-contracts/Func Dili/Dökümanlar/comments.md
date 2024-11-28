# Yorumlar

FunC, `;;` (çift `;`) ile başlayan tek satırlık yorumlara sahiptir. Örneğin:

```func
int x = 1; ;; x'e 1 ata
```

:::tip
**İpucu:** Tek satırlık yorumlar, kod üzerinde açıklama yapmak için oldukça kullanışlıdır.
:::

Ayrıca, `{-` ile başlayan ve `-}` ile biten çok satırlı yorumlar da vardır. Birçok başka dilden farklı olarak, FunC çok satırlı yorumları iç içe geçirebilir. Örneğin:

```func
{- Bu bir çok satırlı yorumdur
    {- bu yorumun içindeki bir yorumdur -}
-}
```

:::info
**Ek Bilgi:** İç içe çok satırlı yorumlar, karmaşık açıklamaları yönetmek için etkilidir.
:::

Ayrıca, çok satırlı yorumlar içinde tek satırlık yorumlar olabilir ve tek satırlık yorumlar `;;`, çok satırlı yorumlardan `{- -}` "daha güçlüdür". Başka bir deyişle, aşağıdaki örnekte:

```func
{-
  Yorumun başlangıcı

;; bu yorumun sonu kendisi yorumlanmıştır -> -}

const a = 10;
;; bu yorumun başlangıcı kendisi yorumlanmıştır -> {-

  Yorumun sonu
-}
```

:::warning
**Dikkat:** Yorumlarınızı yönetirken iç içe yorumların karmaşık hale gelebileceğini unutmayın.
:::

`const a = 10;` çok satırlı yorumun içindedir ve yorum dışı bırakılmıştır.