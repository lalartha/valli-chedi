/**
 * Consequence Formatter
 * 
 * Formats the raw consequence data into the enhanced, humor-injected 
 * structure required by the frontend, as defined in the plan.
 */

/**
 * Get humorous severity status and messages based on Valli count.
 * @param {number} valliCount - The user's active valli count (or total added)
 * @returns {Object} { status, messages }
 */
export function getValliPressure(valliCount) {
  if (valliCount <= 7) {
    return {
      status: "Still manageable.",
      messages: [
        "Nothing serious yet.",
        "The chedi is minding its own business.",
        "You can probably explain this."
      ]
    };
  }
  if (valliCount <= 15) {
    return {
      status: "Getting noticeable.",
      messages: [
        "Someone is going to ask why you're going again.",
        "Okay... this needs some explanation.",
        "Maybe don't add another one immediately."
      ]
    };
  }
  if (valliCount <= 25) {
    return {
      status: "Getting complicated.",
      messages: [
        "This is becoming a proper valli.",
        "You already have enough going on.",
        "Tonight's conversation may be longer than expected.",
        "Good luck explaining this one."
      ]
    };
  }
  if (valliCount <= 40) {
    return {
      status: "Serious Valli.",
      messages: [
        "Prepare yourself.",
        "There's definitely going to be a talk tonight.",
        "You might want to think about what you're going to say.",
        "Achan has entered the situation."
      ]
    };
  }
  
  return {
    status: "Full Valli Chedi.",
    messages: [
      "This is no longer one problem.",
      "This is a collection of problems.",
      "At this point the chedi has its own responsibilities.",
      "Good luck. Seriously."
    ]
  };
}

/**
 * Get exaggerated home consequence messages based on severity and activity traits.
 */
function getHomeImpact(vallisCreated, activeValliCount) {
  const isOvernight = vallisCreated.some(v => v.category === 'OVERNIGHT');
  const isTravel = vallisCreated.some(v => v.category === 'TRAVEL');
  
  let level = "LOW";
  let messages = [];

  if (activeValliCount > 40) {
    level = "CRITICAL";
    messages = [
      "HOME STATUS: CRITICAL",
      "One more programme and the family group chat may become involved.",
      "Possible outcomes: Long talk, temporary cancellation of future plans."
    ];
  } else if (activeValliCount > 25 || (isOvernight && activeValliCount > 15)) {
    level = "CONCERNING";
    messages = [
      "HOME STATUS: CONCERNING",
      "You're already occupied. You added another thing. Achan knows. Good luck.",
      "Tonight's talk has entered the schedule.",
      "Please prepare your explanation."
    ];
  } else if (activeValliCount > 10 || isOvernight || isTravel) {
    level = "MEDIUM";
    messages = [
      "Achan is probably not going to be impressed.",
      "Be prepared for a serious talk tonight.",
      "You may want to reach home before the explanation begins."
    ];
  } else {
    level = "LOW";
    messages = [
      "You can probably get away with this one.",
      "Just don't ask for anything else this week."
    ];
  }

  return { level, messages };
}

/**
 * Determine if a warning popup should be shown based on context.
 */
function getWarning(activity, vallisCreated, monthlyValliCount, activeValliCount) {
  const valliAddedScore = vallisCreated.reduce((sum, v) => sum + (v.growthPoints || v.rawScore || 5), 0);
  const isOvernight = activity.overnight;
  
  let required = false;
  let title = "Do you really need this Valli?";
  let message = "You're already occupied.";
  let intensity = "NORMAL";

  if (monthlyValliCount >= 3 && valliAddedScore >= 10) {
    required = true;
    if (isOvernight) {
      message = "You're adding another overnight. Remember the last time?";
    } else {
      message = `You already have ${monthlyValliCount} Vallis this month. You're already occupied.`;
    }
  }

  if (activeValliCount > 15 && valliAddedScore > 10) {
    required = true;
    intensity = "EXTREME";
    title = "🌿 YOUR CHEDI HAS A QUESTION";
    message = `You're already carrying ${activeValliCount} active Valli. This activity will add more. That means: ${activeValliCount + Math.floor(valliAddedScore / 2)} Valli. Are you absolutely sure?`;
  }

  if (activity.location && (activity.location.toLowerCase().includes('bangalore') || activity.location.toLowerCase().includes('bengaluru'))) {
    required = true;
    title = "Out of state again?";
    message = "This is definitely going to require an explanation.";
  }

  return { required, title, message, intensity };
}

/**
 * Format the raw consequence result into the EnhancedConsequenceData structure.
 */
export function formatConsequenceOutput(rawResult, userState) {
  const { activity, vallisCreated, collisions } = rawResult;
  const { activeVallis = 0, monthlyVallis = 0 } = userState;
  
  const projectedActive = activeVallis + vallisCreated.length;
  const pressure = getValliPressure(projectedActive);
  
  const formattedConsequences = vallisCreated.map(v => ({
    type: v.category ? v.category.toLowerCase() : 'other',
    points: v.growthPoints || v.rawScore || Math.round((v.severity || 1) * 1.5) || 5,
    label: v.category || 'Other',
    description: v.description || v.title
  }));
  
  const homeImpact = getHomeImpact(vallisCreated, projectedActive);
  const valliAdded = formattedConsequences.reduce((sum, c) => sum + c.points, 0);
  const warning = getWarning(activity, vallisCreated, monthlyVallis, activeVallis);

  return {
    valliAdded,
    monthlyValli: monthlyVallis,
    activeValli: activeVallis,
    projectedActiveValli: projectedActive,
    severity: pressure.status,
    severityMessages: pressure.messages,
    consequences: formattedConsequences,
    homeImpact,
    warning
  };
}
