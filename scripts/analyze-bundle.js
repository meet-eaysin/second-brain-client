#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * This script helps identify large dependencies and potential optimizations
 * Run with: node scripts/analyze-bundle.js
 */

const fs = require('fs');
const path = require('path');

// Analyze package.json dependencies
function analyzeDependencies() {
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packagePath)) {
        console.error('❌ package.json not found');
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Known large packages to watch out for
    const heavyPackages = {
        'react': 'Core React library',
        'react-dom': 'React DOM renderer',
        '@tanstack/react-query': 'Data fetching library',
        'react-router-dom': 'Routing library',
        'lucide-react': 'Icon library',
        '@tabler/icons-react': 'Another icon library',
        'tailwindcss': 'CSS framework',
        'typescript': 'TypeScript compiler',
        'vite': 'Build tool',
        'axios': 'HTTP client',
        'zod': 'Schema validation',
        'react-hook-form': 'Form library',
        '@hookform/resolvers': 'Form resolvers',
    };

    // Check for duplicate icon libraries
    const iconLibraries = Object.keys(dependencies).filter(name => 
        name.includes('icon') || name.includes('lucide') || name.includes('tabler')
    );
}

// Analyze source code for potential issues
function analyzeSourceCode() {
    const srcPath = path.join(process.cwd(), 'src');
    
    if (!fs.existsSync(srcPath)) {
        console.error('❌ src directory not found');
        return;
    }

    let totalFiles = 0;
    let largeFiles = [];
    let importIssues = [];

    function analyzeDirectory(dirPath, relativePath = '') {
        const items = fs.readdirSync(dirPath);

        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const relativeFilePath = path.join(relativePath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                analyzeDirectory(fullPath, relativeFilePath);
            } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
                totalFiles++;
                const content = fs.readFileSync(fullPath, 'utf8');
                const sizeKB = (content.length / 1024).toFixed(2);

                // Check for large files
                if (content.length > 10000) { // 10KB
                    largeFiles.push({ file: relativeFilePath, size: sizeKB });
                }

                // Check for import issues
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    // Check for barrel imports that might cause large bundles
                    if (line.includes('import') && line.includes('*')) {
                        importIssues.push({
                            file: relativeFilePath,
                            line: index + 1,
                            issue: 'Wildcard import detected',
                            code: line.trim()
                        });
                    }

                    // Check for large library imports
                    if (line.includes('import') && (
                        line.includes('lucide-react') || 
                        line.includes('@tabler/icons-react')
                    )) {
                        if (!line.includes('{') || line.split(',').length > 10) {
                            importIssues.push({
                                file: relativeFilePath,
                                line: index + 1,
                                issue: 'Large icon import',
                                code: line.trim()
                            });
                        }
                    }
                });
            }
        });
    }

    analyzeDirectory(srcPath);

    if (largeFiles.length > 0) {
        largeFiles
            .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
            .slice(0, 10)
    }
}

// Performance recommendations
function showRecommendations() {
    const recommendations = [
        '1. Use tree-shaking friendly imports: import { Button } from "@/components/ui/button"',
        '2. Avoid wildcard imports: import * as Icons from "lucide-react"',
        '3. Lazy load heavy components and routes',
        '4. Use React.memo() for expensive components',
        '5. Implement route preloading for better UX',
        '6. Consider code splitting at the route level',
        '7. Optimize images and use modern formats (WebP, AVIF)',
        '8. Use a single icon library to reduce bundle size',
        '9. Remove unused dependencies and imports',
        '10. Use dynamic imports for conditional features'
    ];
}

analyzeDependencies();
analyzeSourceCode();
showRecommendations();
