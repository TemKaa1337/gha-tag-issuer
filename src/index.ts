import { getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { PullRequestTagIssuer } from "./Service/PullRequestTagIssuer";

// TODO: create a separate workflow with specific tag creation
// TODO: get pull request number from event?
const token = getInput('GITHUB_TOKEN');

const octokit = getOctokit(token);

const pullRequestTagIssuer = new PullRequestTagIssuer(octokit);

export async function run(): Promise<void> {
    await pullRequestTagIssuer.issue(context)
}
