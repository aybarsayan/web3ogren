---
sidebar_position: 1
---

# Yerel Test Ağı Oluşturma

## Giriş

Bu eğitim, bir yerel test ağı oluşturmanın birkaç farklı yöntemini açıklar.

Şu anda böyle bir yerel ağı başlatmak için iki seçenek bulunmaktadır:

-  kullanmak (önerilen)
- Her bir Camino-Node'u manuel olarak başlatmak (önerilmez)

## Camino Network Runner

### Kurulum

Camino Network Runner deposu  adresinde barındırılmaktadır.

Bu deponun README dosyası, aracın detaylarını içermektedir.

Depoyu aşağıdaki komutla klonlayın:

```bash
git clone https://github.com/chain4travel/camino-network-runner.git
```

Ayrıca kullanılabilir durumda ikili sürümler  sayfasında bulunmaktadır. Bunları bilgisayarınıza indirip kurabilirsiniz.

Kaynak koddan derlemek ve ikili dosyayı yerel olarak kurmak için (minimum sürüm için  göz atın; `golang` kurulmuş olmalıdır):

```bash
cd ${HOME}/go/src/github.com/chain4travel/camino-network-runner
go install -v ./cmd/camino-network-runner
```

`camino-network-runner` `$GOPATH/bin` içine kurulacaktır; lütfen `$GOPATH/bin`'in `$PATH`'inize dahil olduğundan emin olun; aksi takdirde, aşağıdaki komutları çalıştırmakta sorun yaşayabilirsiniz.

Ayrıca, Camino Network Runner ile ilgili komutları çalıştırdığınız tüm shell'lerde `CAMINO_EXEC_PATH`'in doğru şekilde ayarlandığından emin olun. Aşağıdaki satırı shell konfigürasyon dosyanıza eklemenizi şiddetle tavsiye ederiz.

```bash
# execPath'i makinenizdeki Camino-Node'un yolu ile değiştirin
CAMINO_EXEC_PATH="${HOME}/go/src/github.com/chain4travel/camino-node/build/camino-node"
```

Aksi belirtilmedikçe, aşağıda verilen dosya yolları bu deponun köküne göredir.

`camino-network-runner` ikilisini çalıştırdığınızda, bir RPC sunucusu olarak bir sunucu işlemini başlatır ve ardından API çağrılarını bekler ve bunları işler. Bu nedenle, bir shell'i RPC sunucusu için, diğerini ise çağrılar için kullanıyoruz.

### Sunucuyu Başlatma

```bash
camino-network-runner server \
--log-level debug \
--port=":8080" \
--grpc-gateway-port=":8081"
```

Yukarıda belirtilen komut `CTRL + C` ile durdurulana kadar çalışacaktır. Ek komutlar ayrı bir terminalde çalıştırılmalıdır.

RPC sunucusu iki portu dinler:

- `port`: ana gRPC portu (bkz. ).
- `grpc-gateway-port`: gRPC geçit portu (bkz. ), bu port HTTP taleplerini kabul eder.

İkili dosyayla çağrı yaptığınızda, ana porta hitap edilecektir. Bu modda, ikili dosya, çağrı yapmak için derlenmiş kodu çalıştırır. Alternatif olarak, ikili dosyayı kullanmaya gerek kalmadan doğrudan HTTP ile çağrılar yapılabilir. Bu modda, `grpc-gateway-port` sorgulanmalıdır.

Aşağıdaki örneklerin her biri, iki modda kullanımını gösterecektir.

### Beş Düğüm ile Yeni bir Camino Ağı Başlatma (Bir Küme)

```bash
curl -X POST -k http://localhost:8081/v1/control/start -d '{"execPath":"'${CAMINO_EXEC_PATH}'","numNodes":5,"logLevel":"INFO"}'
```

veya

```bash
camino-network-runner control start \
--log-level debug \
--endpoint="0.0.0.0:8080" \
--number-of-nodes=5 \
--camino-node-path ${CAMINO_EXEC_PATH}
```

