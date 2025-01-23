import { GitHub } from '@actions/github/lib/utils';
import { getInput } from "@actions/core";
import { TagManager } from "./TagManager";
import { VersionManager } from "./VersionManager";
import { PullRequestLabelProvider } from "../Provider/PullRequestLabelProvider";
import { CommitManager } from "./CommitManager";
import { ConfiguredLabelProvider } from "../Provider/ConfiguredLabelProvider";
import { Context } from "@actions/github/lib/context";

export class PullRequestTagIssuer {
    private readonly tagManager: TagManager;
    private readonly versionManager: VersionManager;
    private readonly pullRequestLabelProvider: PullRequestLabelProvider;
    private readonly commitManager: CommitManager;
    private readonly configuredLabelProvider: ConfiguredLabelProvider;

    constructor(octokit: InstanceType<typeof GitHub>) {
        this.tagManager = new TagManager(octokit)
        this.versionManager = new VersionManager();
        this.pullRequestLabelProvider = new PullRequestLabelProvider(octokit)
        this.configuredLabelProvider = new ConfiguredLabelProvider();
        this.commitManager = new CommitManager(octokit)
    }

    public async issue(context: Context): Promise<{previousTag: string|null, newTag: string}> {
        const withVersion = getInput('WITH_VERSION') === 'true';
        const defaultIncrement = getInput('DEFAULT_INCREMENT') as 'patch' | 'minor' | 'major';

        const repoInfo = context.repo

        const pullRequestLabels = await this.pullRequestLabelProvider.provide(
            repoInfo.owner,
            repoInfo.repo,
            await this.getPullRequestNumber(context)
        )

        const configuredLabels = await this.configuredLabelProvider.provide();

        const incrementMode = await this.getIncrementMode(
            pullRequestLabels,
            configuredLabels,
            defaultIncrement
        );

        const latestTag = await this.tagManager.latest(repoInfo.owner, repoInfo.repo);

        const nextTag = await this.versionManager.increment(latestTag, incrementMode, withVersion);

        const latestCommit = await this.commitManager.latest(repoInfo.owner, repoInfo.repo);

        await this.tagManager.create(repoInfo.owner, repoInfo.repo, nextTag, latestCommit);

        return {previousTag: latestTag, newTag: nextTag};
    }

    private async getIncrementMode(
        pullRequestLabels: string[],
        configuredLabels: {
            major: string[],
            patch: string[],
            minor: string[]
        },
        defaultIncrement: 'major' | 'minor' | 'patch'
    ): Promise<'major' | 'minor' | 'patch'> {
        for (const [key, labels] of Object.entries(configuredLabels)) {
            for (const label in labels) {
                if (label in pullRequestLabels) {
                    // @ts-ignore
                    return key;
                }
            }
        }

        return defaultIncrement;
    }

    private async getPullRequestNumber(context: Context): Promise<number> {
        const pullRequest = context.payload.pull_request;

        if (!pullRequest) {
            throw new Error('This action can be used only on Pull Request merge.');
        }

        return pullRequest.number;
    }
}
