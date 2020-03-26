import { LogLevelsEnum } from '../../models/log-levels.enum';
import { LoggerConfig } from './logger-config';

describe('LoggerConfig', () => {
  test(`When nothing is given as config set LogLevelsEnum.DEBUG as default`, () => {
    const config = LoggerConfig.createInstance();

    expect(config.logLevel).toBe(LogLevelsEnum.DEBUG);
  });

  describe('Assing correct loggerLevel from initialConfig', () => {
    const logLevelKeys = Object.keys(LogLevelsEnum).filter(levelKey => isNaN(parseInt(levelKey, 10)));

    test.each(logLevelKeys)('assigns %i', (levelKey: any) => {
      const wantedLevel = (LogLevelsEnum[levelKey] as unknown) as LogLevelsEnum;
      const config = LoggerConfig.createInstance({ logLevel: wantedLevel });

      expect(config.logLevel).toBe(wantedLevel);
    });
  });
});
