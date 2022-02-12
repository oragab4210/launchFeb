import React, { useEffect, useRef, useState, useCallback } from "react";

// import { create } from "ipfs-http-client";
// const ipfs = create({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const useIPFS = () => {
  const [ipfsBuffer, setIPFSBuffer] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  /* ----------------------------------IPFS--------------------------------- */
  const captureFile = async (e) => {
    e.preventDefault();
    console.log("File captured");
    const file = e.target.files[0];
    const reader = new window.FileReader();
    console.log(file);
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setIPFSBuffer(Buffer(reader.result));
      console.log("Buffer", Buffer(reader.result));
    };
    return ipfsBuffer;
  };
  // const captureJSON = () => {
  //   // e.preventDefault();
  //   console.log("File captured");
  //   const stuff = data;
  //   const str = JSON.stringify(stuff);
  //   const bytes = new TextEncoder().encode(str);
  //   const blob = new Blob([bytes], {
  //     type: "application/json;charset=utf-8",
  //   });
  //   const reader = new window.FileReader();
  //   reader.readAsArrayBuffer(blob);
  //   reader.onloadend = () => {
  //     setIPFSBuffer(Buffer(reader.result));
  //     console.log("Buffer", Buffer(reader.result));
  //   };
  //   return Buffer(reader.result);
  // };
  // const ipfsSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Submitting to IPFS");

  //   const result = await ipfs.add(ipfsBuffer);
  //   console.log("IPFS RESULT:", result.path);
  //   const picHash = result.path;
  //   console.log(result.path);
  //   return `https://ipfs.infura.io/ipfs/${picHash}`;
  //   /* -------------------------------------------------------------------------- */
  //   /* --------------------------- store on blockchain -------------------------- */
  //   // Step 2: store file on blockchain
  //   //  await contract.methods
  //   //  .set(picHash)
  //   //  .send({
  //   //    from: account,
  //   //  })
  //   //  .then((res) => setPichash(picHash));
  // };
  //   const renderIPFSImage = () => {
  //     return `https://ipfs.infura.io/ipfs/${picHash}`;
  // };
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const captureFileAndUploadToIPFS = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      console.log(url);
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  const uploadToIPFS = async (data) => {
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };
  /* -------------------------------------------------------------------------- */
  return {
    // web3Modal_address_abi,
    // ethers_address_abi,
    captureFile,
    // captureJSON,
    // ipfsSubmit,
    uploadToIPFS,
    captureFileAndUploadToIPFS,
  };
};

export default useIPFS;
