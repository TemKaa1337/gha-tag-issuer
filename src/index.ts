import { getInput, setOutput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { PullRequestTagIssuer } from "./Service/PullRequestTagIssuer";

// TODO: create a separate workflow with specific tag creation
const token = getInput('GITHUB_TOKEN');

const octokit = getOctokit(token);

const pullRequestTagIssuer = new PullRequestTagIssuer(octokit);

export async function run(): Promise<void> {
    const output = await pullRequestTagIssuer.issue(context);

    setOutput('previous_tag', output.previousTag);
    setOutput('new_tag', output.newTag);
}

if (!process.env.JEST_WORKER_ID) {
    run();
}
