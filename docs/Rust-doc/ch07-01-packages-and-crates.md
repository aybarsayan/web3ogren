## Paketler ve Kütüphaneler

Modül sisteminin ilk bölümleri paketler ve kütüphaneler.

Bir *kütüphane*, Rust derleyicisinin bir anda dikkate aldığı en küçük kod miktarıdır. `cargo` yerine `rustc` kullanıp tek bir kaynak kod dosyası geçirseniz bile (1. bölümde "Rust Programı Yazma ve Çalıştırma" kısmında yaptığımız gibi), derleyici o dosyayı bir kütüphane olarak kabul eder. Kütüphaneler modüller içerebilir ve modüller, kütüphane ile derlenen diğer dosyalarda tanımlanabilir; bunu gelecek bölümlerde göreceğiz.

:::info 
**Kütüphanelerin Yapısı:**  
Kütüphaneler, modüller içerebilir ve çok sayıda dosya ile etkileşimde bulunabilir.
:::

Bir kütüphane iki formda olabilir: bir ikili kütüphane veya bir kütüphane kütüphanesi. 

*İkili kütüphaneler*, çalıştırabileceğiniz bir yürütücüye derlemeyi gerçekleştirdiğiniz programlardır; bunlara örnek olarak bir komut satırı programı veya bir sunucu verilebilir. Her biri, yürütücü çalıştırıldığında ne olacağını tanımlayan `main` adında bir fonksiyona sahip olmalıdır. Şimdiye kadar oluşturduğumuz tüm kütüphaneler ikili kütüphaneler olmuştur.

*Kütüphane kütüphaneleri*, `main` fonksiyonuna sahip değildir ve yürütücüye derlenmez. Bunun yerine, birden fazla projeyle paylaşılması amaçlanan işlevselliği tanımlar. Örneğin, [Bölüm 2][rand]'de kullandığımız `rand` kütüphanesi rastgele sayılar oluşturan işlevselliği sağlar. Rustaceanlar "kütüphane" dediğinde, genellikle kütüphane kütüphanesini kastederler ve "kütüphane" terimini genel programlama kavramı olan "kütüphane" ile değiştirirler.

:::note 
**Kütüphane Kökü:**  
Kütüphane kökü, Rust derleyicisinin başlangıç noktasıdır ve kütüphanenizin kök modülünü oluşturur. Daha fazlasını [“Modülleri Tanımlayarak Kapsam ve Gizliliği Kontrol Etme”][modules] bölümünde keşfedeceğiz.
:::

Bir *paket*, bir veya daha fazla kütüphaneden oluşan bir işlevsellik setidir. Bir paket, bu kütüphanelerin nasıl oluşturulacağını tanımlayan bir *Cargo.toml* dosyası içerir. Cargo aslında, kodunuzu oluşturmak için kullandığınız komut satırı aracı için ikili kütüphaneyi içeren bir paket. Cargo paketi ayrıca, ikili kütüphanenin bağımlı olduğu bir kütüphane kütüphanesini de içerir. Diğer projeler, Cargo komut satırı aracının kullandığı aynı mantığı kullanmak için Cargo kütüphane kütüphanesine bağımlı olabilir. Bir paket, istediğiniz kadar ikili kütüphane içerebilir, ancak en fazla bir kütüphane kütüphanesi olabilir. 

Bir paket, en az bir kütüphane içermelidir; bu bir kütüphane kütüphanesi veya ikili kütüphane olabilir.

---

Bir paketin oluşturulma sürecine göz atalım. Öncelikle `cargo new my-project` komutunu girelim:

```console
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml
src
$ ls my-project/src
main.rs
```

`cargo new my-project` komutunu çalıştırdıktan sonra, Cargo'nun neler oluşturduğunu görmek için `ls` kullanıyoruz. Proje dizininde, bize bir paket veren bir *Cargo.toml* dosyası var. Ayrıca *main.rs* içeren bir *src* dizini var. 

:::tip 
**Önemli Not:**  
*Cargo.toml* dosyasını metin editörünüzle açın ve *src/main.rs* ile ilgili herhangi bir şeyin olmadığını not edin. Cargo, *src/main.rs* dosyasının paketle aynı ada sahip bir ikili kütüphanenin kökü olduğunu belirten bir kural takip eder.
:::

Benzer şekilde, Cargo, paket dizininin *src/lib.rs* içerdiğini biliyorsa, paket, paketle aynı ada sahip bir kütüphane kütüphanesi içerir ve *src/lib.rs* bu kütüphanenin köküdür. Cargo, kütüphane veya ikili kütüphaneyi oluşturmak için `rustc`'ye kütüphane kökü dosyalarını geçirir.

Burada, sadece *src/main.rs* içeren bir paketimiz var, yani yalnızca `my-project` adı verilen bir ikili kütüphane içeriyor. Bir paket hem *src/main.rs* hem de *src/lib.rs* içeriyorsa, iki kütüphaneye sahip olur: biri ikili, diğeri ise, her ikisi de aynı paket adı ile aynıda bulunan bir kütüphane. 

Bir paket, *src/bin* dizinine dosyalar koyarak birden fazla ikili kütüphaneye sahip olabilir; her dosya ayrı bir ikili kütüphane olacaktır.

[modules]: ch07-02-defining-modules-to-control-scope-and-privacy.html
[rand]: ch02-00-guessing-game-tutorial.html#generating-a-random-number