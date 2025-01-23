import { VersionManager } from "../../src/Service/VersionManager";

describe('increment', () => {
    const versionManager = new VersionManager();

    it('should create first patch version', async () => {
        const tagWithVersion = await versionManager.increment(null, 'patch', true);
        expect(tagWithVersion).toBe('v0.0.1');

        const tagWithoutVersion = await versionManager.increment(null, 'patch', false);
        expect(tagWithoutVersion).toBe('0.0.1');
    });
    it('should create first minor version', async () => {
        const tagWithVersion = await versionManager.increment(null, 'minor', true);
        expect(tagWithVersion).toBe('v0.1.0');

        const tagWithoutVersion = await versionManager.increment(null, 'minor', false);
        expect(tagWithoutVersion).toBe('0.1.0');
    });
    it('should create first major version', async () => {
        const tagWithVersion = await versionManager.increment(null, 'major', true);
        expect(tagWithVersion).toBe('v1.0.0');

        const tagWithoutVersion = await versionManager.increment(null, 'major', false);
        expect(tagWithoutVersion).toBe('1.0.0');
    });
    it('should increment patch version', async () => {
        const tag1 = await versionManager.increment('0.0.111', 'patch', true);
        expect(tag1).toBe('0.0.112');

        const tag2 = await versionManager.increment('v0.1.0', 'patch', true);
        expect(tag2).toBe('v0.1.1');

        const tag3 = await versionManager.increment('v1.1.0', 'patch', true);
        expect(tag3).toBe('v1.1.1');

        const tag4 = await versionManager.increment('1.1.0', 'patch', true);
        expect(tag4).toBe('1.1.1');
    });
    it('should increment minor version', async () => {
        const tag1 = await versionManager.increment('0.0.111', 'minor', true);
        expect(tag1).toBe('0.1.111');

        const tag2 = await versionManager.increment('v0.1.0', 'minor', true);
        expect(tag2).toBe('v0.2.0');

        const tag3 = await versionManager.increment('v1.1.0', 'minor', true);
        expect(tag3).toBe('v1.2.0');

        const tag4 = await versionManager.increment('1.1.0', 'minor', true);
        expect(tag4).toBe('1.2.0');
    });
    it('should increment major version', async () => {
        const tag1 = await versionManager.increment('0.0.111', 'major', true);
        expect(tag1).toBe('1.0.111');

        const tag2 = await versionManager.increment('v0.1.0', 'major', true);
        expect(tag2).toBe('v1.1.0');

        const tag3 = await versionManager.increment('v1.1.0', 'major', true);
        expect(tag3).toBe('v2.1.0');

        const tag4 = await versionManager.increment('1.1.0', 'major', true);
        expect(tag4).toBe('2.1.0');
    });

    const invalidTagFormats = [
        ['v1'],
        ['v1.0'],
        ['v1.0..'],
        ['v1.0.1-alpha'],
        ['1.0.1-alpha.1'],
        ['1.0.1-alpha'],
        ['1.0.'],
    ];
    it.each(invalidTagFormats)('should fail due to incorrect tag format', async (tag: string) => {
        try {
            await versionManager.increment(tag, 'patch', true);
        } catch (error: any) {
            expect(error.message).toBe('Unsupported tag format, expected: ^v?[0-9]+\\.[0-9]+\\.[0-9]+$.')
        }
    });
});
