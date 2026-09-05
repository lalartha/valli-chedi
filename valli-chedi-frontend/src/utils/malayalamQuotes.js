/**
 * Malayalam Quotes & Parental Dialogues for Valli Chedi
 */

export const ACTIVITY_POPUP_QUOTES = [
  'ഈ ആഴ്ച എങ്കിലും വീട്ടിൽ ഇരി.',
  'ഇതും കൂടി വേണമായിരുന്നോ?',
  'ഒന്ന് വീട്ടിൽ ഇരുന്നിട്ട് പോരേ?',
  'വീണ്ടും പരിപാടിയോ?',
  'നിനക്ക് വീട്ടിൽ ഇരിക്കാൻ പറ്റൂലെ?',
];

export function getRandomActivityQuote() {
  const index = Math.floor(Math.random() * ACTIVITY_POPUP_QUOTES.length);
  return ACTIVITY_POPUP_QUOTES[index];
}

export const VALLI_STAGE_QUOTES = {
  1: 'മണ്ണിൽ അടങ്ങി ഒതുങ്ങി ഇരുന്നോണം.',
  3: 'തുടങ്ങിയിട്ടേ ഉള്ളൂ... നോക്കിക്കോ.',
  5: 'ലാസ്റ്റ് കിടന്ന് മൊങ്ങാൻ ആ നോക്കിക്കോ.',
  7: 'വയ്യാത്ത പട്ടി കയ്യാല കേറുമ്പോൾ പഠിക്കും.',
  9: 'എന്റെ പൊന്നു പെണ്ണേ, നാശത്തിലേക്കാ നിന്റെ പോക്ക്. നിർത്തിക്കോ നീ.',
  10: 'നാട്ടിലുള്ള വള്ളി മൊത്തം പിടിച്ചൊള്ളാൻ നിനക്ക് നേർച്ച വല്ലതും ഉണ്ടോ?',
};

export const ACHAN_SCORE_REMARK = 'ഇതിന് ഗപ്പ് ഒന്നും ഇല്ലാതെ ആയിപ്പോയി ഇല്ലേ നിനക്ക് പണ്ടേ കിട്ടിയേനെ.';
