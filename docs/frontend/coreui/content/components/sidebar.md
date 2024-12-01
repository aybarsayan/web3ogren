---
description: Bootstrap Kenar Çubuğu, her türden dikey navigasyon için güçlü ve özelleştirilebilir duyarlı bir navigasyon bileşenidir. Kenar çubuğu, markalaşma, navigasyon ve daha fazlası için yerleşik destek sunar. 
keywords: [Bootstrap, Kenar Çubuğu, Dikey Navigasyon, Özelleştirme, CSS Değişkenleri, JavaScript, Responsive Design]
---

## Nasıl çalışır

Kenar çubuğu kullanmaya başlamadan önce **bilmeniz gerekenler**:

- Kenar çubuğu, bir `.sidebar` ile sarılmalıdır.
- Kenar çubuğu, mobil cihazlarda varsayılan olarak gizlidir. `.sidebar` öğesine `.show` ekleyerek gösterilmesini sağlayın.
- Kenar çubuğu, masaüstü cihazlarda varsayılan olarak gösterilmektedir. `.sidebar` öğesine `.hide` ekleyerek gizlenmesini sağlayın.
- Erişilebilirliği sağlamak için bir `` öğesi kullanın veya daha genel bir öğe olan `` kullanıyorsanız, `.sidebar-nav` öğesine `role="navigation"` ekleyerek bunu yardımcı teknolojiler kullanıcıları için belirgin bir işaret alanı olarak tanımlayın.

:::tip
Kenar çubuğunun erişilebilirliğini artırmak için her zaman uygun rol ve etiketleri kullanmaya özen gösterin.
:::

Desteklenen alt bileşenler ve bir örnek için okumaya devam edin.

## Desteklenen içerik

Kenar çubuğu, birkaç alt bileşen için yerleşik destek ile birlikte gelir. Gerektikçe aşağıdakilerden birini seçin:

- Opsiyonel başlık için `.sidebar-header`.
- Şirketinizin, ürününüzün veya projenizin adı için `.sidebar-brand`.
- Tam boyutlu ve hafif navigasyon için `.sidebar-nav` (açılır menü desteği dahil).
- Opsiyonel alt bilgi için `.sidebar-footer`.
- Küçültme eklentimizle birlikte kullanmak için `.sidebar-toggler`.

## Örnekler

### Kenar çubuğu bileşeni

Aşağıda varsayılan olarak masaüstü cihazlarda gösterilen bir kenar çubuğu örneği bulunmaktadır.

  
    CoreUI
  
  
    Navigasyon Başlığı
    
      
         Navigasyon öğesi
      
    
    
      
         Rozet ile
        YENİ
      
    
    
      
         Açılır menü
      
      
        
          
             Açılır menü öğesi
          
        
        
          
             Açılır menü öğesi
          
        
      
    
    
      
         CoreUI İndir
    
    
      
         CoreUI'yi Deneyin
        PRO
      
    
  
  
    
  

### Dar kenar çubuğu

Kenar çubuğunu dar yapmak için `.sidebar-narrow` sınıfını ekleyin.

  
    CUI
  
  
    
      
        
      
    
    
      
        
      
    
    
      
        
    
    
      
        
      
    
  

### Katlanabilir kenar çubuğu

Kenar çubuğunu dar ve fare ile üzerine gelindiğinde açılır hale getirmek için `.sidebar-narrow-unfoldable` sınıfını ekleyin.

  
    CUI
  
  
    Navigasyon Başlığı
    
      
         Navigasyon öğesi
      
    
    
      
         Rozet ile
        YENİ
      
    
    
      
         Açılır menü
      
      
        
          
             Açılır menü öğesi
          
        
        
          
             Açılır menü öğesi
          
        
      
    
    
      
         CoreUI İndir
    
    
      
         CoreUI'yi Deneyin
        PRO
      
    
  

## Karanlık kenar çubuğu

Kenar çubuklarının görünümünü `.sidebar-dark` sınıfıyla değiştirebilirsiniz.

  
    CoreUI
  
  
    Navigasyon Başlığı
    
      
         Navigasyon öğesi
      
    
    
      
         Rozet ile
        YENİ
      
    
    
      
         Açılır menü
      
      
        
          
             Açılır menü öğesi
          
        
        
          
             Açılır menü öğesi
          
        
      
    
    
      
         CoreUI İndir
    
    
      
         CoreUI'yi Deneyin
        PRO
      
    
  
  
    
  

## Yerleşim

Kenar çubuğu bileşenlerinin varsayılan yerleşimi, görüntü alanının solundadır, ancak aşağıdaki değiştirme sınıflarından birini ekleyebilirsiniz.

- `.sidebar-start` kenar çubuğunu görüntü alanının soluna yerleştirir (yukarıda gösterildiği gibi)
- `.sidebar-end` kenar çubuğunu görüntü alanının sağ tarafına yerleştirir

## JavaScript davranışı

### Yöntemler

Kenar çubuğu örneğini kenar çubuğu yapılandırıcısı ile oluşturabilirsiniz, örneğin:


var mySidebar = document.querySelector('#mySidebar')
var sidebar = new coreui.Sidebar(mySidebar)
:::info
Kenar çubuğu örneğinin oluşturulması, JavaScript ile etkileşimlerin başlaması için gereklidir.
:::


| Yöntem | Açıklama |
| --- | --- |
| `show` | Kenar çubuğunu gösterir. |
| `hide` | Kenar çubuğunu gizler. |
| `toggle` | Kenar çubuğunu açar veya kapatır. |
| `getInstance` | Bir DOM öğesiyle ilişkili kenar çubuğu örneğini almanızı sağlayan bir statik yöntemdir. |

var sidebarNode = document.querySelector('#mySidebar')
var sidebar = coreui.Sidebar.getInstance(sidebarNode)
sidebar.close()
### Olaylar

Bootstrap için CoreUI'nin uyarı eklentisi, uyarı işlevselliğine bağlanmak için birkaç olayı ortaya çıkarır.


| Olay | Açıklama |
| --- | --- |
| `hidden.coreui.sidebar` | Bu olay, `hide` örnek yöntemi çağrıldığında hemen tetiklenir. |
| `hide.coreui.sidebar` | Bu olay, kenar çubuğu kullanıcının kapatmayı tamamladığında tetiklenir (CSS geçişlerinin tamamlanmasını bekler). |
| `shown.coreui.sidebar` | Bu olay, `show` örnek yöntemi çağrıldığında hemen tetiklenir. |
| `show.coreui.sidebar` | Bu olay, kenar çubuğu kullanıcının görünür hale geldiğinde tetiklenir (CSS geçişlerinin tamamlanmasını bekler). |

var mySidebar = document.getElementById('mySidebar')
mySidebar.addEventListener('closed.coreui.sidebar', function () {
  // bir şey yap…
})
## Özelleştirme

### CSS değişkenleri

Kenar çubukları, gerçek zamanlı özelleştirmeyi geliştirmek için `.sidebar`, `.sidebar-backdrop`, `.sidebar-narrow` ve `.sidebar-nav` üzerinde yerel CSS değişkenleri kullanır. CSS değişkenleri için değerler Sass üzerinden ayarlanır, bu nedenle Sass özelleştirmesi hala desteklenmektedir.

### SASS değişkenleri

