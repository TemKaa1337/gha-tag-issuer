import { GitHub } from "@actions/github/lib/utils";

export class PullRequestLabelProvider {
    private readonly octokit: InstanceType<typeof GitHub>;

    constructor(octokit: InstanceType<typeof GitHub>) {
        this.octokit = octokit;
    }

    public async provide(owner: string, repo: string, pullRequestNumber: number): Promise<string[]> {
        try {
            const response = await this.octokit.rest.pulls.get({
                owner: owner,
                repo: repo,
                pull_number: pullRequestNumber,
            });

            return response
                .data
                .labels
                .map(label => label.name || '')
                .filter((value: string) => value !== '');
        } catch (error) {
            console.error(`Error fetching labels for pull request ${pullRequestNumber}: ${error}.`);

            throw error;
        }
    }
}
