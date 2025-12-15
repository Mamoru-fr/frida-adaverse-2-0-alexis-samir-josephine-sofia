/**
 * CLI Script to Import Projects from CSV
 * Usage: npm run import-csv <csv-file-path> <user-id>
 * 
 * This script parses a CSV file and adds projects to the studentProjects table
 * Example: npm run import-csv ./projects.csv user_123
 */

import db from './index';
import { studentProjects, adaProjects, promotions } from './schema';
import { readFileSync } from 'fs';
import { GenerateURLName } from '../../utils/GenerateURLName';
import { NormalizeText } from '../../utils/NormalizeText';

interface CSVRow {
    promotion: string;
    participants: string;
    category: string;
    title: string;
    githubUrl: string;
    demoUrl: string;
    hasThumbnail: string;
}

async function parseCSV(filepath: string): Promise<CSVRow[]> {
    const content = readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    // Find the header row (starts with "Promotion")
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Promotion,Participants')) {
            headerIndex = i;
            break;
        }
    }
    
    if (headerIndex === -1) {
        throw new Error('Header row not found in CSV');
    }
    
    const rows: CSVRow[] = [];
    
    // Parse data rows (skip header)
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith(',,,')) continue; // Skip empty rows
        
        // Parse CSV with proper handling of quoted fields
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim()); // Add last field
        
        if (parts.length < 7) continue;
        
        const promotion = parts[0];
        const participants = parts[1];
        const category = parts[2];
        const title = parts[3];
        const githubUrl = parts[4];
        const demoUrl = parts[5];
        const hasThumbnail = parts[6];
        
        // Skip rows with missing required fields
        if (!title || !githubUrl || !participants || !category) continue;
        
        rows.push({
            promotion,
            participants,
            category,
            title,
            githubUrl,
            demoUrl,
            hasThumbnail
        });
    }
    
    return rows;
}

