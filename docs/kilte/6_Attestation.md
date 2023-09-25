# Attestation 📜

In this section, our individual in the Attester role 🕵️‍♂️ will process the `Credential` and perform the following actions:

- Attest 🖋️ or reject ❌
- Store the attestation information on the chain 📦

:::info Let's recall what Attestation was 🤔

- In a decentralized architecture, we can ensure validity with less trust. 🌐 To ensure validity with diminishing trust, a verification system is required. In KILT, we achieve this through Attestations. ✅

- Attestations involve proving or confirming the validity of the data within a claim (claim), typically performed by a trusted validator (attester). 🔍👍
:::

## Attesting the Credential 🖊️

The `attestCredential` function takes the DID of the `Attester` within itself. 📌 Once all documents are ready, we can attest the `credentials` obtained from the `Claimer`. 📝 This `credential` is considered valid until it is `revoke` after being added to the chain. 🔗🔒

![alternative text](../../static/img/kilt/revoked.gif "Welcome")

:::info What was this so-called Revoke?

KILT SDK has some super features related to public credentials. 🚀

- **Canceling and Removing Credentials 🚫📜**: The credential identifier is our hero for performing many operations on public credentials! 🦸‍♂️ In some cases, when canceling a credential, we might want to leave it on the chain. But sometimes, we might say, "Let's both cancel and remove this credential!" The deposit is not returned in the first case because the credential is still on the chain. But in the second, all information is deleted, and the deposit returns! 💸

- **Not Revoking a Credential 🔄**: If we have revoked a credential but did not remove it from the chain, we can revive it! 🌱 For example, a driver's license can be marked as "suspended" for a while but can then be reactivated. 🚗💨

- **Getting the Deposit Back 💰**: Now, this part is interesting! 🤓 We usually need a credential validator for all these operations. However, we can set aside this rule to remove a credential and get the deposit back. Only the person who paid the deposit is needed in this operation. 🎉
  

:::

### Imported Modules and Functions

```typescript title="attestCredential.ts"
import { config as envConfig } from 'dotenv'
import * as Kilt from '@kiltprotocol/sdk-js'
import { generateAccount } from './generateAccount'
import { generateCredential } from '../claimer/generateCredential'
import { generateKeypairs } from './generateKeypairs'
import { generateLightDid } from '../claimer/generateLightDid'
```

First, we start by adding our packages. These packages are ones we've used before. If we examine them in order:

- `dotenv`: Used to load environment variables.
- `Kilt`: KILT protocol SDK.
- Other functions: Previously defined helper functions.

### `attestCredential` Function

This function is used to attest a credential. The attestation process is done by writing the credential's validity to the blockchain.

```typescript title="attestCredential.ts"
export async function attestCredential(
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  credential: Kilt.ICredential,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<void> {
  // ...
}
```

After adding our packages, we can define the functions that will perform the Attestation process. The first of these will be the `attestCredential()` function. This function will take in 4 parameters and will return a `Promise`. If we look at the parameters, it takes them one by one:

- `attesterAccount`: The account key pair (secret, public) of the Attester.
- `attesterDid`: The DID of the Attester.
- `credential`: The credential to be attested.
- `signCallback`: The callback function is to be used to sign the transaction.

#### API Connection

```typescript title="attestCredential.ts"
const api = Kilt.ConfigService.get('api')
```

Once inside the function, we must connect to the `api` to link the KILT-SDK to our code.

#### Getting CType and Root Hash

```typescript title="attestCredential.ts"
const { cTypeHash, claimHash } = Kilt.Attestation.fromCredentialAndDid(
  credential,
  attesterDid
)
```

We can now perform the attestation process with the `Attestation.fromCredentialAndDid()` function. This function takes the `credential` we want to attest and the `attesterDid`. It gives us the Hash values we need to save to the chain.

#### Creating the Transaction and Authorization

```typescript title="attestCredential.ts"
const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
const extrinsic = await Kilt.Did.authorizeTx(
  attesterDid,
  tx,
  signCallback,
  attesterAccount.address
)
```

To perform almost every operation on the blockchain, we need to convert that operation to a transfer format. The `attestation` process is no exception. To save the attestation process and write it to the chain, we need to convert it to a transfer format. In order:

- `api.tx.attestation.add(...)`: Creates a new attestation transaction. It takes the attestation hash values we created in the previous line.
- `Kilt.Did.authorizeTx(...)`: Authorizes the created transaction. It does this authorization through the `attesterDid`.

#### Sending the Transaction to the Blockchain

```typescript title="attestCredential.ts"
console.log('Attester -> create attestation...')
await Kilt.Blockchain.signAndSubmitTx(extrinsic, attesterAccount)
```

Finally, the authorized transaction is signed by the `attester` account and sent to the blockchain.

This way, the `attestCredential` function attests the credential and writes this attestation to the blockchain.

### `attestingFlow` Function

This function integrates the processes of generating a credential and attesting it. Here's an overview of the function:

