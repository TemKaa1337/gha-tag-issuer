import { GitHub } from '@actions/github/lib/utils';

export class CommitManager {
    private readonly octokit: InstanceType<typeof GitHub>;

    constructor(octokit: InstanceType<typeof GitHub>) {
        this.octokit = octokit;
    }

    public async latest(owner: string, repo: string): Promise<
        {
            message: string,
            sha: string
        }> {
        try {
            const response = await this.octokit.rest.repos.listCommits(
                {
                    owner: owner,
                    repo: repo,
                    per_page: 1,
                }
            );

            const commit = response.data[0];

            if (!commit) {
                throw new Error('Cannot create a tag in empty repository.');
            }

            return {sha: commit.sha, message: commit.commit.message};
        } catch (error) {
            console.error(`Error fetching the latest tag: ${error}.`);

            throw error;
        }
    }
}
