const Scholarship = require('../models/Scholarship');

/**
 * Mock Data Generator for Scholarships
 * Generates realistic scholarship data when real-time scraping is not available
 */
class MockDataGenerator {
    constructor() {
        this.providers = [
            'Ministry of Education, Govt of India',
            'UGC (University Grants Commission)',
            'AICTE (All India Council for Technical Education)',
            'National Scholarship Portal',
            'Tata Trusts',
            'Reliance Foundation',
            'Infosys Foundation',
            'Google India',
            'Microsoft India',
            'Azim Premji Foundation',
            'State Government Scholarship',
            'Central Sector Scholarship Scheme'
        ];

        this.scholarshipTemplates = [
            {
                nameTemplate: 'National Merit Scholarship for {level} Students',
                category: 'Merit-based',
                courses: ['Computer Science', 'Engineering', 'Science'],
                minGPA: 8.0
            },
            {
                nameTemplate: 'Women in STEM Scholarship',
                category: 'Women',
                courses: ['Computer Science', 'Engineering', 'Science'],
                genderSpecific: 'Female',
                minGPA: 7.5
            },
            {
                nameTemplate: 'Minority Community Education Support',
                category: 'Minority',
                courses: ['Any'],
                minorityOnly: true,
                minGPA: 6.5
            },
            {
                nameTemplate: 'Post Matric Scholarship for SC/ST Students',
                category: 'Minority',
                courses: ['Any'],
                minorityOnly: true,
                minGPA: 6.0
            },
            {
                nameTemplate: 'Merit-cum-Means Scholarship',
                category: 'Need-based',
                courses: ['Any'],
                minGPA: 7.0,
                maxIncome: 6
            },
            {
                nameTemplate: 'Research Excellence Fellowship',
                category: 'Research',
                courses: ['Computer Science', 'Engineering', 'Science'],
                educationalLevels: ['Postgraduate', 'Doctorate'],
                minGPA: 8.5
            },
            {
                nameTemplate: 'Sports Talent Scholarship',
                category: 'Sports',
                courses: ['Any'],
                minGPA: 6.0
            },
            {
                nameTemplate: 'Disability Welfare Scholarship',
                category: 'Disability',
                courses: ['Any'],
                disabilityFriendly: true,
                minGPA: 6.0
            },
            {
                nameTemplate: 'State Merit Scholarship - {state}',
                category: 'Merit-based',
                courses: ['Any'],
                minGPA: 7.5
            },
            {
                nameTemplate: 'Corporate Social Responsibility Scholarship',
                category: 'Private',
                courses: ['Engineering', 'Business', 'Computer Science'],
                minGPA: 7.0
            }
        ];

        this.states = [
            'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'West Bengal',
            'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Kerala'
        ];

        this.educationalLevels = ['High School', 'Undergraduate', 'Postgraduate', 'Doctorate'];
    }

    /**
     * Generate random date between now and maxDays in future
     */
    generateDeadline(maxDays = 120) {
        const minDays = 5;
        const days = Math.floor(Math.random() * (maxDays - minDays)) + minDays;
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + days);
        return deadline;
    }

    /**
     * Generate award amount based on category
     */
    generateAwardAmount(category) {
        const amounts = {
            'Merit-based': { min: 25000, max: 100000 },
            'Need-based': { min: 15000, max: 75000 },
            'Research': { min: 50000, max: 200000 },
            'Women': { min: 30000, max: 80000 },
            'Minority': { min: 20000, max: 60000 },
            'Sports': { min: 25000, max: 100000 },
            'Disability': { min: 30000, max: 75000 },
            'Private': { min: 40000, max: 150000 },
            'Government': { min: 20000, max: 80000 }
        };

        const range = amounts[category] || { min: 20000, max: 80000 };
        const amount = Math.floor(Math.random() * (range.max - range.min)) + range.min;

        return {
            min: amount,
            max: amount,
            currency: 'INR',
            type: Math.random() > 0.5 ? 'Annual' : 'One-time'
        };
    }

    /**
     * Generate a single scholarship
     */
    generateScholarship(index) {
        const template = this.scholarshipTemplates[index % this.scholarshipTemplates.length];
        const provider = this.providers[Math.floor(Math.random() * this.providers.length)];
        const state = this.states[Math.floor(Math.random() * this.states.length)];
        const level = this.educationalLevels[Math.floor(Math.random() * this.educationalLevels.length)];

        const name = template.nameTemplate
            .replace('{level}', level)
            .replace('{state}', state);

        const scholarship = {
            name,
            provider,
            description: `This scholarship aims to support talented students pursuing ${template.courses.join(', ')} courses. The scholarship provides financial assistance to deserving candidates who demonstrate academic excellence and commitment to their field of study. Applicants must meet the eligibility criteria and submit all required documents before the deadline.`,
            awardAmount: this.generateAwardAmount(template.category),
            eligibility: {
                courses: template.courses || ['Any'],
                educationalLevels: template.educationalLevels || this.educationalLevels,
                minGPA: template.minGPA || 6.0,
                locations: {
                    countries: ['India'],
                    states: Math.random() > 0.5 ? [state] : [],
                    cities: []
                },
                incomeCriteria: template.maxIncome ? {
                    maxIncome: template.maxIncome,
                    required: true
                } : { required: false },
                genderSpecific: template.genderSpecific || 'Any',
                minorityOnly: template.minorityOnly || false,
                disabilityFriendly: template.disabilityFriendly || false
            },
            applicationDeadline: this.generateDeadline(),
            applicationLink: `https://scholarships.gov.in/apply/${name.toLowerCase().replace(/\s+/g, '-')}`,
            applicationProcess: 'Online application through official portal',
            requiredDocuments: [
                'Academic transcripts',
                'Income certificate',
                'Identity proof',
                'Passport size photograph',
                'Bank account details'
            ],
            category: template.category,
            tags: [template.category, level],
            sourceUrl: 'https://scholarships.gov.in',
            sourcePlatform: provider.includes('Govt') ? 'Government Portal' : 'Private Foundation',
            sentimentScore: 0.5 + Math.random() * 0.5,
            sentimentLabel: 'Positive',
            isActive: true,
            verified: true,
            viewCount: Math.floor(Math.random() * 1000),
            applicationCount: Math.floor(Math.random() * 200)
        };

        return scholarship;
    }

    /**
     * Generate multiple scholarships
     */
    async generateMockData(count = 50) {
        console.log(`🔄 Generating ${count} mock scholarships...`);

        const scholarships = [];
        for (let i = 0; i < count; i++) {
            scholarships.push(this.generateScholarship(i));
        }

        // Save to database
        let savedCount = 0;
        let updatedCount = 0;

        for (const scholarshipData of scholarships) {
            try {
                const existing = await Scholarship.findOne({
                    name: scholarshipData.name,
                    provider: scholarshipData.provider
                });

                if (existing) {
                    await Scholarship.findByIdAndUpdate(existing._id, {
                        ...scholarshipData,
                        lastScraped: new Date()
                    });
                    updatedCount++;
                } else {
                    await Scholarship.create({
                        ...scholarshipData,
                        lastScraped: new Date(),
                        createdAt: new Date()
                    });
                    savedCount++;
                }
            } catch (error) {
                console.error(`Error saving scholarship ${scholarshipData.name}:`, error.message);
            }
        }

        console.log(`✅ Mock Data: Saved ${savedCount} new, updated ${updatedCount} existing scholarships`);
        return { saved: savedCount, updated: updatedCount, total: count };
    }
}

module.exports = MockDataGenerator;