Yanıt

```json
{
  "clusterInfo": {
    "nodeNames": [],
    "nodeInfos": {},
    "pid": 98315,
    "rootDataDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647",
    "healthy": false,
    "attachedPeerInfos": {},
    "customVmsHealthy": false,
    "customVms": {}
  }
}
```

Kümedeki tüm düğümlerin sağlıklı olup olmadığını kontrol etmek için bu komutu kullanın:

```bash
curl -X POST -k http://localhost:8081/v1/control/health -d ''
```

veya

```bash
camino-network-runner control health \
--log-level debug \
--endpoint="0.0.0.0:8080"
```

Bu çağrının yanıtı oldukça büyük olacaktır, çünkü tüm kümenin durumunu içerir. En sonunda `healthy:true` ifadesinin yer alması gerekmektedir (eğer sağlıklı değilse, `false` olarak gösterilecektir).

```json
{
  "clusterInfo": {
    "nodeNames": ["node3", "node4", "node5", "node1", "node2"],
    "nodeInfos": {
      "node1": {
        "name": "node1",
        "execPath": "/Users/testuser/workspace/src/github.com/chain4travel/camino-node/build/camino-node",
        "uri": "http://127.0.0.1:40108",
        "id": "NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL",
        "logDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node1/log",
        "dbDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node1/db-dir",
        "pluginDir": "",
        "whitelistedSubnets": "",
        "config": "eyJhcGktYWRtaW4tZW5hYmxlZCI6dHJ1ZSwiYXBpLWlwY3MtZW5hYmxlZCI6dHJ1ZSwiZGItZGlyIjoiL3Zhci9mb2xkZXJzLzBoL3Y0bnJiYnNuMXZ2YnI1aDJ3ZnJoNWg1MDAwMDBnbi9UL25ldHdvcmstcnVubmVyLXJvb3QtZGF0YTM1NzU0NTg2NDcvbm9kZTEvZGItZGlyIiwiaGVhbHRoLWNoZWNrLWZyZXF1ZW5jeSI6IjJzIiwiaW5kZXgtZW5hYmxlZCI6dHJ1ZSwibG9nLWRpciI6Ii92YXIvZm9sZGVycy8waC92NG5yYmJzbjF2dmJyNWgyd2ZyaDVoNTAwMDAwZ24vVC9uZXR3b3JrLXJ1bm5lci1yb290LWRhdGEzNTc1NDU4NjQ3L25vZGUxL2xvZyIsImxvZy1kaXNwbGF5LWxldmVsIjoiSU5GTyIsImxvZy1sZXZlbCI6IklORk8iLCJuZXR3b3JrLW1heC1yZWNvbm5lY3QtZGVsYXkiOiIxcyIsIm5ldHdvcmstcGVlci1saXN0LWdvc3NpcC1mcmVxdWVuY3kiOiIyNTBtcyIsInBsdWdpbi1kaXIiOiIiLCJwdWJsaWMtaXAiOiIxMjcuMC4wLjEiLCJ3aGl0ZWxpc3RlZC1zdWJuZXRzIjoiIn0="
      },
      "node2": {
        "name": "node2",
        "execPath": "/Users/testuser/workspace/src/github.com/chain4travel/camino-node/build/camino-node",
        "uri": "http://127.0.0.1:64470",
        "id": "NodeID-D1LbWvUf9iaeEyUbTYYtYq4b7GaYR5tnJ",
        "logDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node2/log",
        "dbDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node2/db-dir",
        "pluginDir": "",
        "whitelistedSubnets": "",
        "config": "eyJhcGktYWRtaW4tZW5hYmxlZCI6dHJ1ZSwiYXBpLWlwY3MtZW5hYmxlZCI6dHJ1ZSwiZGItZGlyIjoiL3Zhci9mb2xkZXJzLzBoL3Y0bnJiYnNuMXZ2YnI1aDJ3ZnJoNWg1MDAwMDBnbi9UL25ldHdvcmstcnVubmVyLXJvb3QtZGF0YTM1NzU0NTg2NDcvbm9kZTIvZGItZGlyIiwiaGVhbHRoLWNoZWNrLWZyZXF1ZW5jeSI6IjJzIiwiaW5kZXgtZW5hYmxlZCI6dHJ1ZSwibG9nLWRpciI6Ii92YXIvZm9sZGVycy8waC92NG5yYmJzbjF2dmJyNWgyd2ZyaDVoNTAwMDAwZ24vVC9uZXR3b3JrLXJ1bm5lci1yb290LWRhdGEzNTc1NDU4NjQ3L25vZGUyL2xvZyIsImxvZy1kaXNwbGF5LWxldmVsIjoiSU5GTyIsImxvZy1sZXZlbCI6IklORk8iLCJuZXR3b3JrLW1heC1yZWNvbm5lY3QtZGVsYXkiOiIxcyIsIm5ldHdvcmstcGVlci1saXN0LWdvc3NpcC1mcmVxdWVuY3kiOiIyNTBtcyIsInBsdWdpbi1kaXIiOiIiLCJwdWJsaWMtaXAiOiIxMjcuMC4wLjEiLCJ3aGl0ZWxpc3RlZC1zdWJuZXRzIjoiIn0="
      },
      "node3": {
        "name": "node3",
        "execPath": "/Users/testuser/workspace/src/github.com/chain4travel/camino-node/build/camino-node",
        "uri": "http://127.0.0.1:30301",
        "id": "NodeID-PM2LqrGsxudhZSP49upMonevbQvnvAciv",
        "logDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node3/log",
        "dbDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node3/db-dir",
        "pluginDir": "",
        "whitelistedSubnets": "",
        "config": "eyJhcGktYWRtaW4tZW5hYmxlZCI6dHJ1ZSwiYXBpLWlwY3MtZW5hYmxlZCI6dHJ1ZSwiZGItZGlyIjoiL3Zhci9mb2xkZXJzLzBoL3Y0bnJiYnNuMXZ2YnI1aDJ3ZnJoNWg1MDAwMDBnbi9UL25ldHdvcmstcnVubmVyLXJvb3QtZGF0YTM1NzU0NTg2NDcvbm9kZTMvZGItZGlyIiwiaGVhbHRoLWNoZWNrLWZyZXF1ZW5jeSI6IjJzIiwiaW5kZXgtZW5hYmxlZCI6dHJ1ZSwibG9nLWRpciI6Ii92YXIvZm9sZGVycy8waC92NG5yYmJzbjF2dmJyNWgyd2ZyaDVoNTAwMDAwZ24vVC9uZXR3b3JrLXJ1bm5lci1yb290LWRhdGEzNTc1NDU4NjQ3L25vZGUzL2xvZyIsImxvZy1kaXNwbGF5LWxldmVsIjoiSU5GTyIsImxvZy1sZXZlbCI6IklORk8iLCJuZXR3b3JrLW1heC1yZWNvbm5lY3QtZGVsYXkiOiIxcyIsIm5ldHdvcmstcGVlci1saXN0LWdvc3NpcC1mcmVxdWVuY3kiOiIyNTBtcyIsInBsdWdpbi1kaXIiOiIiLCJwdWJsaWMtaXAiOiIxMjcuMC4wLjEiLCJ3aGl0ZWxpc3RlZC1zdWJuZXRzIjoiIn0="
      },
      "node4": {
        "name": "node4",
        "execPath": "/Users/testuser/workspace/src/github.com/chain4travel/camino-node/build/camino-node",
        "uri": "http://127.0.0.1:31072",
        "id": "NodeID-5ZUdznHckQcqucAnNf3vzXnPF97tfRtfn",
        "logDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node4/log",
        "dbDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node4/db-dir",
        "pluginDir": "",
        "whitelistedSubnets": "",
        "config": "eyJhcGktYWRtaW4tZW5hYmxlZCI6dHJ1ZSwiYXBpLWlwY3MtZW5hYmxlZCI6dHJ1ZSwiZGItZGlyIjoiL3Zhci9mb2xkZXJzLzBoL3Y0bnJiYnNuMXZ2YnI1aDJ3ZnJoNWg1MDAwMDBnbi9UL25ldHdvcmstcnVubmVyLXJvb3QtZGF0YTM1NzU0NTg2NDcvbm9kZTQvZGItZGlyIiwiaGVhbHRoLWNoZWNrLWZyZXF1ZW5jeSI6IjJzIiwiaW5kZXgtZW5hYmxlZCI6dHJ1ZSwibG9nLWRpciI6Ii92YXIvZm9sZGVycy8waC92NG5yYmJzbjF2dmJyNWgyd2ZyaDVoNTAwMDAwZ24vVC9uZXR3b3JrLXJ1bm5lci1yb290LWRhdGEzNTc1NDU4NjQ3L25vZGU0L2xvZyIsImxvZy1kaXNwbGF5LWxldmVsIjoiSU5GTyIsImxvZy1sZXZlbCI6IklORk8iLCJuZXR3b3JrLW1heC1yZWNvbm5lY3QtZGVsYXkiOiIxcyIsIm5ldHdvcmstcGVlci1saXN0LWdvc3NpcC1mcmVxdWVuY3kiOiIyNTBtcyIsInBsdWdpbi1kaXIiOiIiLCJwdWJsaWMtaXAiOiIxMjcuMC4wLjEiLCJ3aGl0ZWxpc3RlZC1zdWJuZXRzIjoiIn0="
      },
      "node5": {
        "name": "node5",
        "execPath": "/Users/testuser/workspace/src/github.com/chain4travel/camino-node/build/camino-node",
        "uri": "http://127.0.0.1:37730",
        "id": "NodeID-EoYFkbokZEukfWrUovo74YkTFnAMaqTG7",
        "logDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node5/log",
        "dbDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647/node5/db-dir",
        "pluginDir": "",
        "whitelistedSubnets": "",
        "config": "eyJhcGktYWRtaW4tZW5hYmxlZCI6dHJ1ZSwiYXBpLWlwY3MtZW5hYmxlZCI6dHJ1ZSwiZGItZGlyIjoiL3Zhci9mb2xkZXJzLzBoL3Y0bnJiYnNuMXZ2YnI1aDJ3ZnJoNWg1MDAwMDBnbi9UL25ldHdvcmstcnVubmVyLXJvb3QtZGF0YTM1NzU0NTg2NDcvbm9kZTUvZGItZGlyIiwiaGVhbHRoLWNoZWNrLWZyZXF1ZW5jeSI6IjJzIiwiaW5kZXgtZW5hYmxlZCI6dHJ1ZSwibG9nLWRpciI6Ii92YXIvZm9sZGVycy8waC92NG5yYmJzbjF2dmJyNWgyd2ZyaDVoNTAwMDAwZ24vVC9uZXR3b3JrLXJ1bm5lci1yb290LWRhdGEzNTc1NDU4NjQ3L25vZGU1L2xvZyIsImxvZy1kaXNwbGF5LWxldmVsIjoiSU5GTyIsImxvZy1zZXZlbCI6IklORk8iLCJuZXR3b3JrLW1heC1yZWNvbm5lY3QtZGVsYXkiOiIxcyIsIm5ldHdvcmstcGVlci1saXN0LWdvc3NpcC1mcmVxdWVuY3kiOiIyNTBtcyIsInBsdWdpbi1kaXIiOiIiLCJwdWJsaWMtaXAiOiIxMjcuMC4wLjEiLCJ3aGl0ZWxpc3RlZC1zdWJuZXRzIjoiIn0="
      }
    },
    "pid": 98315,
    "rootDataDir": "/var/folders/0h/v4nrbbsn1vvbr5h2wfrh5h500000gn/T/network-runner-root-data3575458647",
    "healthy": true,
    "attachedPeerInfos": {},
    "customVmsHealthy": false,
    "customVms": {}
  }
}
```

