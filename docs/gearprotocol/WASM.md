---
sidebar_label: WebAssembly (Wasm) Nedir?
sidebar_position: 7
---
# WebAssembly (Wasm) Nedir?

WebAssembly, web sayfalarında JavaScript dışındaki programlama dilleriyle uygulamaları çalıştırmak için bir yöntemdir. Temel olarak, Wasm, tüm modern tarayıcılarda çalışan bir sanal makinedir. Geçmişte bir web sayfasında kod çalıştırmak için JavaScript kullanmak zorunda kalınırken, Wasm sayesinde JavaScript dışındaki programlama dilleriyle kod çalıştırmak mümkün hale gelir.

WebAssembly Sanal Makinesi, kısaca Wasm, teknoloji özellikleri nedeniyle diğer sanal makinelerden daha hızlı olduğu kanıtlanmıştır. WebAssembly'nin kullanımı, Gear'ın akıllı sözleşmelerinin doğrudan makine koduna derlenmesini ve neredeyse yerel hızlarda çalışmasını sağlar. Daha yüksek hızlar, daha düşük işlem maliyetleri ve daha yüksek verimlilik anlamına gelir.

Tüm Gear programları ve akıllı sözleşmeleri WebAssembly programları olarak çalışır. Bu, geliştiricilerin uygulamalarını web'e getirebileceği ve uygulamanın tam seti yeteneklerine (genellikle Windows veya Mac üzerinde yerel olarak çalıştırıldığında sahip olduğu yetenekler) ile tam performans elde edebileceği anlamına gelir. Geliştiricilerin doğrudan Wasm kodunu yazması gerekmez. Bunun yerine, diğer dillerle yazılmış programlar için derleme hedefi olarak Wasm'ı kullanırlar.

Wasm'ın çözdüğü temel sorun, web'de JavaScript dışındaki programlama dillerinin kullanılamamasıdır. JavaScript harika bir programlama dilidir, ancak büyük uygulamalarda süper hızlı olmak üzere tasarlanmamıştır. Wasm'ın devrim niteliğinde olan tarafı, başka programlama dilleriyle yazılmış yerel uygulamaların performansını, tamamen güvenli bir şekilde, web'e getirmesidir.

Wasm, iki ana alanda önemli hız artışları sağlar. İlk olarak, uygulama başlatma hızını önemli ölçüde artırır. Aslında, Wasm kullanan uygulamalar, uygulama başlatma süresini yarıya indirmeyi başarmıştır ve daha fazla optimize yapıldıkça başlatma hızı daha da artacaktır. Bu, büyük uygulamaların çok hızlı bir şekilde yüklenmesine izin verir. İkinci olarak, Wasm, verimlilik açısından da önemli avantajlar sağlar. Kod bir kez derlendikten sonra çok daha hızlı çalışacak, bu da uygulamaların daha verimli ve hızlı çalışmasını sağlayacak ve kullanıcı deneyimini önemli ölçüde iyileştirecekt

ir.

WebAssembly'nin aşağıdaki avantajları vardır:

- Wasm son derece hızlı, verimli ve taşınabilirdir. Kod, farklı platformlarda neredeyse yerel hızda çalıştırılabilir.

- Wasm aynı zamanda okunabilir ve hata ayıklanabilir. WebAssembly düşük seviyeli bir dil olsa da, insanlar tarafından yazılabilen, görüntülenebilen ve hata ayıklanabilen insan tarafından okunabilir bir metin formatına sahiptir.

- Aynı zamanda son derece güvenlidir, çünkü güvenli bir kum havuzunda çalıştırılır ve diğer web kodları gibi, tarayıcının aynı kök ve izinsiz güvenlik politikalarını uygular.

Wasm formatı, Gear Protocol'ün geliştiricilerine bugün Rust ile C#/C++, Go ve gelecekte JavaScript gibi dillerle uygulama yazma imkanı sağlar.