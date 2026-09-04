/**
 * Sync Personality Type inventory from Mobile → this repo + Liveaware.in.
 * Run: node sync-inventory.js && node build-index.js
 */
const fs = require('fs');
const path = require('path');

const mobileSrc = path.join(
  __dirname,
  '..',
  'LiveAware-Mobile-dpk',
  'src',
  'Screens',
  'PersonalityMapping',
  'PersonalityMappingData.js'
);
const liveawareOut = path.join(
  __dirname,
  '..',
  'Liveaware.in',
  'src',
  'lib',
  'compatibility-inventory.json'
);

const raw = fs.readFileSync(mobileSrc, 'utf8');
const traitsMatch = raw.match(/export const PERSONALITY_TRAITS = (\[[\s\S]*?\]);/);
const questionsMatch = raw.match(/export const PERSONALITY_QUESTIONS = (\[[\s\S]*?\]);/);

if (!traitsMatch || !questionsMatch) {
  console.error('Failed to parse PERSONALITY_TRAITS / PERSONALITY_QUESTIONS from Mobile.');
  process.exit(1);
}

const inventoryCjs = `/** Synced from Mobile PersonalityMappingData.js — run: node sync-inventory.js */
const PERSONALITY_TRAITS = ${traitsMatch[1]};

const PERSONALITY_QUESTIONS = ${questionsMatch[1]};

module.exports = { PERSONALITY_TRAITS, PERSONALITY_QUESTIONS };
`;

fs.writeFileSync(path.join(__dirname, '_inventory.cjs'), inventoryCjs);
const inv = require('./_inventory.cjs');

if (inv.PERSONALITY_TRAITS.length !== 11 || inv.PERSONALITY_QUESTIONS.length !== 44) {
  console.error(
    'Unexpected inventory size:',
    inv.PERSONALITY_TRAITS.length,
    inv.PERSONALITY_QUESTIONS.length
  );
  process.exit(1);
}

const json = JSON.stringify(
  { TRAITS: inv.PERSONALITY_TRAITS, QUESTIONS: inv.PERSONALITY_QUESTIONS },
  null,
  0
);
fs.writeFileSync(liveawareOut, json);

console.log(
  'Synced 11 traits / 44 questions → _inventory.cjs + Liveaware.in compatibility-inventory.json'
);
