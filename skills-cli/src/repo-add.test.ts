import { beforeEach, describe, expect, it, vi } from 'vitest';
import { selectSkills } from './repo-add.js';
import * as searchMultiselectModule from './prompts/search-multiselect.js';
import type { Skill } from './types.js';

vi.mock('./prompts/search-multiselect.js');

describe('repo add skill selection', () => {
  const skills: Skill[] = [
    {
      name: 'create-design-system-rules',
      description: 'Create Figma design system rules',
      path: '/tmp/source/create-design-system-rules',
    },
    {
      name: 'implement-design',
      description: 'Implement Figma designs',
      path: '/tmp/source/implement-design',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prompts for skills when multiple are discovered and no skill filter is provided', async () => {
    vi.mocked(searchMultiselectModule.searchMultiselect).mockResolvedValue(['implement-design']);

    const selected = await selectSkills(skills, {});

    expect(searchMultiselectModule.searchMultiselect).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Which skills do you want to install?',
        required: true,
      })
    );
    expect(selected.map((skill) => skill.name)).toEqual(['implement-design']);
  });

  it('keeps explicit skill selection non-interactive', async () => {
    const selected = await selectSkills(skills, { skill: ['create-design-system-rules'] });

    expect(searchMultiselectModule.searchMultiselect).not.toHaveBeenCalled();
    expect(selected.map((skill) => skill.name)).toEqual(['create-design-system-rules']);
  });
});
