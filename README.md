# react-lightning-boilerplate
Boilerplate repository for developing Visualforce pages With React.

This provides the basic structure needed for adding React Components to your Salesforce Org via Webpack and SFDX.

## Setup

1. Fork this repo.
1. `clone` your forked repo with `git clone <yourRepoUrl>`
1. [Install sfdx cli](https://developer.salesforce.com/tools/sfdxcli)
1. [Install Node](https://nodejs.org/en/)
1. `cd` into the project directory and run `yarn` or `npm install`
1. I would recommend installing [Run on Save](https://marketplace.visualstudio.com/items?itemName=pucelle.run-on-save) so the app will build and deploy on every save. 

## Quick Start

1. Go through Setup
1. Set a default sfdx username with `sfdx force:config:set defaultusername=yourscratchorgalias`
1. Run `npm run deploy`
1. Open your scratch org.
1. Go to your visualforce pages.
1. Open ReactPoc
1. Click Preview to see the poc

## Available Commands

`npm run deploy`
