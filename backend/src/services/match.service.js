/**
 * SkillSwap Matching Algorithm
 * Rule-based transparent scoring (max 100 points)
 *
 * Reciprocal Skill Match logic:
 * - User A teaches Python/SQL & wants React/Node.js
 * - User B teaches React/Node.js & wants Python/SQL
 */

const getSkillName = (entry) => {
  if (!entry) return '';
  if (entry.skill && typeof entry.skill === 'object' && entry.skill.name) return entry.skill.name;
  if (typeof entry.name === 'string') return entry.name;
  return '';
};

const getSkillObj = (entry) => {
  if (!entry) return null;
  if (entry.skill && typeof entry.skill === 'object') return entry.skill;
  return entry;
};

const calculateMatch = (currentUser, candidate) => {
  let score = 0;
  const reasons = [];

  const myTeachEntries = currentUser?.skillsToTeach || [];
  const myLearnEntries = currentUser?.skillsToLearn || [];
  const candidateTeachEntries = candidate?.skillsToTeach || [];
  const candidateLearnEntries = candidate?.skillsToLearn || [];

  // Skills I teach that candidate wants to learn
  const matchedTeachSkills = [];
  myTeachEntries.forEach((myTeach) => {
    const teachName = getSkillName(myTeach).toLowerCase().trim();
    if (!teachName) return;
    const matchInCandidateLearn = candidateLearnEntries.find((cLearn) => {
      const candidateLearnName = getSkillName(cLearn).toLowerCase().trim();
      return candidateLearnName && candidateLearnName === teachName;
    });
    if (matchInCandidateLearn) {
      const skillObj = getSkillObj(myTeach);
      if (skillObj && !matchedTeachSkills.some((s) => (s._id || s.name) === (skillObj._id || skillObj.name))) {
        matchedTeachSkills.push(skillObj);
      }
    }
  });

  // Skills candidate teaches that I want to learn
  const matchedLearnSkills = [];
  candidateTeachEntries.forEach((cTeach) => {
    const cTeachName = getSkillName(cTeach).toLowerCase().trim();
    if (!cTeachName) return;
    const matchInMyLearn = myLearnEntries.find((myLearn) => {
      const myLearnName = getSkillName(myLearn).toLowerCase().trim();
      return myLearnName && myLearnName === cTeachName;
    });
    if (matchInMyLearn) {
      const skillObj = getSkillObj(cTeach);
      if (skillObj && !matchedLearnSkills.some((s) => (s._id || s.name) === (skillObj._id || skillObj.name))) {
        matchedLearnSkills.push(skillObj);
      }
    }
  });

  const hasReciprocal = matchedTeachSkills.length > 0 && matchedLearnSkills.length > 0;
  const hasAnySkillMatch = matchedTeachSkills.length > 0 || matchedLearnSkills.length > 0;

  if (hasReciprocal) {
    score += 65; // Base 65 pts for reciprocal exchange match
    const extraSkillBonus = Math.min((matchedTeachSkills.length + matchedLearnSkills.length - 2) * 10, 15);
    score += Math.max(0, extraSkillBonus);
  } else if (hasAnySkillMatch) {
    score += 35; // Base 35 pts for 1-way skill match
  }

  // Generate clear human-readable reasons
  if (matchedTeachSkills.length > 0) {
    const teachNames = matchedTeachSkills.map((s) => s.name || 'Skill').join(', ');
    const candidateFirstName = candidate.name ? candidate.name.split(' ')[0] : 'they';
    reasons.push(`✓ You can teach ${teachNames}, which ${candidateFirstName} wants to learn.`);
  }

  if (matchedLearnSkills.length > 0) {
    const candidateFirstName = candidate.name ? candidate.name.split(' ')[0] : 'Partner';
    const learnNames = matchedLearnSkills.map((s) => s.name || 'Skill').join(', ');
    reasons.push(`✓ ${candidateFirstName} can teach ${learnNames}, which you want to learn.`);
  }

  // Availability Overlap (up to 10 pts)
  const myDays = (currentUser.availability || []).map((a) => a.day).filter(Boolean);
  const candidateDays = (candidate.availability || []).map((a) => a.day).filter(Boolean);
  const sharedDays = myDays.filter((d) => candidateDays.includes(d));
  if (sharedDays.length > 0 && hasAnySkillMatch) {
    score += Math.min(sharedDays.length * 5, 10);
    reasons.push(`Both available on ${sharedDays.slice(0, 3).join(', ')}`);
  }

  // Interest Similarity (up to 10 pts)
  const myInterests = (currentUser.interests || []).map((i) => i.toLowerCase().trim()).filter(Boolean);
  const candidateInterests = (candidate.interests || []).map((i) => i.toLowerCase().trim()).filter(Boolean);
  const sharedInterests = myInterests.filter((i) => candidateInterests.includes(i));
  if (sharedInterests.length > 0 && hasAnySkillMatch) {
    score += Math.min(sharedInterests.length * 5, 10);
    reasons.push(`Shared interests: ${sharedInterests.slice(0, 2).join(', ')}`);
  }

  // Same College (10 pts)
  if (
    currentUser.college &&
    candidate.college &&
    currentUser.college.toLowerCase().trim() === candidate.college.toLowerCase().trim() &&
    hasAnySkillMatch
  ) {
    score += 10;
    reasons.push(`Same college – ${candidate.college}`);
  }

  const finalScore = hasAnySkillMatch ? Math.min(Math.round(score), 100) : 0;

  return {
    score: finalScore,
    matchPercentage: finalScore,
    matchedTeachSkills,
    matchedLearnSkills,
    myTeachesMatches: matchedTeachSkills,
    myWantsMatches: matchedLearnSkills,
    reasons,
  };
};

module.exports = { calculateMatch };
