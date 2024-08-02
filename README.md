# Solidity Template

[![Test](https://github.com/NpoolPlatform/solidity-template/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/NpoolPlatform/solidity-template/actions/workflows/main.yml)

## Build

```
## Install node 18 and nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install lts/hydrogen
```

```
yarn install:slither
yarn install
yarn compile
yarn test
yarn slither
yarn coverage
```

## Todo

- [ ] Deployment scripts
- [ ] Unit tests framework
- [ ] Contract debugger
- [ ] Convert etherscan-verify.js to typescript

## Best Practices

- [Certik Best Practices](https://www.certik.com/zh-CN/resources/blog/FnfYrOCsy3MG9s9gixfbJ-upgradeable-proxy-contract-security-best-practices)
- [OpenZeppelin Wizard](https://wizard.openzeppelin.com/#custom)
- [OpenZeppelin Proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy)
- [ConsenSys Best Practices](https://github.com/ConsenSys/smart-contract-best-practices/blob/master/README-zh.md)
- [Solidity Attack Methods](https://github.com/slowmist/Knowledge-Base/blob/master/translations/solidity-security-comprehensive-list-of-known-attack-vectors-and-common-anti-patterns_zh-cn.md)
- [Chainlink How to Audit Smart Contract](https://blog.chain.link/how-to-audit-smart-contract-zh/)

## Solidity应用的部署方式

- 第一次主网部署后，Proxy地址将被固化到初始代码和部署数据库
- 如果升级部署过程中发现Proxy地址与固化地址不一致，部署终止
- ProxyAdmin的owner默认被设置为多签地址，实作上，该地址的其中一个地址在线存储，用于任意管理员发起升级proposation，其余地址应由不同管理员离线持有，通过dashboard签名同意或拒绝升级proposation
- Dashboard应支持连接钱包签名提交，也应支持管理员离线签名后copy签名结果提交

## Solidity应用的要点

- 单元测试应覆盖全部用例，并全部测试通过
- 单元测试应100%覆盖合约代码与分支，并全部测试通过
- 手动回归测试应覆盖全部公开接口
- 所有合约攻击手段都应该有对应测试用例覆盖
