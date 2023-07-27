const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { bytesToHex:toHex } = require('ethereum-cryptography/utils');
const { sha256 } = require('ethereum-cryptography/sha256');

app.use(cors());
app.use(express.json());

const balances = {
  "0x0130557d1146336b5d6e7a99704ece81f669d78e": 100,
  // Private Key:  e2f305dff91ab4b5cc5524817de7b67cd837449b9efd73cf3fcd34bc85156990
  // Public Key:  03f84caf7d54f26fa89663030f8054ecb5c6e3973ceb8ad9dde3fd67e8e1a2fac5
  "0xb23a29626143cab22a14c2cc449b95752ea130d0": 50,
  // Private Key:  5ec88183fab7bf5eee703792cf0b483dcbabaaad9b25a5f8d0f9bdb97688f620
  // Public Key:  02dc271b5c93d9b465bc6287c5aa2a09d46e2b695a83106a2355ff127868776188
  "0x5c840cdc7fd5ee3deade3b945f669186a8c38bae": 75,
  // Private Key:  a954a2a17ea20f6e1308df1b633749fc3de2f858c06c778895712f458bfa91b3
  // Public Key:  03e17da18195dc92c4e527a73eb2b304bd912e02cb2cdecb8eeae3d6aada768b8b
};

const publicKeys = {
  "0x0130557d1146336b5d6e7a99704ece81f669d78e": "03f84caf7d54f26fa89663030f8054ecb5c6e3973ceb8ad9dde3fd67e8e1a2fac5",
  "0xb23a29626143cab22a14c2cc449b95752ea130d0": "02dc271b5c93d9b465bc6287c5aa2a09d46e2b695a83106a2355ff127868776188",
  "0x5c840cdc7fd5ee3deade3b945f669186a8c38bae": "03e17da18195dc92c4e527a73eb2b304bd912e02cb2cdecb8eeae3d6aada768b8b"
}

const privateKeys = {
  "0x0130557d1146336b5d6e7a99704ece81f669d78e": "e2f305dff91ab4b5cc5524817de7b67cd837449b9efd73cf3fcd34bc85156990",
  "0xb23a29626143cab22a14c2cc449b95752ea130d0": "02dc271b5c93d9b465bc6287c5aa2a09d46e2b695a83106a2355ff127868776188",
  "0x5c840cdc7fd5ee3deade3b945f669186a8c38bae": "03e17da18195dc92c4e527a73eb2b304bd912e02cb2cdecb8eeae3d6aada768b8b"
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/publicKey/:address", (req, res) => {
  const { address } = req.params;
  const publicKey = publicKeys[address]
  res.send({ publicKey });
})

app.post("/send", (req, res) => {
  const { sender, recipient, amount, privateKey, signature, msgHash } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  if (privateKeys[sender] === privateKey) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "You don't own this address!"});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
