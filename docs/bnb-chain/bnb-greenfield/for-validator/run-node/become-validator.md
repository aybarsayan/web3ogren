---
title: Validator Olun - BNB Greenfield Düğümü
description: Bu doküman, BNB Greenfield doğrulayıcı düğümünün kurulum sürecini ayrıntılı olarak açıklamaktadır. Adım adım talimatlar ve önemli bilgilerle, doğrulayıcı olma yolunda gerekli olan tüm bilgileri elde edeceksiniz.
keywords: [BNB Greenfield, doğrulayıcı, full node, staking, BLS]
---

# Validator Olun

## Minimum Gereksinimler

- Stake edilecek BNB sayısı: `1000BNB`
- Donanım Gereksinimleri:  Güncel Mac OS X veya Linux sürümlerini çalıştıran masaüstü veya dizüstü donanım.
- CPU: 4 çekirdek
- RAM: 12 GB
- HDD/SDD: 1 TB
- Bant Genişliği: 1 MB/s
- Ceza detayları: Şu ana kadar doğrulayıcı için herhangi bir ceza uygulanmayacaktır.

---

## Validator Düğümü Kurulumu

### 1. Fullnode Kurulumu

Bir full node kurmak için `buradaki talimatları` izleyin.

### 2. Doğrulayıcı, delegatör, doğrulayıcı BLS, aktarıcı ve meydan okuyucu hesaplarını hazırlayın

!!! warning
    Mevcut anahtar oluşturma ve depolama prosedürleri çok güvenli değildir. `delegatör` ve `operatör` anahtarları gibi anahtarlarla işlem yaparken, daha  
    sağlam bir yöntem uygulamanız şiddetle tavsiye edilir.
    
    Daha fazla güvenlik ve en iyi uygulamalar için, `Soğuk Cüzdan` ve `MPC Cüzdan` kullanımı güçlü bir şekilde teşvik edilmektedir.

!!! note
    `keyring-backend`, bazı işletim sistemlerinde mevcut olmayabilecek birden fazla depolama arka ucunu destekler.
    Daha fazla detay için `buraya` bakın.

```bash
gnfd keys add validator --keyring-backend test
gnfd keys add delegator --keyring-backend test
gnfd keys add validator_bls --keyring-backend test --algo eth_bls
gnfd keys add validator_relayer --keyring-backend test
gnfd keys add validator_challenger --keyring-backend test
```

!!! tip
    Alternatif olarak, farklı bir $KEY_HOME konumu seçerseniz ve önerilen varsayılan `~/.gnfd` kullanmıyorsanız, aşağıdaki betiği kullanarak full node'u başlatabilirsiniz; burada $KEY_HOME sizin seçtiğiniz dizindir.

```bash
gnfd keys add validator --keyring-backend test --home ${KEY_HOME}
gnfd keys add delegator --keyring-backend test --home ${KEY_HOME}
gnfd keys add validator_bls --keyring-backend test --algo eth_bls --home ${KEY_HOME}
gnfd keys add validator_relayer --keyring-backend test --home ${KEY_HOME}
gnfd keys add validator_challenger --keyring-backend test --home ${KEY_HOME}
```

### 3. Doğrulayıcı, delegatör, doğrulayıcı BLS, aktarıcı ve meydan okuyucu hesap adreslerini alın

!!! note
    Dosyaları `adım 2`'de özel bir klasöre kaydettiyseniz, doğru --keyring-backend seçtiğinizden ve --home'un doğru ayarlandığından emin olun.

```bash
VALIDATOR_ADDR=$(gnfd keys show validator -a --keyring-backend test)
DELEGATOR_ADDR=$(gnfd keys show delegator -a --keyring-backend test)
RELAYER_ADDR=$(gnfd keys show validator_relayer -a --keyring-backend test)
CHALLENGER_ADDR=$(gnfd keys show validator_challenger -a --keyring-backend test)
VALIDATOR_BLS=$(gnfd keys show validator_bls --keyring-backend test --output json | jq -r '.pubkey_hex')
VALIDATOR_BLS_PROOF=$(gnfd keys sign ${VALIDATOR_BLS} --keyring-backend test --from validator_bls)
VALIDATOR_NODE_PUB_KEY=$(cat ${CONFIG_PATH}/config/priv_validator_key.json | jq -r '.pub_key.value')
```

### 4. Bir Doğrulayıcı Oluşturma Önerisi Gönderin

Aşağıdaki JSON'daki değerleri değiştirin ve create_validator_proposal.json olarak kaydedin:

