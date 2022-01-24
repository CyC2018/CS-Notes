.DS_Store
*.txt
!tencent13147342467085209222.txt
desktop.ini
---
title: Quickstart for GitHub Actions
intro: 'Try out the features of {% data variables.product.prodname_actions %} in 5 minutes or less.'
allowTitleToDifferFromFilename: true
redirect_from:
  - /actions/getting-started-with-github-actions/starting-with-preconfigured-workflow-templates
versions:
  fpt: '*'
  ghes: '*'
  ghae: '*'
  ghec: '*'
type: quick_start
topics:
  - Fundamentals
shortTitle: Quickstart
---

{% data reusables.actions.enterprise-beta %}
{% data reusables.actions.enterprise-github-hosted-runners %}

## Introduction

You only need a {% data variables.product.prodname_dotcom %} repository to create and run a {% data variables.product.prodname_actions %} workflow. In this guide, you'll add a workflow that demonstrates some of the essential features of {% data variables.product.prodname_actions %}. 

The following example shows you how {% data variables.product.prodname_actions %} jobs can be automatically triggered, where they run, and how they can interact with the code in your repository.

## Creating your first workflow

1. Create a `.github/workflows` directory in  your repository on {% data variables.product.prodname_dotcom %} if this directory does not already exist.
2. In the `.github/workflows` directory, create a file named `github-actions-demo.yml`. For more information, see "[Creating new files](/github/managing-files-in-a-repository/creating-new-files)."
3. Copy the following YAML contents into the `github-actions-demo.yml` file:
    {% raw %}
    ```yaml{:copy}
    name: GitHub Actions Demo
    on: [push]
    jobs:
      Explore-GitHub-Actions:
        runs-on: ubuntu-latest
        steps:
          - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
          - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
          - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
          - name: Check out repository code
            uses: actions/checkout@v2
          - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
          - run: echo "🖥️ The workflow is now ready to test your code on the runner."
          - name: List files in the repository
            run: |
              ls ${{ github.workspace }}
          - run: echo "🍏 This job's status is ${{ job.status }}."

    ```
    {% endraw %}
3. Scroll to the bottom of the page and select **Create a new branch for this commit and start a pull request**. Then, to create a pull request, click **Propose new file**.
    ![Commit workflow file](/assets/images/help/repository/actions-quickstart-commit-new-file.png)

Committing the workflow file to a branch in your repository triggers the `push` event and runs your workflow.

## Viewing your workflow results

{% data reusables.repositories.navigate-to-repo %}
{% data reusables.repositories.actions-tab %}
1. In the left sidebar, click the workflow you want to see.

   ![Workflow list in left sidebar](/assets/images/help/repository/actions-quickstart-workflow-sidebar.png)
1. From the list of workflow runs, click the name of the run you want to see.

   ![Name of workflow run](/assets/images/help/repository/actions-quickstart-run-name.png)
1. Under **Jobs** , click the **Explore-GitHub-Actions** job.

   ![Locate job](/assets/images/help/repository/actions-quickstart-job.png)
1. The log shows you how each of the steps was processed. Expand any of the steps to view its details.

   ![Example workflow results](/assets/images/help/repository/actions-quickstart-logs.png)
   
   For example, you can see the list of files in your repository:
   ![Example action detail](/assets/images/help/repository/actions-quickstart-log-detail.png)
   
## More starter workflows

{% data reusables.actions.workflow-template-overview %}

## Next steps

The example workflow you just added runs each time code is pushed to the branch, and shows you how {% data variables.product.prodname_actions %} can work with the contents of your repository. But this is only the beginning of what you can do with {% data variables.product.prodname_actions %}:

- Your repository can contain multiple workflows that trigger different jobs based on different events. 
- You can use a workflow to install software testing apps and have them automatically test your code on {% data variables.product.prodname_dotcom %}'s runners. 

{% data variables.product.prodname_actions %} can help you automate nearly every aspect of your application development processes. Ready to get started? Here are some helpful resources for taking your next steps with {% data variables.product.prodname_actions %}:

- "[Learn {% data variables.product.prodname_actions %}](/actions/learn-github-actions)" for an in-depth tutorial.
