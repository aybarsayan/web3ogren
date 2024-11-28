---
title: CMD ile Çift Zincir Erişim Kontrolü - BNB Greenfield Erişim Kontrolü
description: BSC akıllı sözleşmesini Greenfield'ın çift zincir programlanabilirliğinin basit bir örneği olarak nasıl kullanacağınızı öğrenin. Bu kılavuz, veri izin yönetimi sürecini adım adım açıklamaktadır.
keywords: [BNB Greenfield, Erişim kontrolü, İzin, BSC, Akıllı sözleşme]
order: 1
---

# CMD ile Çift Zincir Erişim Kontrolü

Bu kılavuzda, BSC akıllı sözleşmesini kullanarak veri izin yönetimi sürecini nasıl gerçekleştireceğinizi öğreneceksiniz; bu, Greenfield'ın çift zincir programlanabilirliğinin basit bir örneğidir.

## Ön Gereksinimler

Başlamadan önce, aşağıdaki araçların yüklü olduğundan emin olun:

- [gnfd-cmd](https://github.com/bnb-chain/greenfield-cmd)
- [gnfd-contract](https://github.com/bnb-chain/greenfield-contracts)

:::tip
Lütfen yukarıdaki iki depo için readme'yi takip ederek araçları yükleyin ve ortamı yapılandırın.
:::

BSC ve Greenfield ağlarında fon sahibi olan bir hesabınızın olduğuna emin olun.

### Adımlar

Aşağıdaki örnekte, Hesap A(0x0fEd1aDD48b497d619EF50160f9135c6E221D5F0, `keyA.json` içinde saklanıyor) Hesap B'ye (0x3bD70E10D71C6E882E3C1809d26a310d793646eB, `keyB.json` içinde saklanıyor) BSC sözleşmesi aracılığıyla özel dosyasına erişim verecektir.

Ayrıca, şifreyi bir dosyaya kaydedebilir ve `-p` ile şifre dosyasını belirtebilirsiniz. Örneğin, `gnfd-cmd -p password.txt ...`.

Başlamadan önce, lütfen `gnfd-cmd account import` veya `gnfd-cmd account new` komutlarıyla ilgili hesapları oluşturduğunuzdan ve mevcut dizinde config.toml dosyasının bulunduğundan emin olun. Hesabın, greenfield'a işlem göndermeden önce yeterli bakiyeye sahip olması gerektiğini unutmayın.

`config.toml` dosyasının içeriği aşağıdaki gibidir:

=== "Ana Ağ"

    ```
    rpcAddr = "https://greenfield-chain.bnbchain.org:443"
    chainId = "greenfield_1017-1"
    ```

=== "Test Ağı"

    ```
    rpcAddr = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    chainId = "greenfield_5600-1"
    ```

1. Ortamı hazırlayın

	```shell
	$ export AccountA=0x0fEd1aDD48b497d619EF50160f9135c6E221D5F0
	$ export AccountB=0x3bD70E10D71C6E882E3C1809d26a310d793646eB
	```

2. `story.txt` adında geçici bir dosya oluşturun

	```shell
	$ echo "bu eğlenceli bir hikaye" > story.txt 
	```

3. `funbucket` adında bir kova oluşturun.

	```shell
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt bucket create gnfd://funbucket
	```

4. `funbucket` kovasındaki `story.txt` adında bir özel nesne oluşturun.

	```shell
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt object put --contentType "text/xml" --visibility private ./story.txt  gnfd://funbucket/story.txt
	```

5. `fungroup` adında bir grup oluşturun.

	```shell
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt group create fungroup
	create group: fungroup succ, txn hash:17B6AE2C8D30B6D6EEABEE81DB8B37CF735655E9087CB02DC98EFF1DCA9FBE3A, group id: 136 
	```

	 Konsol, bu durumda grup ID'si olan `136` döndürecektir.

6. `fungroup` grubunu `story.txt` nesnesine bağlayın.

	```shell
	## Örnek, ${GroupId} ile önceki adımda aldığınız grup ID'sini değiştirin
	$ export GroupId=136
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt policy put --groupId ${GroupId} --actions get grn:o::funbucket/story.txt   
	```

7. Grubu BSC ağına yansıtın.

	```shell
	## Örnek, ${GroupId} ile önceki adımda aldığınız grup ID'sini değiştirin
	## 97 BSC test ağı zincir ID'sidir
	## 56 BSC ana ağ zincir ID'sidir

	$ export ChainId=56
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt group mirror --destChainId ${GroupId} --id ${GroupId} 
	```

8. Dosyaya HesapB aracılığıyla erişmeyi deneyin.
    
	```shell
	## Örnek
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt group head-member --groupOwner ${AccountA}  ${AccountB}  fungroup
	kullanıcı grupta mevcut değil
	$ gnfd-cmd -c config.toml -k keyB.json -p password.txt object get gnfd://funbucket/story.txt ./story-copy.txt
	run command error: statusCode 403 : code : AccessDenied  (Message: Erişim Reddedildi)
	```

	 Sonuç olarak, HesapB'nin dosyaya erişim izni olmadığı anlaşılmaktadır, bu beklenen bir durumdur.

9. [gnfd-contract](https://github.com/bnb-chain/greenfield-contracts) deposunu klonlayın ve bağımlılıkları yükleyin.

10. Sözleşme aracılığıyla Hesap B'ye erişim verin.

	=== "Ana Ağ"
		```sh
		export RPC_MAIN=https://bsc-dataseed.bnbchain.org
		$ forge script foundry-scripts/GroupHub.s.sol:GroupHubScript \
		--sig "addMember(address operator, uint256 groupId, address member)" \
		${AccountA} ${GroupId} ${AccountB} \
		-f $RPC_MAIN \
		--private-key 148748590a8b83dxxxxxxxxxxxxxxxxx \
		--legacy \
		--broadcast		
		```

	=== "Test Ağı"
		```sh
		export RPC_TEST=https://bsc-testnet-dataseed.bnbchain.org
		$ forge script foundry-scripts/GroupHub.s.sol:GroupHubScript \
		--sig "addMember(address operator, uint256 groupId, address member)" \
		${AccountA} ${GroupId} ${AccountB} \
		-f $RPC_TEST\
		--private-key 148748590a8b83dxxxxxxxxxxxxxxxxx \
		--legacy \
		--broadcast
		```

10. 30 saniye bekleyin ve HesapB aracılığıyla dosyaya tekrar erişmeyi deneyin.
	```shell
	## Örnek
	$ gnfd-cmd -c config.toml -k keyA.json -p password.txt group head-member --groupOwner ${AccountA}  ${AccountB} fungroup
	kullanıcı grubun bir üyesi
	$ gnfd-cmd -c config.toml -k keyB.json -p password.txt object get gnfd://funbucket/story.txt 
	başarıyla object story.txt indirildi, dosya yolu: ./story-copy.txt, içerik boyutu:20
	```

:::info
Bu süreç boyunca, doğru anahtar dosyalarına ve adreslere eriştiğinizden emin olun. Aksi takdirde, işlemler sırasında hatalarla karşılaşabilirsiniz.
:::