import { simulateActivity } from './src/services/consequenceEngine.js';

async function testSimulate() {
  try {
    const res = await simulateActivity('d6b4ace3-fd10-44f1-bcba-6d0806439f16', {
      title: 'Test',
      category: 'PERSONAL',
      startTime: new Date().toISOString(),
      overnight: false
    });
    console.log(res);
  } catch (err) {
    console.error('CRASH:', err);
  }
}

testSimulate();
