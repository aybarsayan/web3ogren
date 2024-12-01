---
description: VS Code kullanarak hata ayıklama sürecinizi geliştirin. Bu kılavuz, _tsx_ ile yapılandırmayı ve çeşitli hata ayıklama yöntemlerini açıklar.
keywords: [VS Code, hata ayıklama, tsx, nodejs, geliştirici, yazılım, yapılandırma]
---

# VS Code hata ayıklama

Eğer [VS Code](https://code.visualstudio.com) kullanıyorsanız, hata ayıklama deneyiminizi geliştirmek için _tsx_'yi kullanacak şekilde yapılandırabilirsiniz.

VS Code yapılandırması hakkında daha fazla bilgi için [_Başlatma Yapılandırması_](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration) dokümantasyonuna bakın.

## Kurulum

1. **Konfigürasyon dosyasını oluşturun**

   Projenizde `.vscode/launch.json` konumunda bir başlatma yapılandırma dosyası oluşturun:
   ```json5
   {
       "version": "0.2.0",
       "configurations": [
           /*
            * Bu dizideki her konfigürasyon, hata ayıklama açılır menüsündeki bir seçeneğe karşılık gelir
            */
       ],
   }
   ```

2. **Hata ayıklama yöntemlerini seçin ve belirleyin**

::: details Yöntem 1: VSCode'un içinden _tsx_'yi çalıştırma

1. `.vscode/launch.json` dosyasındaki `configurations` dizisine aşağıdaki yapılandırmayı ekleyin:
   ```json5
   {
       "name": "tsx",
       "type": "node",
       "request": "launch",

       // VSCode'da geçerli dosyayı hata ayıklama
       "program": "${file}",

       /*
        * tsx ikili dosyasının yolu
        * Yerel olarak yüklü varsayılarak
        */
       "runtimeExecutable": "tsx",

       /*
        * Hata ayıklama başladığında terminali aç (İsteğe Bağlı)
        * console.logs'u görmek için faydalıdır
        */
       "console": "integratedTerminal",
       "internalConsoleOptions": "neverOpen",

       // Hata ayıklayıcıdan hariç tutulan dosyalar (örn. çağrı yığını)
       "skipFiles": [
           // Node.js iç çekirdek modülleri
           "<node_internals>/**",

           // Tüm bağımlılıkları yok say (isteğe bağlı)
           "${workspaceFolder}/node_modules/**",
       ],
   }
   ```

2. **VSCode'da çalıştırmak istediğiniz JS/TS dosyasını açın.**

3. **VSCode'un hata ayıklama paneline gidin**, açılır menüden "tsx"yı seçin ve oynat düğmesine basın (F5).

:::

::: details Yöntem 2: Çalışan bir Node.js sürecine VS Code hata ayıklayıcısını ekleyin

> Bu yöntem, _tsx_ gibi herhangi bir Node.js süreci için çalışır ve _tsx_ ile sınırlı değildir.

1. `.vscode/launch.json` dosyasındaki `configurations` dizisine aşağıdaki yapılandırmayı ekleyin:
   ```json
   {
       "name": "Sürece bağlan",
       "type": "node",
       "request": "attach",
       "port": 9229,
       "skipFiles": [
           // Node.js iç çekirdek modülleri
           "<node_internals>/**",

           // Tüm bağımlılıkları yok say (isteğe bağlı)
           "${workspaceFolder}/node_modules/**",
       ],
   }
   ```

2. **Bir terminal penceresinde _tsx_'yi [`--inspect-brk`](https://nodejs.org/api/cli.html#--inspect-brkhostport) ile çalıştırın:**

   ```sh
   tsx --inspect-brk ./your-file.ts 
   ```

3. **VSCode'un hata ayıklama paneline gidin**, açılır menüden "Sürece bağlan" seçeneğini seçin ve oynat düğmesine basın (F5).
:::