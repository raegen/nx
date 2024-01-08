# NX

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action provides the means to use [remote cache](https://nx.dev/ci/features/remote-cache) enabled [NX](https://nx.dev/) CLI in your GitHub Actions workflows, with @actions/cache as the provider.

It relies upon and uses the existing NX infrastructure, meaning all the configuration is done through the normal NX ecosystem.
All operations are cached by default, otherwise respecting the value set for specific target.cache option.

## Usage

Usage is straight-forward, just use the action as you would use the NX CLI, through the `nx` input specifying the NX command and arguments to run (with).
    
```yaml
- uses: @raegen/nx
  with:
    nx: run-many --target=build
```

### Inputs
`nx` The NX command and args to run. Defaults to `--help`. 

Example(s):
```yaml
 - uses: @raegen/nx
      with:
         nx: run-many --target=build # or
         nx: build my-app # or
         nx: affected --target=build # or
         nx: ...
```
`cacheDirectory` Defines where the local cache is stored. Defaults to `.nx/cache/remote`.

Example(s):
```yaml
 - uses: @raegen/nx
   with:
      nx: ...
      cacheDirectory: .nx/cache/remote # or
      cacheDirectory: someotherdir
```
