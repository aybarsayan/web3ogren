---
description: BabelJS ve Typescript için PM2 kaynak haritası desteği hakkında bilgi. Uygulama hatalarını anlamak için kaynak harita dosyalarının nasıl kullanılacağını öğrenin.
keywords: [BabelJS, Typescript, kaynak haritası, PM2, hata ayıklama, JavaScript, uygulama desteği]
---

# Source Map Desteği

Eğer [BabelJS](https://babeljs.io/) veya [Typescript](http://www.typescriptlang.org/) gibi bir Javascript üst kümesi kullanıyorsanız, bir istisna oluştuğunda yığın izinin anlamlı olmadığını fark etmiş olabilirsiniz. Kullanışlı bilgi almak için [kaynak harita dosyaları](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) oluşturmanız gerekir.

:::tip
Kaynak harita dosyaları oluşturmak, hata ayıklama sürecinizi büyük ölçüde kolaylaştırır.
:::

Bu kaynak harita dosyaları oluşturulduktan sonra, PM2 bunları otomatik olarak algılayacak ve hataları incelemenize yardımcı olacaktır.

## Kaynak haritası

1.0.2 versiyonundan itibaren, PM2 javascript kaynak haritalarını desteklemek için bir mekanizma içerir.

**PM2, javascript kaynak harita dosyalarını otomatik olarak algılar** eğer app.js'yi başlatırsanız, app.js.map dosyasının da var olduğunu bekler.

Farklı bir düzeniniz varsa, uygulamanızı başlatarak kaynak haritası desteğini zorlayabilirsiniz:

CLI aracılığıyla:

```bash
pm2 start app.js --source-map-support
```

Ya da JSON dosyası aracılığıyla:

```javascript
module.exports = {
   name: 'babel-app',
   script: 'app.js',
   source_map_support: true
}
```

### İstisnaları inceleyin

İstisnalar uygulamanızın hata kayıt dosyasına kaydedilir.

İstisnaları tespit etmek için günlüklerinizi kontrol etmek istiyorsanız, şunları yazabilirsiniz:

```bash
pm2 logs main
```

Aksi takdirde, [keymetrics.io](https://keymetrics.io/) kullanarak temiz bir listeleme ve [yeni uyarılar](http://docs.keymetrics.io/docs/pages/issues/) için bildirim alabilirsiniz.

### Kaynak haritası desteğini devre dışı bırakma

Eğer PM2'nin javascript kaynak haritalarını otomatik olarak desteklemesini istemiyorsanız, `--disable-source-map-support` seçeneğini kullanabilirsiniz.

:::warning
Kaynak harita desteğini devre dışı bırakmak, hata ayıklama sürecini zorlaştırabilir.
:::

Bu, hem CLI hem de JSON dosyası aracılığıyla desteklenmektedir.