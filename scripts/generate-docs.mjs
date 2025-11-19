import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, '../docs.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const docsDir = path.join(__dirname, '../docs');
const apiDir = path.join(docsDir, config.outputDir.replace('docs/', ''));

// Ensure directories exist
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

/**
 * Extract group name from file content based on JSDoc tags
 * Priority: @library > @testSuite > @component > @file > filename
 */
function extractGroupName(content, filePath) {
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//;
  const match = content.match(jsdocRegex);
  
  if (!match) {
    console.log(`   ! Using filename as heading for ${filePath}: No JSDoc comment found`);
    return path.basename(filePath);
  }
  
  const jsdoc = match[1];
  
  // Check for @library tag (renamed from @package)
  const libraryMatch = jsdoc.match(/@library\s+(.+)/);
  if (libraryMatch) {
    return libraryMatch[1].trim();
  }
  
  // Check for @testSuite tag
  const testSuiteMatch = jsdoc.match(/@testSuite\s+(.+)/);
  if (testSuiteMatch) {
    return testSuiteMatch[1].trim();
  }
  
  // Check for @component tag
  const componentMatch = jsdoc.match(/@component\s+(.+)/);
  if (componentMatch) {
    return componentMatch[1].trim();
  }
  
  // Check for @file tag
  const fileMatch = jsdoc.match(/@file\s+(.+)/);
  if (fileMatch) {
    return fileMatch[1].trim();
  }
  
  // Fallback to filename
  console.log(`   ! Using filename as heading for ${filePath}: No @library, @testSuite, @component, or @file tag found`);
  return path.basename(filePath);
}

/**
 * Extract all JSDoc comments from file content
 */
function extractAllJSDocs(content, filePath, isTest = false) {
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  const matches = [...content.matchAll(jsdocRegex)];
  
  const docs = [];
  
  matches.forEach(jsdocMatch => {
    const doc = parseJSDocBlock(jsdocMatch[1], filePath);
    
    // For test files, include the first JSDoc block even without @function tag
    if (isTest && docs.length === 0 && doc && !doc.isPackageDoc) {
      // Use filename as the function name for test files
      if (!doc.functionName) {
        doc.functionName = path.basename(filePath);
      }
      docs.push(doc);
    }
    // For non-test files, only include docs that have a function/class name
    else if (!isTest && doc && doc.functionName && !doc.isPackageDoc) {
      docs.push(doc);
    }
    // Include additional docs with @function/@component tags in test files
    else if (isTest && doc && doc.functionName && !doc.isPackageDoc) {
      docs.push(doc);
    }
  });
  
  return docs;
}

/**
 * Parse a single JSDoc block
 */
function parseJSDocBlock(jsdoc, filePath) {
  const lines = jsdoc.split('\n').map(line => line.trim().replace(/^\*\s?/, ''));
  
  const doc = {
    fileName: path.basename(filePath).replace(/\.(tsx?|jsx?)$/, ''),
    filePath: filePath,
    functionName: '',
    description: '',
    remarks: '',
    example: '',
    params: [],
    returns: '',
    category: '',
    testCoverage: '',
    edgeCases: '',
    expectedValues: '',
    isPackageDoc: false
  };

  let currentSection = 'description';
  let currentContent = '';
  let inCodeBlock = false;

  lines.forEach(line => {
    // Check for code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      currentContent += line + '\n';
      return;
    }

    // Extract function/component/testSuite name from tag
    if (line.toLowerCase().startsWith('@function') || line.toLowerCase().startsWith('@component') || line.toLowerCase().startsWith('@testsuite')) {
      doc.functionName = line.replace(/@(function|component|testSuite|Function|Component|TestSuite)/i, '').trim();
      currentSection = 'description';
      currentContent = '';
      return;
    }

    // Handle section tags
    if (line.startsWith('@remarks')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      currentSection = 'remarks';
      currentContent = '';
      return;
    }
    
    if (line.startsWith('@example')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      currentSection = 'example';
      currentContent = '';
      return;
    }

    if (line.startsWith('@testCoverage')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      currentSection = 'testCoverage';
      currentContent = '';
      return;
    }

    if (line.startsWith('@edgeCases')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      currentSection = 'edgeCases';
      currentContent = '';
      return;
    }

    if (line.startsWith('@expectedValues')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      currentSection = 'expectedValues';
      currentContent = '';
      return;
    }

    if (line.startsWith('@param')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      const paramMatch = line.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+(.*)/);
      if (paramMatch) {
        doc.params.push({
          type: paramMatch[1],
          name: paramMatch[2],
          description: paramMatch[3]
        });
      }
      return;
    }

    if (line.startsWith('@returns')) {
      if (currentContent.trim()) {
        doc[currentSection] = currentContent.trim();
      }
      doc.returns = line.replace('@returns', '').trim();
      currentSection = 'returns';
      return;
    }

    if (line.startsWith('@category')) {
      doc.category = line.replace('@category', '').trim();
      return;
    }

    if (line.startsWith('@packageDocumentation')) {
      doc.isPackageDoc = true;
      return;
    }

    // Skip other unknown tags
    if (line.startsWith('@')) {
      return;
    }

    // Accumulate content
    if (line || inCodeBlock) {
      currentContent += line + '\n';
    }
  });

  // Save final section content
  if (currentContent.trim()) {
    doc[currentSection] = currentContent.trim();
  }

  return doc;
}

