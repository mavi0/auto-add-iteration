
# Auto add iteraiton

Automatically add issues and pull requests to the current iteration of your [GitHub project](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) with this [Github Action](https://github.com/features/actions).

## Example

```yaml
on:
  schedule:
    # Runs "at 05:00, only on Monday" (see https://crontab.guru)
    - cron: '0 5 * * 1'

jobs:
  auto-add-iteration:
    name: Move to next iteration
    runs-on: ubuntu-latest

    steps:
    - uses: mavi0/auto-add-iteration@master
      with:
        owner: OrgName
        number: 1
        token: ${{ secrets.PROJECT_PAT }}
        iteration-field: Iteration
        new-iteration: current
        default-status: To Do
```

### Customizing Default Status

This workflow automatically assigns a default status (e.g., `To Do`) to items that do not have a status assigned. The default status can be specified using the `default-status` input parameter.

## Inputs

### `owner`
The account name of the GitHub organization.

### `number`
Project number as you see it in the URL of the project.

### `token`
Personal access token or an OAuth token. The `write:org` scope is required for read-write access.

### `iteration-field`
The name of your iteration field.

### `new-iteration`
Should be `current` or `next`.

### `default-status`
The default status to assign to items that do not already have a status. For example: `To Do`.

---

Based on a fork of [move-to-next-iteration](https://github.com/blombard/move-to-next-iteration) by [blombard](https://github.com/blombard) which is in turn made possible with thanks to [github-project](https://github.com/gr2m/github-project) by (gr2m)[https://github.com/gr2m].