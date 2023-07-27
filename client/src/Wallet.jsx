import React, { useState, useEffect } from "react";
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [publicKey, setPublicKey] = useState("");

  async function fetchPublicKey(address) {
    try {
      const { data: { publicKey } } = await server.get(`/publicKey/${address}`);
      setPublicKey(publicKey || "Public key not found");
    } catch (error) {
      console.error("Error fetching public key:", error);
      setPublicKey("Error fetching public key");
    }
  }

  useEffect(() => {
    if (address) {
      fetchPublicKey(address);
    } else {
      setPublicKey("");
    }
  }, [address]);

  async function onChange(evt) {
    const newAddress = evt.target.value;
    setAddress(newAddress);
    const { data: { balance } } = await server.get(`/balance/${newAddress}`)
    setBalance(balance);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
        <div className="publicKey">Public Key: {publicKey}</div>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
