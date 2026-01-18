#!/bin/bash

# Automated script to run Vue Simple Test 5 times with 5-minute cooldown
# Usage: ./run-vue-simple-5times.sh

FRAMEWORK="vue"
PORT="8080"
SCENARIO="simple"
RUNS=5
COOLDOWN_MINUTES=5
COOLDOWN_SECONDS=$((COOLDOWN_MINUTES * 60))
SCAPHANDRE_DURATION=60  # 60 seconds for simple scenario

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/home/student/Downloads/frontend-energy-study"
TEST_SCRIPTS_DIR="$PROJECT_DIR/test-scripts"
MEASUREMENTS_DIR="$PROJECT_DIR/measurements/$FRAMEWORK"

# Ensure measurements directory exists
mkdir -p "$MEASUREMENTS_DIR"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Vue Simple Test - 5 Runs with 5min Cooldown${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Configuration:${NC}"
echo -e "  Framework: $FRAMEWORK"
echo -e "  Port: $PORT"
echo -e "  Scenario: $SCENARIO"
echo -e "  Total Runs: $RUNS"
echo -e "  Cooldown: $COOLDOWN_MINUTES minutes"
echo ""

# Check if Vue app is running
echo -e "${YELLOW}Checking if Vue app is running on port $PORT...${NC}"
if ! curl -s http://localhost:$PORT > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Vue app is not running on port $PORT${NC}"
    echo -e "${YELLOW}Please start the Vue app first:${NC}"
    echo -e "  cd $PROJECT_DIR/apps/vue"
    echo -e "  npm run serve"
    exit 1
fi
echo -e "${GREEN}✓ Vue app is running${NC}"
echo ""

# Main loop for 5 runs
for run in $(seq 1 $RUNS); do
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Starting Run $run of $RUNS${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${BLUE}Time: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo ""
    
    # File names for this run
    ENERGY_FILE="$MEASUREMENTS_DIR/energy_simple_run${run}.json"
    
    # Step 1: Start Scaphandre in background
    echo -e "${YELLOW}[1/3] Starting Scaphandre energy monitoring...${NC}"
    echo -e "      Output: $ENERGY_FILE"
    sudo scaphandre json -t $SCAPHANDRE_DURATION -f "$ENERGY_FILE" > /dev/null 2>&1 &
    SCAPHANDRE_PID=$!
    echo -e "${GREEN}✓ Scaphandre started (PID: $SCAPHANDRE_PID)${NC}"
    
    # Small delay to ensure Scaphandre is ready
    sleep 2
    
    # Step 2: Run test scenario
    echo -e "${YELLOW}[2/3] Running test scenario...${NC}"
    cd "$TEST_SCRIPTS_DIR"
    node scenario-a-simple.js $FRAMEWORK $PORT
    
    # Step 3: Wait for Scaphandre to finish
    echo -e "${YELLOW}[3/3] Waiting for Scaphandre to complete...${NC}"
    wait $SCAPHANDRE_PID
    echo -e "${GREEN}✓ Scaphandre completed${NC}"
    
    # Verify energy file was created
    if [ -f "$ENERGY_FILE" ]; then
        FILE_SIZE=$(du -h "$ENERGY_FILE" | cut -f1)
        echo -e "${GREEN}✓ Energy data saved: $FILE_SIZE${NC}"
    else
        echo -e "${RED}✗ Warning: Energy file not created${NC}"
    fi
    
    echo -e "${GREEN}✓ Run $run completed successfully${NC}"
    echo ""
    
    # Cooldown period (except after last run)
    if [ $run -lt $RUNS ]; then
        echo -e "${BLUE}========================================${NC}"
        echo -e "${BLUE}Cooldown Period: $COOLDOWN_MINUTES minutes${NC}"
        echo -e "${BLUE}========================================${NC}"
        echo -e "${YELLOW}Next run will start at: $(date -d "+$COOLDOWN_MINUTES minutes" '+%H:%M:%S')${NC}"
        echo ""
        
        # Countdown timer
        for ((i=$COOLDOWN_SECONDS; i>0; i--)); do
            MINS=$((i / 60))
            SECS=$((i % 60))
            printf "\r${YELLOW}Time remaining: %02d:%02d${NC}" $MINS $SECS
            sleep 1
        done
        echo ""
        echo -e "${GREEN}Cooldown complete!${NC}"
        echo ""
    fi
done

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All Runs Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Summary:${NC}"
echo -e "  Total runs: $RUNS"
echo -e "  Framework: $FRAMEWORK"
echo -e "  Scenario: $SCENARIO"
echo -e "  Data location: $MEASUREMENTS_DIR"
echo ""
echo -e "${YELLOW}Files created:${NC}"
ls -lh "$MEASUREMENTS_DIR"/energy_simple_run*.json 2>/dev/null || echo "  No energy files found"
ls -lh "$MEASUREMENTS_DIR"/simple.json 2>/dev/null || echo "  No performance metrics file found"
echo ""
echo -e "${GREEN}✓ Experiment complete! Waiting for your next command.${NC}"
