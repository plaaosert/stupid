const levelExperience = {
  1: 0,
  2: 100,
  3: 200,
  4: 300,
  5: 500,
  6: 800,
  7: 1300,
  8: 2100,
  9: 3400,
  10: 5500,
  11: 8900,
  12: 15400,
  13: 24300,
  14: 39700,
  15: 64000,
  16: 103400,
  17: 167400,
  18: 270800,
  19: 438200,
  20: 709000,
  21: 1145200,
  22: 1854200,
  23: 2999400,
  24: 4853600,
  25: 7853000,
};

export const exp = {
  getLevelAtExperience(experience: number): number {
    let level = 1;
    while (
      levelExperience[level] !== undefined &&
      experience >= this.getTotalExperienceForLevel(level + 1)
    ) {
      level++;
    }
    return level;
  },

  getExperienceForLevel(level: number): number {
    if (level <= 1) return 0;
    return levelExperience[level] ?? levelExperience[this.getMaxLevel()];
  },

  getTotalExperienceForLevel(level: number): number {
    let totalExperienceForLevel = 0;
    for (let i = 1; i <= level; i++) {
      if (levelExperience[i] === undefined) break;
      totalExperienceForLevel += levelExperience[i];
    }
    return totalExperienceForLevel;
  },

  getMaxLevel(): number {
    let level = 1;
    while (levelExperience[level + 1]) {
      level++;
    }
    return level;
  },
};
