
import { parseConfig } from './src/utils/parser';

const testConfigs = [
  "10",
  "10 -> 20",
  "10 -> 20 -> 30",
  "10 -> 20 -> 30 -> 40",
];

testConfigs.forEach(config => {
  try {
    const stages = parseConfig(config);
    console.log(`Config: "${config}" -> Stages: ${stages.length}`);
  } catch (e) {
    console.error(`Config: "${config}" -> Error: ${e.message}`);
  }
});