#### Kümedeki Tüm Düğümlerin API Son Noktalarını Almak için {#retrieve-all-nodes}

```bash
curl -X POST -k http://localhost:8081/v1/control/uris -d ''
```

veya

```bash
camino-network-runner control uris \
--log-level debug \
--endpoint="0.0.0.0:8080"
```

Yanıt

```json
{
  "uris": [
    "http://127.0.0.1:30301",
    "http://127.0.0.1:31072",
    "http://127.0.0.1:37730",
    "http://127.0.0.1:40108",
    "http://127.0.0.1:64470"
  ]
}
```

Artık HTTP portları (API çağrılarının gönderileceği) `30301`, `31072`, `37730`, `40108` ve `64470` olan bir 5 düğümlü ağa sahipsiniz.

## Manuel olarak

Aşağıdaki komutlar,  dosyanızın `$GOPATH/src/github.com/chain4travel/camino-node` altında kurulu olduğunu varsayar. Oluşturulan beş düğüm de bir doğrulayıcıdır.

Bu düğümler için staking anahtarları, caminogo bağımlılığında bulunmaktadır ve `$GOPATH/pkg/mod/github.com/chain4travel/caminogo@[VERSION]/staking/local/staker1.crt` gibi yerlerde bulunmaktadır.

```bash
# [VERSION] kısmını camino-node go.mod'unda belirtilen caminogo sürümü ile değiştirin
CAMINO_KEY_PATH="${HOME}/mod/github.com/chain4travel/caminogo@[VERSION]/staking/local/"
```