/**
 * Generate markdown content from parsed JSDoc
 */
function generateMarkdown(doc, isTest = false) {
  let md = '';

  // Title - only use the function/component/testSuite name
  md += `### ${doc.functionName}\n\n`;
  md += `**File**: \`${doc.filePath}\`\n\n`;

  // Description
  if (doc.description) {
    md += `${doc.description}\n\n`;
  }

  // Remarks
  if (doc.remarks) {
    md += `${doc.remarks}\n\n`;
  }

  // Parameters (for functions)
  if (doc.params.length > 0) {
    md += `#### Parameters\n\n`;
    doc.params.forEach(param => {
      md += `- **${param.name}** (\`${param.type}\`): ${param.description}\n`;
    });
    md += '\n';
  }

  // Returns
  if (doc.returns) {
    md += `#### Returns\n\n${doc.returns}\n\n`;
  }

  // Test-specific sections
  if (isTest) {
    if (doc.testCoverage) {
      md += `#### Test Coverage\n\n${doc.testCoverage}\n\n`;
    }
    if (doc.edgeCases) {
      md += `#### Edge Cases\n\n${doc.edgeCases}\n\n`;
    }
    if (doc.expectedValues) {
      md += `#### Expected Values\n\n${doc.expectedValues}\n\n`;
    }
  }

  // Example
  if (doc.example) {
    md += `#### Example\n\n${doc.example}\n\n`;
  }

  return md;
}

/**
 * Generate documentation for a set of files
 * @param {Object} docConfig - Documentation configuration object
 */
function generateDocs(docConfig) {
  const { name, title, description, include, exclude, isTest } = docConfig;
  
  // Collect all files matching include patterns
  let allFiles = [];
  include.forEach(pattern => {
    const files = glob.globSync(pattern, {
      cwd: path.join(__dirname, '..'),
      ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/docs/**']
    });
    allFiles = allFiles.concat(files);
  });

  // Filter out excluded files
  const excludePatterns = exclude || [];
  const files = allFiles.filter(file => {
    return !excludePatterns.some(pattern => {
      return minimatch(file, pattern);
    });
  });

  console.log(`\n${title}`);
  console.log(`   Found ${files.length} files`);
  if (excludePatterns.length > 0) {
    console.log(`   Excluded ${allFiles.length - files.length} files`);
  }

  let content = `---
outline: [2, 4]
---

# ${title}

${description ? description + '\n' : ''}
`;

  const filesWithoutDocs = [];

  // Process files individually (grouped by file/package)
  files.sort().forEach(filePath => {
    const fullPath = path.join(__dirname, '..', filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    
    const docs = extractAllJSDocs(fileContent, filePath, isTest);
    
    if (!docs || docs.length === 0) {
      filesWithoutDocs.push(filePath);
      return;
    }

    // Extract group name for this file
    const groupName = extractGroupName(fileContent, filePath);
    
    // Only add group header if there are multiple functions OR if group name differs from function name
    const needsGroupHeader = docs.length > 1 || (docs.length === 1 && groupName !== docs[0].functionName);
    
    if (needsGroupHeader) {
      content += `## ${groupName}\n\n`;
    }

    docs.forEach(doc => {
      content += generateMarkdown(doc, isTest);
    });
  });

  // Write output
  const outputFile = path.join(apiDir, name);
  fs.writeFileSync(outputFile, content);
  console.log(`   > Created ${path.relative(path.join(__dirname, '..'), outputFile)}`);

  // Warnings
  if (filesWithoutDocs.length > 0) {
    console.log(`   ! Warning: ${filesWithoutDocs.length} files missing documentation:`);
    filesWithoutDocs.slice(0, 3).forEach(file => {
      console.log(`      - ${file}`);
    });
    if (filesWithoutDocs.length > 3) {
      console.log(`      ... and ${filesWithoutDocs.length - 3} more`);
    }
  }
}

/**
 * Create API index page
 */
function createIndexPage() {
  if (!config.createIndex) {
    return;
  }

  let indexContent = `# API Reference

Welcome to the API reference for the IBA Event Management System.

## Documentation Structure

`;

  // Add links to each documentation file
  config.docs.forEach(doc => {
    indexContent += `- **[${doc.title}](./${doc.name})** - ${doc.description}\n`;
  });

  // Add quick links
  if (config.indexLinks && config.indexLinks.length > 0) {
    indexContent += `\n## Quick Links\n\n`;
    config.indexLinks.forEach(link => {
      indexContent += `- [${link.title}](${link.link})\n`;
    });
  }

  fs.writeFileSync(path.join(apiDir, 'index.md'), indexContent);
  console.log(`\n> Created ${path.join(config.outputDir, 'index.md')}`);
}

// Main execution
console.log('Generating unified documentation...');
console.log(`Using config: docs.config.json\n`);

// Generate documentation for each configured output
config.docs.forEach(docConfig => {
  generateDocs(docConfig);
});

// Create index page
createIndexPage();

console.log('\nDocumentation generation complete!\n');