- `${NODE_NAME}`: Bu düğüm için özel, okunabilir bir ad.
- `${VALIDATOR_NODE_PUB_KEY}`: Adım 1'de oluşturulan uzlaşı anahtarı (varsayılan olarak ${HOME}/.gnfd/config/priv_validator_key.json içinde saklanır).
- `${VALIDATOR_ADDR}`: Adım 2'de oluşturulan operatör adresi.
- `${DELEGATOR_ADDR}`: Adım 2'de oluşturulan delegatör adresi.
- `${VALIDATOR_BLS}`: Adım 2'de oluşturulan BLS anahtarı.
- `${VALIDATOR_BLS_PROOF}`: Adım 2'de oluşturulan BLS doğrulaması.
- `${RELAYER_ADDR}`: Adım 2'de oluşturulan aktarıcı adresi.
- `${CHALLENGER_ADDR}`: Adım 2'de oluşturulan meydan okuyucu adresi.

```json
{
 "messages": [
  {
   "@type": "/cosmos.staking.v1beta1.MsgCreateValidator",
   "description": {
    "moniker": "${NODE_NAME}",
    "identity": "",
    "website": "",
    "security_contact": "",
    "details": ""
   },
   "commission": {
    "rate": "0.070000000000000000",
    "max_rate": "1.000000000000000000",
    "max_change_rate": "0.010000000000000000"
   },
   "min_self_delegation": "1000000000000000000000",
   "delegator_address": "${DELEGATOR_ADDR}",
   "validator_address": "${VALIDATOR_ADDR}",
   "pubkey": {
    "@type": "/cosmos.crypto.ed25519.PubKey",
    "key": "${VALIDATOR_NODE_PUB_KEY}"
   },
   "value": {
    "denom": "BNB",
    "amount": "1000000000000000000000"
   },
   "from": "0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2",
   "relayer_address": "${RELAYER_ADDR}",
   "challenger_address": "${CHALLENGER_ADDR}",
   "bls_key": "${VALIDATOR_BLS}", 
   "bls_proof": "${VALIDATOR_BLS_PROOF}"
  }
 ],
 "metadata": "",
 "title": "Oluştur ${NODE_NAME} Doğrulayıcı",
 "summary": "${NODE_NAME} doğrulayıcı oluştur",
 "deposit": "1000000000000000000BNB"
}
```

#### 4.1 Yerel anahtarlarla öneriyi göndermek için create validator komutunu çalıştırın. Delegatör hesabının yeterli BNB tokenına sahip olduğundan emin olun.

!!! info
    `Soğuk Cüzdan` veya `MPC cüzdanı` kullanıyorsanız, lütfen adım `#4.2` ile devam edin.




```bash
gnfd tx staking create-validator ./create_validator_proposal.json --keyring-backend test --chain-id "greenfield_1017-1" --from ${DELEGATOR_ADDR} --node "https://greenfield-chain.bnbchain.org:443" -b sync --gas "200000000" --fees "1000000000000000000BNB" --yes
```




```bash
gnfd tx staking create-validator ./create_validator_proposal.json --keyring-backend test --chain-id "greenfield_5600-1" --from ${DELEGATOR_ADDR} --node "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443" -b sync --gas "200000000" --fees "1000000000000000000BNB" --yes
```




#### 4.2 `gnfd-tx-gondereni` ile öneriyi gönderin. Delegatör hesabının yeterli BNB tokenına sahip olduğundan emin olun.

İşlem detaylarını generate etmek için komutu çalıştırın.
```bash
gnfd tx staking create-validator ./create_validator_proposal.json --from ${DELEGATOR_ADDR} --print-eip712-msg-type
```

İşlemi [gnfd-tx-gondereni](https://gnfd-tx-sender.nodereal.io/) kullanarak gönderin.

![submit-proposal](../../../images/bnb-chain/bnb-greenfield/static/asset/14-gnfd-tx-sender.png)

---

### 5. Öneri onaylanana kadar oylama için bekleyin.

Öneriyi başarıyla gönderdikten sonra, oylamanın tamamlanmasını ve önerinin onaylanmasını beklemelisiniz.
Ana ağda 7 gün, test ağında ise 1 gün sürecektir. Onaylandığında ve başarıyla yürütüldüğünde, 
düğümün doğrulayıcı haline geldiğini doğrulayabilirsiniz. 

!!! warning
    Lütfen doğrulayıcı düğümün seçilmeden önce çalıştığından emin olun. Ve doğrulayıcı, `aktarıcıyı çalıştırma` ve `meydan okuyucuyu çalıştırma` konularında sorumludur, lütfen bu hizmetlerin hepsinin beklendiği gibi çalıştığından emin olun. 

### 6. Tüm doğrulayıcıları sorgula

=== "Mainnet"
    ```bash
    gnfd query staking validators --node "https://greenfield-chain.bnbchain.org:443"
    ```

=== "Testnet"
    ```bash
    gnfd query staking validators --node "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org:443"
    ```