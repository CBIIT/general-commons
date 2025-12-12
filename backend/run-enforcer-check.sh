#!/bin/bash

# Maven Enforcer Plugin Runner Script
# This script runs the Maven Enforcer plugin to check dependency compatibility

set -e  # Exit on any error

echo "=========================================="
echo "Maven Enforcer Plugin - Dependency Check"
echo "=========================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "pom.xml" ]; then
    echo "❌ Error: pom.xml not found. Please run this script from the backend directory."
    exit 1
fi

echo "📋 Running Maven Enforcer Plugin..."
echo "   - Checking dependency convergence"
echo "   - Excluding Spring Framework dependencies"
echo ""

# Run the Maven Enforcer plugin with the configured execution
mvn enforcer:enforce@enforce

echo ""
echo "✅ Maven Enforcer Plugin completed successfully!"
echo "   All dependencies are compatible."
echo ""
