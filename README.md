# Takarakuji

Japanese Scratch off ticket

## Bounties
  - ENS
  - 1inch
    
## Architecture:
```mermaid
graph TD
  subgraph Client
    U[User Browser]
    AMP[Takarakuji dApp (Amplify)]
    LOC[Takarakuji dApp (localhost)]
  end

  subgraph Backend (AWS)
    APIGW[API Gateway: /default/takarakujiApiLambda]
    LAMBDA[Go Lambda (bootstrap, AL2023)]
    CW[CloudWatch Logs]
    CS[CloudShell (build/deploy)]
  end

  subgraph Web3 / Identity
    ENS[ENS (names / records)]
    WORLDID[World ID / IDKit]
    ETH[Ethereum Smart Contracts]
  end

  subgraph Dev / Meta
    GH[GitHub: Derricks-DApps/Takarakuji]
    YT[YouTube: Bloom Filters]
    DOC_ENS[ENS Quickstart Docs]
    DOC_WORLD[World ID Docs]
    GO_DL[Go Releases]
    ETHGLOBAL[ETHGlobal Tokyo 2026 + Showcase]
  end

  U --> AMP
  U --> LOC

  AMP --> APIGW
  LOC --> APIGW

  APIGW --> LAMBDA
  LAMBDA --> ETH
  LAMBDA --> ENS
  LAMBDA --> WORLDID
  LAMBDA --> CW

  CS --> LAMBDA

  GH --> AMP
  GH --> LOC
  GH --> LAMBDA

  DOC_ENS --> ENS
  DOC_WORLD --> WORLDID
  GO_DL --> LAMBDA

  AMP --> ETHGLOBAL
```







