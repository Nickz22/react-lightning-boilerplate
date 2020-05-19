# react-lightning-boilerplate
Boilerplate repository for developing Visualforce pages With React.

This provides the basic structure needed for adding React Components to your Salesforce Org via Webpack and SFDX. If you'd like to build & deploy on save (recommended), you can download the Run on Save VS Code Extension to do that.

## Setup

1. Fork this repo.
1. `clone` your forked repo with `git clone <yourRepoUrl>`
1. [Install sfdx cli](https://developer.salesforce.com/tools/sfdxcli)
1. [Install Node](https://nodejs.org/en/)
1. `cd` into the project directory and run `yarn` or `npm install`

## Quick Start

1. Go through Setup
1. Set a default scratch org with sfdx force:config:set defaultusername=scratch_org_alias
1. Run `yarn deploy`
1. Open your scratch org.
1. Go to your visualforce pages, find the ReactReduxBlog.page and click Preview.

## Available Commands

prefix with `yarn` or `npm run`.
example: `yarn build`

- `build` - runs webpack to bundle your React src.
- `deploy` - runs `build` and then pushes to your default scratch org

## Acknowledgements

This project was influenced by this post: [Lightning Container Component: Building Components with React, Angular, and Other Libraries](https://developer.salesforce.com/blogs/2018/04/lightning-container-component-building-components-with-react-angular-and-other-libraries.html).

### Eigen X
This project is developed and maintained by [@EigenX](https://twitter.com/eigenx). Have questions or need help with setup? [Email Us](mailto:info@eigenx.com)

## License
See `LICENSE`
