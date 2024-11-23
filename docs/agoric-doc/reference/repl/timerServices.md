```md
---
title: Zamanlayıcı Hizmetleri
---

## chainTimerService

`chainTimerService`, 1 saniye birimi ile blok zamanlarına dayanmaktadır.

Zamanlayıcı hizmeti ile şunları yapabilirsiniz:

- `wake()` çağrılarını programlayın.
- Programlanan `wake()` çağrılarını kaldırın.
- Olayları düzenli aralıklarla programlamak için bir tekrarlayıcı oluşturun.

Test amacıyla, kullanın:

```js
import buildManualTimer from '@agoric/zoe/tools/manualTimer.js';
```

Detaylar için  paketine bakın.