/**
 * Scholarship Matching Algorithm
 * Calculates relevance score between student profile and scholarship eligibility
 */

class ScholarshipMatcher {
    /**
     * Calculate match score between student and scholarship
     * @param {Object} student - Student profile
     * @param {Object} scholarship - Scholarship data
     * @returns {Object} - Match result with score and breakdown
     */
    static calculateMatchScore(student, scholarship) {
        let score = 0;
        let maxScore = 0;
        const breakdown = {};

        // 1. Course Match (Weight: 25 points)
        maxScore += 25;
        if (scholarship.eligibility.courses && scholarship.eligibility.courses.length > 0) {
            if (scholarship.eligibility.courses.includes(student.courseOfStudy) ||
                scholarship.eligibility.courses.includes('Any') ||
                scholarship.eligibility.courses.includes('All')) {
                score += 25;
                breakdown.courseMatch = 25;
            } else {
                breakdown.courseMatch = 0;
            }
        } else {
            score += 25; // No course restriction
            breakdown.courseMatch = 25;
        }

        // 2. Educational Level Match (Weight: 20 points)
        maxScore += 20;
        if (scholarship.eligibility.educationalLevels && scholarship.eligibility.educationalLevels.length > 0) {
            if (scholarship.eligibility.educationalLevels.includes(student.educationalLevel)) {
                score += 20;
                breakdown.educationalLevelMatch = 20;
            } else {
                breakdown.educationalLevelMatch = 0;
            }
        } else {
            score += 20;
            breakdown.educationalLevelMatch = 20;
        }

        // 3. GPA Match (Weight: 20 points)
        maxScore += 20;
        if (scholarship.eligibility.minGPA) {
            if (student.gpa >= scholarship.eligibility.minGPA) {
                // Give full points if exceeds by 1 or more, proportional otherwise
                const excess = student.gpa - scholarship.eligibility.minGPA;
                const gpaScore = Math.min(20, 10 + (excess * 10));
                score += gpaScore;
                breakdown.gpaMatch = gpaScore;
            } else {
                breakdown.gpaMatch = 0;
            }
        } else {
            score += 20;
            breakdown.gpaMatch = 20;
        }

        // 4. Location Match (Weight: 15 points)
        maxScore += 15;
        let locationScore = 0;
        if (scholarship.eligibility.locations) {
            const { countries, states, cities } = scholarship.eligibility.locations;

            if (!countries || countries.length === 0 || countries.includes(student.currentLocation.country)) {
                locationScore += 5;
            }
            if (!states || states.length === 0 || states.includes(student.currentLocation.state)) {
                locationScore += 10;
            }

            score += locationScore;
            breakdown.locationMatch = locationScore;
        } else {
            score += 15;
            breakdown.locationMatch = 15;
        }

        // 5. Income Criteria (Weight: 10 points)
        maxScore += 10;
        if (scholarship.eligibility.incomeCriteria && scholarship.eligibility.incomeCriteria.required) {
            const incomeRanges = {
                'Below 1 Lakh': 0.5,
                '1-3 Lakhs': 2,
                '3-5 Lakhs': 4,
                '5-8 Lakhs': 6.5,
                'Above 8 Lakhs': 10
            };

            const studentIncomeMax = incomeRanges[student.incomeBracket] || 10;
            const scholarshipIncomeMax = scholarship.eligibility.incomeCriteria.maxIncome || 10;

            if (studentIncomeMax <= scholarshipIncomeMax) {
                score += 10;
                breakdown.incomeMatch = 10;
            } else {
                breakdown.incomeMatch = 0;
            }
        } else {
            score += 10;
            breakdown.incomeMatch = 10;
        }

        // 6. Gender Match (Weight: 5 points)
        maxScore += 5;
        if (scholarship.eligibility.genderSpecific && scholarship.eligibility.genderSpecific !== 'Any') {
            if (student.gender === scholarship.eligibility.genderSpecific) {
                score += 5;
                breakdown.genderMatch = 5;
            } else {
                breakdown.genderMatch = 0;
            }
        } else {
            score += 5;
            breakdown.genderMatch = 5;
        }

        // 7. Minority Status (Weight: 5 points)
        maxScore += 5;
        if (scholarship.eligibility.minorityOnly) {
            if (student.minorityStatus && student.minorityStatus !== 'General' && student.minorityStatus !== 'Prefer not to say') {
                score += 5;
                breakdown.minorityMatch = 5;
            } else {
                breakdown.minorityMatch = 0;
            }
        } else {
            score += 5;
            breakdown.minorityMatch = 5;
        }

        // 8. Disability Friendly (Bonus: 5 points)
        if (scholarship.eligibility.disabilityFriendly && student.hasDisability) {
            score += 5;
            maxScore += 5;
            breakdown.disabilityBonus = 5;
        }

        // Calculate percentage score
        const percentageScore = (score / maxScore) * 100;

        return {
            score: Math.round(percentageScore),
            breakdown,
            isEligible: percentageScore >= 50, // At least 50% match required
            rawScore: score,
            maxPossibleScore: maxScore
        };
    }

