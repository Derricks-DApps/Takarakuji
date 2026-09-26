import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "../styles/takarakuji-landing.css"
import React, { Fragment, useEffect, useRef, useState } from "react";
import GraphicBackground from "../components/GraphicBackground";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import TakarakujiLanding from "./TakarakujiLanding";
// const provider = new ethers.JsonRpcProvider('https://8545-derricksope-scaffoldeth-yyiqw900tvt.ws-us92.gitpod.io');
const wallet = false; // TODO: remove this is just for testing
const Index = () => {

  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  console.log("address: ", address);

  return (
    <>
      {/* <br /> */}
      {/* <div style={{
        position: "absolute",
        top: "50%",
        margin: "auto",
        width: "100%",
        textAlign: "center"
      }}>
        {!isConnected
          ? <>
            <Box sx={{ flexGrow: 1 }}>
              <Button style={{
                width: "25em",
                height: "3em",
                backgroundColor: "#ff5252",
                borderColor: "black",
                color: "white",
                boxShadow: "5px 5px #333333"
              }}
                onClick={() => { connect(); console.log("connected: ", isConnected) }}
                variant="outlined"><strong>Connect Wallet</strong></Button>
            </Box>
          </>
          : <>
            
            <Box sx={{ flexGrow: 1 }}>
              <Button style={{
                width: "25em",
                height: "3em",
                backgroundColor: "#ff5252",
                borderColor: "black",
                color: "white",
                boxShadow: "5px 5px #333333"
              }}
                href="/games"
                variant="outlined"><strong>Try It</strong></Button>
            </Box>
          </>
        }

      </div> */}
          
      <TakarakujiLanding/>
    </>

  );
};

export default Index;