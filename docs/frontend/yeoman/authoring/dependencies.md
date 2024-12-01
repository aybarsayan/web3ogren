---
description: Bu sayfa, Yeoman ile npm, Yarn ve Bower kullanarak harici bağımlılıkları yönetme yöntemlerini açıklamaktadır. Bu araçlar sayesinde projelerinizde bağımlılıkları kolayca kurabilir ve yönetebilirsiniz.
keywords: [Yeoman, npm, Yarn, Bower, bağımlılık yönetimi]
---

# Gereksinimler

Hazırlayıcılarınızı çalıştırdıktan sonra, genellikle [npm](https://www.npmjs.com/) (veya [Yarn](https://yarnpkg.com/)) ve [Bower](http://bower.io/) kullanarak hazırlayıcılarınızın gerektirdiği ek bağımlılıkları kurmak istersiniz. 

:::tip 
Bu bağımlılıklar, projenizin stabilitesi ve performansı için kritik öneme sahiptir. 
:::

Bu görevler çok sık yapıldığından, Yeoman bunları otomatikleştirir. Ayrıca, kurulumu diğer araçlarla nasıl başlatabileceğinizi de ele alacağız.

Yeoman tarafından sağlanan kurulum yardımcı araçları, kurulumu `install` kuyruğu bir parçası olarak bir kez çalıştıracak şekilde otomatik olarak planlayacaktır. Onlar çalıştıktan sonra herhangi bir şey çalıştırmanız gerekiyorsa, `end` kuyruğunu kullanın.

---

## npm

Bir `npm` kurulumu gerçekleştirmek için `this.npmInstall()` çağrısını yapmanız yeterlidir. Yeoman, `npm install` komutunun, birden fazla hazırlayıcı tarafından birden fazla kez çağrılmış olsa bile yalnızca bir kez çalıştırılmasını sağlar.

> Örneğin, lodash'ı bir geliştirme bağımlılığı olarak kurmak istediğinizde:
> — Projenizde gerekli bağımlılıkları etkili bir şekilde yönetmek için Yeoman'ı kullanabilirsiniz.

```js
class extends Generator {
  installingLodash() {
    this.npmInstall(['lodash'], { 'save-dev': true });
  }
}
```

Bu, komut satırında projenizde şu şekilde bir çağrıyı ifade eder:

```
npm install lodash --save-dev
```

### npm bağımlılıklarını programlı olarak yönetme

Bağımlılıklarınızın sabit sürümlerine sahip olmak istiyorsanız, bir şablon kullanmak yerine `package.json` dosyanızı programlı bir şekilde oluşturabilir veya genişletebilirsiniz. Yeoman'ın dosya sistemi araçları bu işlemi gerçekleştirmenize yardımcı olabilir.

Geliştirme bağımlılığı olarak `eslint` ve bağımlılık olarak `react` tanımlamak için örnek:

```js
class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Hedef dizinde package.json dosyasını genişlet veya oluştur
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
};
```

---

## Yarn

Kurulumu başlatmak için yalnızca `this.yarnInstall()` çağrısını yapmanız yeterlidir. Yeoman, `yarn install` komutunun, birden fazla hazırlayıcı tarafından birden fazla kez çağrılmış olsa bile yalnızca bir kez çalıştırılmasını sağlar.

Örneğin, lodash'ı bir geliştirme bağımlılığı olarak kurmak için:

```js
generators.Base.extend({
  installingLodash: function() {
    this.yarnInstall(['lodash'], { 'dev': true });
  }
});
```

Bu, komut satırında projenizde şu şekilde bir çağrıyı ifade eder:

```
yarn add lodash --dev
```

---

## Bower

Kurulumu başlatmak için yalnızca `this.bowerInstall()` çağrısını yapmanız yeterlidir. Yeoman, `bower install` komutunun, birden fazla hazırlayıcı tarafından birden fazla kez çağrılmış olsa bile yalnızca bir kez çalıştırılmasını sağlar.

## Birlikte kullanım

`this.installDependencies()` çağrısı varsayılan olarak npm ve bower'ı çalıştırır. Hangi yöneticileri kullanacağınızı belirlemek için her bir paket yöneticisi için boolean değerleri geçebilirsiniz.

Bower ile Yarn kullanmak için örnek:

```js
generators.Base.extend({
  install: function () {
    this.installDependencies({
      npm: false,
      bower: true,
      yarn: true
    });
  }
});
```

---

## Diğer araçları kullanma

Yeoman, kullanıcıların herhangi bir CLI komutunu `spawn` etmelerine olanak tanıyan bir soyutlama sağlar. Bu soyutlama, Linux, Mac ve Windows sistemlerinde sorunsuz bir şekilde çalışabilmesi için komutları normalize eder.

:::info 
Bu, geliştiricilerin en sevdikleri araçları rahatça kullanabilmelerini sağlar.
:::

Örneğin, bir PHP meraklısıysanız ve `composer` çalıştırmak istiyorsanız, bunu şu şekilde yazarsınız:

```js
class extends Generator {
  install() {
    this.spawnCommand('composer', ['install']);
  }
}
```

Kurulum kuyruğu içinde `spawnCommand` yöntemini çağırdığınızdan emin olun. Kullanıcılarınızın bir kurulum komutunun tamamlanmasını beklemelerini istemezsiniz.