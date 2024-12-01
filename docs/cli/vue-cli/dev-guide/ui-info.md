---
description: Eklentinizi UI'de daha keşfedilebilir hale getirmek için önemli bilgiler ve pratik öneriler. Logo, keşfedilebilirlik ve örnek yapılandırmalar hakkında detaylar.
keywords: [UI, eklenti, keşfedilebilirlik, logo, package.json, npm, Apollo]
---

# UI Eklenti Bilgisi

UI'de kullanıldığında, eklentinizin daha keşfedilebilir ve tanınabilir olmasını sağlamak için ek bilgiler gösterebilir.

## Logo

`logo.png` dosyasını npm üzerinde yayımlanacak olan dosya dizininin kök dizinine koyabilirsiniz. Bu, çeşitli yerlerde görüntülenecektir:

- Eklenti kurmak için arama yaparken
- Yüklenen eklenti listesinde

![Plugins](../../images/cikti/vue-cli/public/plugins.png)

Logo, kare ve saydam olmayan bir görüntü olmalıdır (ideali **84x84**).

## Keşfedilebilirlik

Kullanıcı eklentiniz için arama yaptığında daha iyi keşfedilebilirlik sağlamak için, eklentinizin `package.json` dosyasındaki `description` alanına eklentinizle ilgili anahtar kelimeler koyun.

:::tip
**İpucu:** Aşağıdaki gibi bir yapılandırma ile açıklayıcı ve anahtar kelimelere odaklanmış bir `description` oluşturabilirsiniz.
:::

Örnek:

```json
{
  "name": "vue-cli-plugin-apollo",
  "version": "0.7.7",
  "description": "vue-cli plugin to add Apollo and GraphQL"
}
```

Eklenti web sitesi veya havuzunun URL'sini `homepage` veya `repository` alanına eklemelisiniz, böylece eklenti tanımınızda 'Daha fazla bilgi' butonu görüntülenecektir:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Akryum/vue-cli-plugin-apollo.git"
  },
  "homepage": "https://github.com/Akryum/vue-cli-plugin-apollo#readme"
}
```

:::info
Eklentinizin `package.json` dosyasındaki bu alanlar, kullanıcılarınızın eklentinizle ilgili daha fazla bilgi almasını sağlar.
:::

![Plugin search item](../../images/cikti/vue-cli/public/plugin-search-item.png)