5 düğüm, API çağrılarının gönderileceği HTTP portlarına (9650, 9652, 9654, 9656 ve 9658) sahip olacaktır.

Ağı başlatmak için:

```sh
cd $GOPATH/src/github.com/chain4travel/camino-node
```

```sh
./scripts/build.sh
```

```sh
./build/camino-node --public-ip=127.0.0.1 --http-port=9650 --staking-port=9651 --db-dir=db/node1 --network-id=local --staking-tls-cert-file=$(CAMINO_KEY_PATH)/staker1.crt --staking-tls-key-file=$(CAMINO_KEY_PATH)/staker1.key
```

```sh
./build/camino-node --public-ip=127.0.0.1 --http-port=9652 --staking-port=9653 --db-dir=db/node2 --network-id=local --bootstrap-ips=127.0.0.1:9651 --bootstrap-ids=NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL --staking-tls-cert-file=$(CAMINO_KEY_PATH)/staker2.crt --staking-tls-key-file=$(CAMINO_KEY_PATH)/staker2.key
```

```sh
./build/camino-node --public-ip=127.0.0.1 --http-port=9654 --staking-port=9655 --db-dir=db/node3 --network-id=local --bootstrap-ips=127.0.0.1:9651 --bootstrap-ids=NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL --staking-tls-cert-file=$(CAMINO_KEY_PATH)/staker3.crt --staking-tls-key-file=$(CAMINO_KEY_PATH)/staker3.key
```

```sh
./build/camino-node --public-ip=127.0.0.1 --http-port=9656 --staking-port=9657 --db-dir=db/node4 --network-id=local --bootstrap-ips=127.0.0.1:9651 --bootstrap-ids=NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL --staking-tls-cert-file=$(CAMINO_KEY_PATH)/staker4.crt --staking-tls-key-file=$(CAMINO_KEY_PATH)/staker4.key
```

```sh
./build/camino-node --public-ip=127.0.0.1 --http-port=9658 --staking-port=9659 --db-dir=db/node5 --network-id=local --bootstrap-ips=127.0.0.1:9651 --bootstrap-ids=NodeID-AK7sPBsZM9rQwse23aLhEEBPHZD5gkLrL --staking-tls-cert-file=$(CAMINO_KEY_PATH)/staker5.crt --staking-tls-key-file=$(CAMINO_KEY_PATH)/staker5.key