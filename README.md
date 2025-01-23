# A GitHub action, that issues a new tag and pushes it into your repository.

## Usage:
```yml
# .github/workflows/issue-tag.yml
name: Publish new tag
on:
  pull_request:
    types:
      - closed
    branches:
      - master

jobs:
  issue-tag:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-22.04
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.merge_commit_sha }}
          fetch-depth: '0'

      - name: Increase version and issue a tag
        uses: temkaa1337/tag-issuer@v1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          WITH_VERSION: true
          DEFAULT_INCREMENT: 'patch'
          MAJOR_LABELS: |-
            major
            bc-break
          MINOR_LABELS: |-
            minor
            enhancement
          PATCH_LABELS: |-
            patch
            bug
```

# Allowed inputs:
##### 1. GITHUB_TOKEN
Required. Your github token.

##### 2. WITH_VERSION
Optional (defaults `true`). If set to `true`, this job will append `v` to all the tags, if set to `false`, just new version
will be generated without `v` prefix.

##### 3. DEFAULT_INCREMENT
Optional (defaults `patch`, allowed values: `patch`, `minor`, `major`).  
If set to `patch`, only the latest number will be incremented `0.0.X`.  
If set to `minor`, the middle number will be incremented `0.X.0`.  
If set to `major`, the first number will be incremented `X.0.0`.

##### 4. MAJOR_LABELS
Optional (defaults `major`, `bc-break`). This is a list of PR labels, if any of them is found, the major version will be incremented.

##### 5. MINOR_LABELS
Optional (defaults `minor`, `enhancement`). This is a list of PR labels, if any of them is found, the minor version will be incremented.

##### 6. PATCH_LABELS
Optional (defaults `patch`, `bug`). This is a list of PR labels, if any of them is found, the patch version will be incremented.

Note: the order of label matching is - major, minor, patch. This means, that if PR has multiple labels, from major, minor and patch
sections, the major label takes precedence.

# Outputs:
##### 1. previous_tag
A previous latest tag of the repository.

##### 2. new_tag
The new generated tag.

# Limitations:  
Currently, this action supports only issuing tags from merged pull requests, other behaviour currently is not allowed.
