# Düğüm için Güvenli Kılavuzlar

Düğümlerin güvenliğini sağlamak, özellikle blok zinciri veya dağıtık sistemler gibi merkeziyetsiz ağlarda, verilerin bütünlüğünü, gizliliğini ve erişilebilirliğini korumak açısından kritik öneme sahiptir. Düğümlerin güvenliğini sağlamak için kılavuzlar, ağ iletişiminden donanım ve yazılım yapılandırmalarına kadar çeşitli katmanları ele almalıdır. İşte düğümler için güvenli kılavuzlar:

### 1. Sunucuyu yalnızca TON Düğümü çalıştırmak için kullanın
   * **Sunucunun başka görevler için kullanılması** potansiyel bir güvenlik riski taşır.

---

### 2. Düzenli Olarak Güncelleyin ve Yamanlayın
   * Sisteminizin her zaman en son güvenlik yamaları ile güncel olduğundan emin olun.
   * Apt (Debian/Ubuntu için) veya yum/dnf (CentOS/Fedora için) gibi paket yönetim araçlarını kullanarak düzenli güncellemeler yapın:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
   * **Otomatik güvenlik güncellemelerini etkinleştirmek için göz önünde bulundurun.**
   
   :::tip
   Otomatik güncellemeler, sisteminizin güncel kalmasını sağlamak için iyi bir uygulamadır.
   :::tip

---

### 3. Güçlü SSH Yapılandırması Kullanın
   * **Root Girişini Devre Dışı Bırakın**: SSH üzerinden root erişimini engelleyin. `/etc/ssh/sshd_config` dosyasını düzenleyin:
   ```bash
   PermitRootLogin no
   ```
   * **SSH Anahtarlarını Kullanın**: Şifre kimlik doğrulamasından kaçının ve bunun yerine SSH anahtarlarını kullanın.
   ```bash
   PasswordAuthentication no
   ```
   * **Varsayılan SSH Portunu Değiştirin**: SSH'yi standart olmayan bir porta taşımak, otomatik brute-force saldırılarını azaltabilir. Örneğin:
   ```bash
   Port 2222
   ```
   * **SSH Erişimini Sınırlandırın**: Güvenilir IP'lerden gelen SSH erişimine izin vermek için güvenlik duvarı kuralları kullanın.
   
   :::warning
   Root erişiminin engellenmesi, sisteminizi brute-force saldırılarına karşı korur.
   :::warning

---

### 4. Bir Güvenlik Duvarı Uygulayın
   * Yalnızca gerekli hizmetlere izin verecek şekilde bir güvenlik duvarı yapılandırın. Yaygın araçlar arasında ufw (Basit Güvenlik Duvarı) veya iptables bulunmaktadır:
   ```bash
   sudo ufw allow 22/tcp   # SSH'yi izin ver
   sudo ufw allow 80/tcp   # HTTP'yi izin ver
   sudo ufw allow 443/tcp  # HTTPS'yi izin ver
   sudo ufw enable         # Güvenlik duvarını etkinleştir
   ```

---

### 5. Logları İzleyin
   * Şüpheli faaliyetleri tanımlamak için sistem loglarını düzenli olarak izleyin:
     * _/var/log/auth.log_ (kimlik doğrulama girişimleri için)
     * _/var/log/syslog_ veya _/var/log/messages_
   * Merkezileştirilmiş loglamayı düşünün.
   
   :::info
   Log izleme, sistemdeki anormallikleri zamanında tespit etmek için kritik öneme sahiptir.
   :::info

---

### 6. Kullanıcı Ayrıcalıklarını Sınırlandırın
   * Yalnızca güvenilir kullanıcılara root veya sudo ayrıcalıkları verin. `sudo` komutunu dikkatli kullanın ve erişimi en aza indirmek için _/etc/sudoers_ dosyasını gözden geçirin.
   * Kullanıcı hesaplarını düzenli olarak gözden geçirin ve gereksiz veya etkin olmayan kullanıcıları kaldırın.
 
---

### 7. SELinux veya AppArmor'ı Yapılandırın
   * **SELinux** (RHEL/CentOS üzerinde) ve **AppArmor** (Ubuntu/Debian üzerinde), belirli sistem kaynaklarına erişimi kısıtlayarak güvenliğe ek bir katman ekleyen zorunlu erişim kontrolü sağlar.

---

### 8. Güvenlik Araçlarını Kurun
   * Düzenli güvenlik denetimleri gerçekleştirmek ve potansiyel açıkları tanımlamak için Lynis gibi araçlar kullanın:
   ```bash
   sudo apt install lynis
   sudo lynis audit system
   ```
   
   :::note
   Güvenlik araçları, sisteminizin durumunu değerlendirmek için önemli bir role sahiptir.
   :::note
   
---

### 9. Gereksiz Hizmetleri Devre Dışı Bırakın
   * **Saldırı yüzeyini en aza indirmek için** kullanılmayan hizmetleri devre dışı bırakın veya kaldırın. Örneğin, FTP veya mail hizmetlerine ihtiyacınız yoksa, bunları devre dışı bırakmak için:
   ```bash
   sudo systemctl disable service_name
   ```

---

### 10. İhlal Tespit ve Önleme Sistemleri (IDS/IPS) Kullanın
   * Çok sayıda başarısız girişimden sonra IP adreslerini engellemek için Fail2ban gibi araçları kurun:
   ```bash
   sudo apt install fail2ban
   ```
   * **Dosya bütünlüğünü izlemek ve yetkisiz değişiklikleri tespit etmek için** AIDE (Gelişmiş İhlal Tespit Ortamı) kullanın.