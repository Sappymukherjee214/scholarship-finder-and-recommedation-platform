const axios = require('axios');
const cheerio = require('cheerio');
const Sentiment = require('sentiment');
const Scholarship = require('../models/Scholarship');

const sentiment = new Sentiment();

/**
 * Base Scraper Class
 * Provides common functionality for all scholarship scrapers
 */
class BaseScraper {
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.scholarships = [];
    }

    /**
     * Fetch HTML content from URL
     */
    async fetchPage(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error.message);
            return null;
        }
    }

    /**
     * Parse date from various formats
     */
    parseDate(dateString) {
        if (!dateString) return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Default 90 days

        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (error) {
            console.error('Date parsing error:', error);
        }

        return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    }

    /**
     * Extract amount from text
     */
    parseAmount(amountText) {
        if (!amountText) return { min: 0, max: 0, currency: 'INR', type: 'One-time' };

        const cleanText = amountText.replace(/,/g, '');
        const matches = cleanText.match(/(\d+)/g);

        if (matches && matches.length > 0) {
            const amount = parseInt(matches[0]);
            return {
                min: amount,
                max: amount,
                currency: 'INR',
                type: amountText.toLowerCase().includes('annual') ? 'Annual' : 'One-time'
            };
        }

        return { min: 0, max: 0, currency: 'INR', type: 'One-time' };
    }

    /**
     * Analyze sentiment of scholarship description
     */
    analyzeSentiment(text) {
        const result = sentiment.analyze(text);

        let label = 'Neutral';
        if (result.score > 2) label = 'Positive';
        else if (result.score < -2) label = 'Negative';

        return {
            score: Math.max(-1, Math.min(1, result.score / 10)),
            label
        };
    }

    /**
     * Clean and normalize text
     */
    cleanText(text) {
        if (!text) return '';
        return text.replace(/\s+/g, ' ').trim();
    }

    /**
     * Save scholarships to database
     */
    async saveScholarships() {
        let savedCount = 0;
        let updatedCount = 0;

        for (const scholarshipData of this.scholarships) {
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
                        lastScraped: new Date()
                    });
                    savedCount++;
                }
            } catch (error) {
                console.error(`Error saving scholarship ${scholarshipData.name}:`, error.message);
            }
        }

        console.log(`✅ ${this.name}: Saved ${savedCount} new, updated ${updatedCount} existing scholarships`);
        return { saved: savedCount, updated: updatedCount };
    }

    /**
     * Abstract method - must be implemented by child classes
     */
    async scrape() {
        throw new Error('scrape() method must be implemented');
    }
}

module.exports = BaseScraper;