```typescript title="attestCredential.ts"
export async function attestingFlow(
  claimerDid: Kilt.DidUri,
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<Kilt.ICredential> {
  // ...
}
```

As seen above, a structure similar to the `attestCredential` function is presented. This asynchronous function uses the `attestCredential` function to attest a credential and then returns the attested credential.

- `claimerDid`: The DID of the claimer.
- `attesterAccount` and `attesterDid`: Account and DID information of the attester.
- `signCallback`: The callback function is used for signing the transaction.

#### Generating the Credential

Upon entering the function, we can both generate a credential and call the `attestCredential` function to attest it.

```typescript title="attestCredential.ts"
const credential = generateCredential(claimerDid, {
  age: 19,
  name: 'Göktuğ Ayan'
})
```

Initially, a credential is generated using the `generateCredential` function. This credential takes the claimer's DID (`claimerDid`) and the claimed content (`age: 19, name: 'Göktuğ Ayan').

#### Attesting the Credential

```typescript title="attestCredential.ts"
await attestCredential(attesterAccount, attesterDid, credential, signCallback)
```

The `attestCredential` function is invoked, and the credential is attested. This step provides the attester's account details and DID, the generated credential, and the signature callback function as parameters.

#### Returning the Credential

```typescript title="attestCredential.ts"
return credential
```

The attested credential is returned.

This function demonstrates step-by-step how a credential is generated and attested. Typically, such processes are triggered via a user interface or an API.

:::info Why Did We Write Two Functions?

**`attestCredential` Function**

This function is used to attest a credential. That is, this function takes a credential and attests it by writing to the blockchain. This is necessary to finalize the validity of the credential. An attester typically calls this function.

**`attestingFlow` Function**

This function encompasses all the steps required for the attestation of a credential. It first generates a credential (with the `generateCredential` function). Then, it attests this credential using the `attestCredential` function. This usually occurs within an application flow, for instance, through a user interface.

![alternative text](../../static/img/kilt/spiderman.png "Welcome")

**Why Do We Need Both?**

1. **Modularity and Reusability**: The `attestCredential` function is used solely for attesting credentials. This makes it reusable in different scenarios or different application flows. For instance, it can be used to attest different types of credentials.

2. **Workflow Management**: The `attestingFlow` function manages the entire process from generating to attesting a credential. This allows the application to easily manage more complex workflows.

3. **Flexibility**: Both functions are designed for different needs. While `attestCredential` provides lower-level functionality, `attestingFlow` provides a higher-level workflow. This allows developers to write code more flexibly based on the need.

4. **Readability and Maintenance**: Breaking the code into parts makes it more readable and easier to maintain. For instance, if there's an issue related to attesting credentials, we can focus solely on the `attestCredential` function to resolve it.

For these reasons, both functions are necessary.
:::

### Main Code Block

```typescript title="attestCredential.ts"
if (require.main === module) {
  ;(async () => {
    // ...
  })()
}
```

This code block contains the code that will be executed if this file is run directly. It loads environment variables, establishes a connection with KILT, and calls the `attestingFlow` function.

:::note Everything Together
Fasten your seat belts! From creating DIDs to attesting credentials, we're about to perform several operations. We've already written the codes for these operations; now it's time to execute them!
:::

#### Loading Environment Variables

```typescript title="attestCredential.ts"
envConfig()
```

This line loads the environment variables from the `.env` file.

#### Setting Up the Try Catch Structure

```typescript title="attestCredential.ts"
    try {
		.
		.
		.
    } catch (e) {
      console.log('Error while going through the attesting workflow')
      throw e
    }
```

All operations will be set up within a `try` `catch` structure to handle any potential errors. The codes we'll write will be placed inside the `try` block. Any error will be caught by the `catch` function.

#### Connecting to KILT

```typescript title="attestCredential.ts"
await Kilt.connect(process.env.WSS_ADDRESS as string)
```

This line establishes a connection to the KILT protocol. The connection address is retrieved from the `.env` file. We will be connecting to KILT's test network.

#### Creating the Attester Account

```typescript title="attestCredential.ts"
const attesterAccountMnemonic = process.env.ATTESTER_ACCOUNT_MNEMONIC as string
const { account: attesterAccount } = generateAccount(attesterAccountMnemonic)
```
These lines create an Attester account using a mnemonic retrieved from the environment variables. We had previously written the `generateAccount` function together.
#### Generating the Attester DID

```typescript title="attestCredential.ts"
const attesterDidMnemonic = process.env.ATTESTER_DID_MNEMONIC as string
const { authentication, assertionMethod } = generateKeypairs(attesterDidMnemonic)
const attesterDidUri = Kilt.Did.getFullDidUriFromKey(authentication)
```

These lines are used to generate a DID for the Attester. We had previously written the `generateKeypairs` function for generating DIDs.

#### Generating the Claimer DID

```typescript title="attestCredential.ts"
const claimerDidMnemonic = process.env.CLAIMER_DID_MNEMONIC as string
const claimerDid = await generateLightDid(claimerDidMnemonic)
```

