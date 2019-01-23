const types = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'Release'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  'type-enum': [2, 'always', types]
};
