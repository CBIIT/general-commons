#!/bin/bash

# Dependency Check Script for General Commons Backend
# This script runs OWASP Dependency Check to scan for vulnerabilities

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Starting OWASP Dependency Check for General Commons Backend${NC}"
echo "=================================================="

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    echo -e "${GREEN}📄 Loading environment variables from .env file${NC}"
    export $(grep -v '^#' .env | xargs)
elif [ -f "env.example" ]; then
    echo -e "${YELLOW}💡 Tip: Copy env.example to .env and add your NVD_API_KEY${NC}"
    echo -e "${YELLOW}   Run: cp env.example .env${NC}"
fi

# Check if NVD_API_KEY is set
if [ -z "$NVD_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: NVD_API_KEY environment variable is not set${NC}"
    echo -e "${YELLOW}   The scan will run but may be slower without API key${NC}"
    echo -e "${YELLOW}   To set it: export NVD_API_KEY=your_api_key_here${NC}"
    echo -e "${YELLOW}   Or add it to your .env file${NC}"
    echo ""
fi

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}❌ Error: Maven is not installed or not in PATH${NC}"
    echo "Please install Maven and ensure it's in your PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "pom.xml" ]; then
    echo -e "${RED}❌ Error: pom.xml not found${NC}"
    echo "Please run this script from the backend directory"
    exit 1
fi

echo -e "${BLUE}📋 Project Information:${NC}"
echo "   Project: $(grep -o '<artifactId>[^<]*</artifactId>' pom.xml | head -1 | sed 's/<[^>]*>//g')"
echo "   Version: $(grep -o '<version>[^<]*</version>' pom.xml | head -1 | sed 's/<[^>]*>//g')"
echo ""

echo -e "${BLUE}🚀 Running dependency check...${NC}"
echo "   This may take 10-15 minutes on first run (downloading vulnerability database)"
echo "   Subsequent runs will be faster"
echo ""

# Run the dependency check
if [ -n "$NVD_API_KEY" ]; then
    echo -e "${GREEN}✅ Using NVD API key for faster scanning${NC}"
    mvn dependency-check:check -DNVD_API_KEY="$NVD_API_KEY"
else
    echo -e "${YELLOW}⚠️  Running without NVD API key (slower)${NC}"
    mvn dependency-check:check
fi

# Check if the report was generated
if [ -f "target/dependency-check-report.html" ]; then
    echo ""
    echo -e "${GREEN}✅ Dependency check completed successfully!${NC}"
    echo -e "${GREEN}📊 Report generated: target/dependency-check-report.html${NC}"
    echo ""
    echo -e "${BLUE}📖 To view the report:${NC}"
    echo "   - Open target/dependency-check-report.html in your browser"
    echo "   - Or run: open target/dependency-check-report.html (macOS)"
    echo "   - Or run: xdg-open target/dependency-check-report.html (Linux)"
else
    echo -e "${RED}❌ Error: Report was not generated${NC}"
    echo "Check the Maven output above for errors"
    exit 1
fi

echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "   1. Review the HTML report for vulnerabilities"
echo "   2. Update dependencies with known vulnerabilities"
echo "   3. Re-run this script after updates to verify fixes"
echo ""
echo -e "${GREEN}✨ Dependency check complete!${NC}"