    /**
     * Get deadline urgency score
     * @param {Date} deadline - Scholarship deadline
     * @returns {Object} - Urgency information
     */
    static getDeadlineUrgency(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

        let urgency = 'low';
        let urgencyScore = 0;

        if (daysRemaining < 0) {
            urgency = 'expired';
            urgencyScore = -1;
        } else if (daysRemaining <= 7) {
            urgency = 'critical';
            urgencyScore = 100;
        } else if (daysRemaining <= 14) {
            urgency = 'high';
            urgencyScore = 75;
        } else if (daysRemaining <= 30) {
            urgency = 'medium';
            urgencyScore = 50;
        } else {
            urgency = 'low';
            urgencyScore = 25;
        }

        return {
            daysRemaining,
            urgency,
            urgencyScore,
            isExpired: daysRemaining < 0
        };
    }

    /**
     * Calculate funding coverage score
     * @param {Object} awardAmount - Scholarship award details
     * @returns {number} - Coverage score (0-100)
     */
    static getFundingScore(awardAmount) {
        if (!awardAmount) return 0;

        if (awardAmount.type === 'Full Tuition') {
            return 100;
        }

        const amount = awardAmount.max || awardAmount.min || 0;

        // Scoring based on amount (in INR)
        if (amount >= 200000) return 100;
        if (amount >= 100000) return 80;
        if (amount >= 50000) return 60;
        if (amount >= 25000) return 40;
        if (amount >= 10000) return 20;
        return 10;
    }

    /**
     * Get recommended scholarships for a student
     * @param {Object} student - Student profile
     * @param {Array} scholarships - Array of scholarships
     * @param {Object} options - Filtering options
     * @returns {Array} - Sorted and scored scholarships
     */
    static getRecommendations(student, scholarships, options = {}) {
        const { limit = 50, minScore = 50 } = options;

        const scoredScholarships = scholarships
            .filter(scholarship => {
                // Filter out expired scholarships
                const deadlineInfo = this.getDeadlineUrgency(scholarship.applicationDeadline);
                return !deadlineInfo.isExpired && scholarship.isActive;
            })
            .map(scholarship => {
                const matchResult = this.calculateMatchScore(student, scholarship);
                const deadlineInfo = this.getDeadlineUrgency(scholarship.applicationDeadline);
                const fundingScore = this.getFundingScore(scholarship.awardAmount);

                // Calculate final priority score
                // Match: 60%, Urgency: 25%, Funding: 15%
                const priorityScore = (
                    matchResult.score * 0.6 +
                    deadlineInfo.urgencyScore * 0.25 +
                    fundingScore * 0.15
                );

                return {
                    ...scholarship.toObject(),
                    matchScore: matchResult.score,
                    matchBreakdown: matchResult.breakdown,
                    isEligible: matchResult.isEligible,
                    deadlineInfo,
                    fundingScore,
                    priorityScore: Math.round(priorityScore)
                };
            })
            .filter(scholarship => scholarship.matchScore >= minScore)
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .slice(0, limit);

        return scoredScholarships;
    }
}

module.exports = ScholarshipMatcher;
