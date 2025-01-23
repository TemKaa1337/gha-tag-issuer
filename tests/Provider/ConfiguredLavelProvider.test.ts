import { ConfiguredLabelProvider } from "../../src/Provider/ConfiguredLabelProvider";
import { getInput } from "@actions/core";

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
}));

describe('provide', () => {
    const configuredLabelProvider = new ConfiguredLabelProvider();

    const mocks: [string, string, string, { patch: string[], minor: string[], major: string[] }][] = [
        [
            'patch',
            'minor',
            'major',
            {patch: ['patch'], minor: ['minor'], major: ['major']}
        ],
        [
            `
            patch
            patch2
            patch3
            `,
            `
            minor
            minor2
            minor3
            `,
            `
            major
            major2
            major3
            `,
            {
                patch: ['patch', 'patch2', 'patch3'],
                minor: ['minor', 'minor2', 'minor3'],
                major: ['major', 'major2', 'major3']
            }
        ],
        [
            `
            patch
            0
            
            
            patch3
            `,
            `
            minor
            1
            
            -
            minor2
            minor3
            `,
            `
            major
            major2
            major3
            
            a
            b
            `,
            {
                patch: ['patch', '0', 'patch3'],
                minor: ['minor', '1', '-', 'minor2', 'minor3'],
                major: ['major', 'major2', 'major3', 'a', 'b']
            }
        ],
    ];

    it.each(mocks)(
        'returns correct configured labels',
        async (
            patchMock: string,
            minorMock: string,
            majorMock: string,
            expectedLabels: { patch: string[], minor: string[], major: string[] }
        ) => {
            (getInput as jest.Mock)
                .mockReturnValueOnce(majorMock)
                .mockReturnValueOnce(minorMock)
                .mockReturnValueOnce(patchMock);

            const labels = await configuredLabelProvider.provide();
            expect(labels).toEqual(expectedLabels)
        }
    );
});