These lines are used to generate a DID for the Claimer. This time, we'll be using a Light DID.

#### Generating and Attesting the Credential

```typescript title="attestCredential.ts"
const credential = await attestingFlow(
  claimerDid.uri,
  attesterAccount,
  attesterDidUri,
  async ({ data }) => ({
    signature: assertionMethod.sign(data),
    keyType: assertionMethod.type
  })
)
```

This line initiates the credential generation and attestation workflow. The function it utilizes is the previously defined `attestingFlow` function.

#### Printing the Results

```typescript title="attestCredential.ts"
console.log('The claimer built their credential and now has to store it.')
console.log('Add the following to your .env file. ')
console.log(`CLAIMER_CREDENTIAL='${JSON.stringify(credential)}'`)
```

These lines print the generated credential and instruct the user to add this information to their `.env` file.

:::info A General Overview and Functionality of the Functions
Let's try to decipher the code by looking at its functionality.

The `attestingFlow` function in the code showcases the entire process from start to finish.

```typescript title="attestCredential.ts"
import { config as envConfig } from 'dotenv'

import * as Kilt from '@kiltprotocol/sdk-js'

import { generateAccount } from './generateAccount'
import { generateCredential } from '../claimer/generateCredential'
import { generateKeypairs } from './generateKeypairs'
import { generateLightDid } from '../claimer/generateLightDid'

export async function attestCredential(
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  credential: Kilt.ICredential,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<void> {
  const api = Kilt.ConfigService.get('api')

  // Get CType and root hash from the provided credential.
  const { cTypeHash, claimHash } = Kilt.Attestation.fromCredentialAndDid(
    credential,
    attesterDid
  )

  // Create the tx and authorize it.
  const tx = api.tx.attestation.add(claimHash, cTypeHash, null)
  const extrinsic = await Kilt.Did.authorizeTx(
    attesterDid,
    tx,
    signCallback,
    attesterAccount.address
  )

  // Submit the tx to write the attestation to the chain.
  console.log('Attester -> create attestation...')
  await Kilt.Blockchain.signAndSubmitTx(extrinsic, attesterAccount)
}

export async function attestingFlow(
  claimerDid: Kilt.DidUri,
  attesterAccount: Kilt.KiltKeyringPair,
  attesterDid: Kilt.DidUri,
  signCallback: Kilt.SignExtrinsicCallback
): Promise<Kilt.ICredential> {
  // First the claimer.
  const credential = generateCredential(claimerDid, {
    age: 27,
    name: 'Mia Musterfrau'
  })

  // ... send the request to the attester

  // The attester checks the attributes and attests the provided credential.
  await attestCredential(attesterAccount, attesterDid, credential, signCallback)

  // Return the generated credential.
  return credential
}

// Don't execute if this is imported by another file.
if (require.main === module) {
  ;(async () => {
    envConfig()

    try {
      await Kilt.connect(process.env.WSS_ADDRESS as string)

      const attesterAccountMnemonic = process.env
        .ATTESTER_ACCOUNT_MNEMONIC as string
      const { account: attesterAccount } = generateAccount(
        attesterAccountMnemonic
      )

      const attesterDidMnemonic = process.env.ATTESTER_DID_MNEMONIC as string
      const { authentication, assertionMethod } =
        generateKeypairs(attesterDidMnemonic)
      const attesterDidUri = Kilt.Did.getFullDidUriFromKey(authentication)

      const claimerDidMnemonic = process.env.CLAIMER_DID_MNEMONIC as string
      const claimerDid = await generateLightDid(claimerDidMnemonic)

      const credential = await attestingFlow(
        claimerDid.uri,
        attesterAccount,
        attesterDidUri,
        async ({ data }) => ({
          signature: assertionMethod.sign(data),
          keyType: assertionMethod.type
        })
      )
      console.log('The claimer build their credential and now has to store it.')
      console.log('Add the following to your .env file. ')
      console.log(`CLAIMER_CREDENTIAL='${JSON.stringify(credential)}'`)
    } catch (e) {
      console.log('Error while going throw attesting workflow')
      throw e
    }
  })()
}
```
- Initially, the `Claimer` creates a `credential` and sends it to the `Attester`.
- The Attester checks the validity of the information within this `credential`.
- After verifying its validity, the Attester either rejects or approves it. If approved, it's written to the chain.
- Once written to the chain, the `Claimer` can share all the documents with the `verifier` whenever they wish.
:::
## Let's Run the Code!

To run the code, ensure you're in the `kilt-rocks` directory in the terminal, then execute the following command:

```terminal
yarn ts-node attester/attestCredential.ts
```

:::tip
You can now copy the generated `Credential` and use it to share with `Verifiers`.
:::

:::info Kudos to You!
You've completed the tasks as an `Attester`. You successfully created a `credential` and wrote the `attestation` hash value to the chain.

You're now ready to proceed with the `Verifier`.
:::