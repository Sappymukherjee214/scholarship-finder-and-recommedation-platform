require('dotenv').config();
const connectDB = require('../config/database');
const MockDataGenerator = require('./mockDataGenerator');

/**
 * Scraper Runner
 * Orchestrates the scholarship scraping process
 */
async function runScrapers() {
    try {
        console.log('🚀 Starting scholarship scraping process...\n');

        // Connect to database
        await connectDB();

        // For production: Use real scrapers
        // const scrapers = [
        //   new GovernmentPortalScraper(),
        //   new UniversityScraper(),
        //   new PrivateFoundationScraper()
        // ];

        // For demo/development: Use mock data generator
        const mockGenerator = new MockDataGenerator();
        const result = await mockGenerator.generateMockData(60);

        console.log('\n📊 Scraping Summary:');
        console.log(`   Total scholarships processed: ${result.total}`);
        console.log(`   New scholarships added: ${result.saved}`);
        console.log(`   Existing scholarships updated: ${result.updated}`);
        console.log('\n✅ Scraping completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Scraping failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runScrapers();
}

module.exports = runScrapers;
