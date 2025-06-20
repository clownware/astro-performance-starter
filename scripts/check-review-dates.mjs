#!/usr/bin/env node

/**
 * Check documentation review dates
 * 
 * Scans documentation for `review:` frontmatter and warns when dates are overdue.
 * Helps ensure "living" guides stay current with regular review cadence.
 * 
 * Usage:
 *   node scripts/check-review-dates.mjs
 *   npm run check:reviews
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Parse frontmatter from markdown file
 * @param {string} content - File content
 * @returns {Object} Parsed frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return {};
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/['"]/g, '');
      frontmatter[key.trim()] = value;
    }
  }
  
  return frontmatter;
}

/**
 * Find all markdown files recursively
 * @param {string} dir - Directory to search
 * @param {string[]} excludeDirs - Directories to exclude
 * @returns {string[]} Array of file paths
 */
function findMarkdownFiles(dir, excludeDirs = []) {
  const files = [];
  
  function walkDir(currentDir) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!excludeDirs.includes(entry) && !entry.startsWith('.')) {
          walkDir(fullPath);
        }
      } else if (extname(entry).toLowerCase() === '.md') {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

/**
 * Check if a file needs review based on content patterns
 * @param {string} filepath - File path
 * @param {string} content - File content
 * @returns {boolean} Whether file should have review dates
 */
function shouldHaveReviewDate(filepath, content) {
  const filename = relative(rootDir, filepath).toLowerCase();
  
  // Files that should always have review dates
  const criticalFiles = [
    'index.md',
    'tech-stack.md',
    'budgets-guardrails.md',
    'security',
    'performance',
    'adr/',
    'budget'
  ];
  
  // Content patterns that indicate need for review
  const criticalPatterns = [
    /budget.*[<>]\s*\d+/i,              // Budget constraints: "JS < 160 KB"
    /monthly.*audit/i,                  // "monthly audits"
    /quarterly.*review/i,               // "quarterly review"
    /technology.*stack/i,               // Technology decisions
    /performance.*target/i,             // Performance targets
    /security.*requirement/i,           // Security requirements
    /critical.*constraint/i,            // Critical constraints
    /maximum.*size/i,                   // Size limits
    /lighthouse.*score/i,               // Performance scores
    /core.*web.*vital/i,                // Core Web Vitals
  ];
  
  // Check filename patterns
  if (criticalFiles.some(pattern => filename.includes(pattern))) {
    return true;
  }
  
  // Check content patterns
  if (criticalPatterns.some(pattern => pattern.test(content))) {
    return true;
  }
  
  return false;
}

/**
 * Main review date checker
 */
function checkReviewDates() {
  const today = new Date();
  const warnings = [];
  const suggestions = [];
  
  console.log(`🔍 Checking documentation review dates (${today.toISOString().split('T')[0]})\n`);
  
  // Find all markdown files
  const markdownFiles = findMarkdownFiles(join(rootDir, 'docs'));
  
  for (const filepath of markdownFiles) {
    const content = readFileSync(filepath, 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const relativePath = relative(rootDir, filepath);
    
    const needsReview = shouldHaveReviewDate(filepath, content);
    const hasReviewDate = frontmatter.review || frontmatter.nextReview;
    
    if (needsReview && !hasReviewDate) {
      suggestions.push({
        type: 'missing-review-date',
        file: relativePath,
        message: 'Should have review date - contains critical constraints or promises regular updates'
      });
    }
    
    if (hasReviewDate) {
      const reviewDate = new Date(hasReviewDate);
      
      if (isNaN(reviewDate.getTime())) {
        warnings.push({
          type: 'invalid-date',
          file: relativePath,
          message: `Invalid review date format: "${hasReviewDate}" (use YYYY-MM-DD)`
        });
      } else if (reviewDate < today) {
        const daysOverdue = Math.floor((today - reviewDate) / (1000 * 60 * 60 * 24));
        warnings.push({
          type: 'overdue-review',
          file: relativePath,
          message: `Review overdue by ${daysOverdue} days (due: ${reviewDate.toISOString().split('T')[0]})`
        });
      } else {
        const daysUntilReview = Math.floor((reviewDate - today) / (1000 * 60 * 60 * 24));
        console.log(`✅ ${relativePath} - Review scheduled in ${daysUntilReview} days`);
      }
    }
  }
  
  // Report findings
  let hasErrors = false;
  
  if (warnings.length > 0) {
    console.log('\n⚠️  REVIEW WARNINGS:');
    warnings.forEach(warning => {
      console.log(`   ${warning.file}: ${warning.message}`);
    });
    hasErrors = true;
  }
  
  if (suggestions.length > 0) {
    console.log('\n💡 SUGGESTIONS (add review dates to these files):');
    suggestions.forEach(suggestion => {
      console.log(`   ${suggestion.file}: ${suggestion.message}`);
    });
  }
  
  if (warnings.length === 0 && suggestions.length === 0) {
    console.log('✅ All documentation review dates are current!');
  }
  
  console.log(`\n📊 Checked ${markdownFiles.length} files`);
  console.log(`   ${warnings.length} warnings, ${suggestions.length} suggestions`);
  
  // Exit with error code if there are overdue reviews
  const overdueReviews = warnings.filter(w => w.type === 'overdue-review').length;
  if (overdueReviews > 0) {
    console.log(`\n❌ ${overdueReviews} overdue reviews found - please update documentation`);
    process.exit(1);
  }
}

// Run the check
if (import.meta.url === `file://${process.argv[1]}`) {
  checkReviewDates();
}

export { checkReviewDates, parseFrontmatter, shouldHaveReviewDate };