async function importCSV(csvPath: string, userId: string) {
    console.log('\n📂 CSV Import Script\n');
    console.log(`👤 Importing projects for user: ${userId}\n`);
    
    try {
        // Parse CSV
        console.log('📋 Parsing CSV file...');
        const rows = await parseCSV(csvPath);
        console.log(`✅ Found ${rows.length} project(s) to import\n`);
        
        if (rows.length === 0) {
            console.log('ℹ️  No valid projects found in CSV');
            return;
        }
        
        // Fetch existing data
        const existingProjects = await db.select().from(studentProjects);
        const allAdaProjects = await db.select().from(adaProjects);
        const allPromotions = await db.select().from(promotions);
        
        const allURLNames = [
            ...existingProjects.map(p => p.slug),
        ];
        
        let successCount = 0;
        let skipCount = 0;
        
        // Process each row
        for (const row of rows) {
            console.log(`\n🔄 Processing: "${row.title}"`);
            
            // 1. Check if a project with this GitHub URL already exists
            const projectWithSameGitHub = existingProjects.find(p => p.githubUrl === row.githubUrl);
            
            if (projectWithSameGitHub) {
                console.log(`   ⚠️  Project with GitHub URL "${row.githubUrl}" already exists, skipping`);
                skipCount++;
                continue;
            }
            
            // 2. Find Ada Project ID with better matching
            let adaProjectID: number | null = null;
            if (row.category) {
                const normalizedCategory = NormalizeText(row.category);
                
                // Common category variations mapping (check before normalization)
                const categoryMap: { [key: string]: string } = {
                    'checkevents': 'adacheck',
                    'checkevent': 'adacheck',
                    'adacheckevent': 'adacheck',
                    'quizz': 'adaquiz',
                    'quiz': 'adaquiz',
                    'adaopte/adaence': 'adaopte - adaence',
                    'adaopte adaence': 'adaopte - adaence',
                    'projets libres': 'projet libre',
                    'projet libres': 'projet libre',
                    'projets libre': 'projet libre',
                    'dataviz': 'adatech dataviz',
                    'data viz': 'adatech dataviz',
                };
                
                // Check if there's a mapping for the normalized category
                const mappedCategory = categoryMap[normalizedCategory];
                const searchCategory = mappedCategory || normalizedCategory;
                
                // Try exact match first
                let matchingProject = allAdaProjects.find(p => 
                    NormalizeText(p.name) === searchCategory
                );
                
                // If no exact match, try fuzzy matching with mapped category
                if (!matchingProject && mappedCategory) {
                    matchingProject = allAdaProjects.find(p => 
                        NormalizeText(p.name).includes(mappedCategory) ||
                        mappedCategory.includes(NormalizeText(p.name))
                    );
                }
                
                // Last resort: partial match with original normalized category
                if (!matchingProject) {
                    matchingProject = allAdaProjects.find(p => 
                        NormalizeText(p.name).includes(normalizedCategory) ||
                        normalizedCategory.includes(NormalizeText(p.name))
                    );
                }
                
                
                if (matchingProject) {
                    adaProjectID = matchingProject.id;
                    console.log(`   ✅ Matched category "${row.category}" → ${matchingProject.name} (ID ${adaProjectID})`);
                } else {
                    console.log(`   ⚠️  Category "${row.category}" not found, using "Projet Libre"`);
                    adaProjectID = 1; // Projet Libre
                }
            }
            
            // 3. Find Promotion ID
            let promotionID: number = 1; // Default
            if (row.promotion) {
                const normalizedPromotion = NormalizeText(row.promotion);
                const matchingPromotion = allPromotions.find(p => 
                    NormalizeText(p.name) === normalizedPromotion
                );
                
                if (matchingPromotion) {
                    promotionID = matchingPromotion.id;
                    console.log(`   ✅ Matched promotion "${row.promotion}" → ${matchingPromotion.name} (ID ${promotionID})`);
                } else {
                    console.log(`   ⚠️  Promotion "${row.promotion}" not found, using default (ID 1)`);
                }
            }
            
            // 4. Generate unique URLName
            let URLName = GenerateURLName(row.title);
            if (allURLNames.includes(URLName)) {
                let counter = 1;
                let newURLName = `${URLName}-${counter}`;
                while (allURLNames.includes(newURLName)) {
                    counter++;
                    newURLName = `${URLName}-${counter}`;
                }
                URLName = newURLName;
                console.log(`   ✅ Generated unique URLName: ${URLName}`);
            } else {
                console.log(`   ✅ URLName: ${URLName}`);
            }
            
            // 5. Build image URL and test if it exists
            let imageUrl = '';
            const thumbnailUrl = `${row.githubUrl}/blob/main/thumbnail.png?raw=true`;
            
            try {
                const response = await fetch(thumbnailUrl, { method: 'HEAD' });
                if (response.ok) {
                    imageUrl = thumbnailUrl;
                    console.log(`   ✅ Image URL: ${imageUrl}`);
                } else {
                    console.log(`   ⚠️  No thumbnail found at ${thumbnailUrl}`);
                }
            } catch (error) {
                console.log(`   ⚠️  Could not verify thumbnail URL`);
            }
            
            // 6. Insert into studentProjects
            try {
                await db.insert(studentProjects).values({
                    title: row.title,
                    slug: URLName,
                    githubUrl: row.githubUrl,
                    demoUrl: row.demoUrl || '',
                    promotionId: promotionID,
                    adaProjectsId: adaProjectID || 1,
                    publishedAt: null,
                    userId: userId,
                });
                
                allURLNames.push(URLName); // Add to prevent duplicates
                successCount++;
                console.log(`   ✅ Added to studentProjects`);
            } catch (error) {
                console.error(`   ❌ Error inserting project:`, error);
                skipCount++;
            }
        }
        
        console.log(`\n\n✨ Import Summary:`);
        console.log(`   ✅ Successfully imported: ${successCount} project(s)`);
        console.log(`   ⚠️  Skipped: ${skipCount} project(s)`);
        console.log(`\n📋 Projects have been added to studentProjects table!`);
        
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

// Get CSV path and userId from command line arguments
const csvPath = process.argv[2];
const userId = process.argv[3];

if (!csvPath || !userId) {
    console.error('❌ Please provide CSV file path and user ID');
    console.log('Usage: npm run import-csv <path-to-csv-file> <user-id>');
    console.log('Example: npm run import-csv ./projects.csv user_abc123');
    process.exit(1);
}

importCSV(csvPath, userId)
    .then(() => {
        console.log('\n✨ Script completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
