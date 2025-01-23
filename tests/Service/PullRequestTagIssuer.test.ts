import { getInput } from "@actions/core";
import { PullRequestTagIssuer } from "../../src/Service/PullRequestTagIssuer";
import { Context } from "@actions/github/lib/context";

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
}));

describe('issue', () => {
    it('issues next tag', async () => {
        const mockOctokit = {
            rest: {
                pulls: {
                    get: (
                        request: {
                            owner: string,
                            repo: string,
                            pull_number: number
                        }
                    ) => {
                        expect(request.owner).toBe('owner');
                        expect(request.repo).toBe('repo');
                        expect(request.pull_number).toBe(1011);

                        return {data: {labels: [{name: 'patch'}, {name: 'minor'}, {name: 'major'}]}}
                    },
                },
                repos: {
                    listTags: () => {
                        return {data: []}
                    },
                    listCommits: () => {
                        return {data: [{sha: 'sha256', commit: {message: 'message'}}]};
                    },
                },
                git: {
                    createTag: (
                       request: {
                           owner: string,
                           repo: string,
                           tag: string,
                           message: string,
                           object: string,
                           type: string
                       },
                    ) => {
                        expect(request.owner).toBe('owner');
                        expect(request.repo).toBe('repo');
                        expect(request.tag).toBe('v1.0.0');
                        expect(request.message).toBe('message');
                        expect(request.object).toBe('sha256');
                        expect(request.type).toBe('commit');

                        return {data: [{sha: 'sha256', commit: {message: 'message'}}]};
                    },
                    createRef: () => {
                        return {}
                    },
                }
            },
        };

        // jest.mock("@actions/github", () => ({
        //     context: {
        //         payload: {
        //             pull_request: {
        //                 number: 1011,
        //             },
        //         },
        //         repo: {
        //             owner: "owner",
        //             repo: "repo",
        //         },
        //     },
        //     getOctokit: jest.fn(),
        // }));

        const context = {
            payload: {
                pull_request: {
                    number: 1011,
                },
            },
            repo: {
                owner: "owner",
                repo: "repo",
            },
        };

        (getInput as jest.Mock)
            .mockReturnValueOnce('true')
            .mockReturnValueOnce('patch')
            .mockReturnValueOnce('major')
            .mockReturnValueOnce('minor')
            .mockReturnValueOnce('patch')

        // @ts-ignore
        const pullRequestTagIssuer = new PullRequestTagIssuer(mockOctokit);

        await pullRequestTagIssuer.issue(context as Context)
    });
});
