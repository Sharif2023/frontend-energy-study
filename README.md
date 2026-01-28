# Energy Consumption Comparison Study

## Research Topic
**Energy Consumption Comparison of React, Vue, Angular, and Svelte: A Software-Based Empirical Study**

This repository contains the complete experimental setup for comparing energy consumption across four modern JavaScript frameworks: React, Vue.js, Angular, and Svelte.

## Project Structure

```
frontend-energy-study/
├── apps/                    # Framework applications
│   ├── react/              # React application
│   ├── vue/                # Vue.js application
│   ├── angular/            # Angular application
│   └── svelte/             # Svelte application
├── analysis/               # Statistical analysis scripts
│   ├── analyze.py          # Main analysis script
│   └── requirements.txt    # Python dependencies
├── test-scripts/           # Automated test scenarios
│   ├── scenario-a-simple.js
│   ├── scenario-b-medium.js
│   ├── scenario-c-complex.js
│   └── run-all-scenarios.js
├── measurements/           # Energy measurement data (generated)
└── docs/                   # Documentation and manuscripts
```

## Features Implemented

Each framework application implements identical functionality:

### 1. Dynamic Item List
- Add 100 items at once
- Remove 50 items at once
- Filter items by text query
- Sort by name or ID
- Support for 100, 1,000, and 5,000 items

### 2. Real-time Widgets (25 total)
- 24 placeholder widgets with random colors and numbers
- 1 live weather API widget (mock REST calls for consistency)

### 3. Routing/Navigation
- Home (dashboard)
- About (static content)
- Contact (form with validation)

### 4. State Management
- Global item counter
- Widget refresh counter
- Form validation state
- Page load tracking

## Test Scenarios

### Scenario A - Simple (100 items x 50 time)
- Load dashboard
- Add 100 items x 50 time → 5,000 total items triggers re-render
- Filter items → DOM mutations
- Navigate between 3 pages
- **Expected duration**: ~15-20 seconds

### Scenario B - Medium (1,00 items x 250 time)
- Load dashboard
- Add 100 items × 250 time → 25,000 total
- Filter + sort → heavy computation
- Refresh all 25 widgets
- Navigate + form submission
- **Expected duration**: ~50-60 seconds

### Scenario C - Complex (100 items x 500 time)
- Load dashboard
- Add 100 items × 500 → 50,000 total
- Filter + sort + multiple widget updates
- Rapid navigation (3 pages × 2)
- **Expected duration**: ~80-100 seconds

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+ (for analysis)
- npm or yarn

### Installing Dependencies

#### React
```bash
cd apps/react
npm install
```

#### Vue
```bash
cd apps/vue
npm install
```

#### Angular
```bash
cd apps/angular
npm install
```

#### Svelte
```bash
cd apps/svelte
npm install
```

#### Test Scripts
```bash
cd test-scripts
npm install
```

#### Analysis Scripts
```bash
cd analysis
pip install -r requirements.txt
```

## Running the Applications

### React
```bash
cd apps/react
npm start
# Application runs on http://localhost:3000
```

### Vue
```bash
cd apps/vue
npm run serve
# Application runs on http://localhost:8080 (or next available port)
```

### Angular
```bash
cd apps/angular
npm start
# Application runs on http://localhost:4200
```

### Svelte
```bash
cd apps/svelte
npm run dev
# Application runs on http://localhost:5173
```

## Running Test Scenarios

### Individual Scenarios
```bash
cd test-scripts

# Run simple scenario
node scenario-a-simple.js react 3000

# Run medium scenario
node scenario-b-medium.js vue 8080

# Run complex scenario
node scenario-c-complex.js angular 4200
```

### Run All Scenarios
```bash
cd test-scripts
node run-all-scenarios.js [framework] [port]
```

## Energy Measurement

### Recommended Tools
1. **Scaphandre** (Linux) - RAPL-compatible energy monitoring
2. **Joulemeter** (Windows) - Microsoft energy measurement tool
3. **External Power Meter** - Hardware-based measurement

### Measurement Process
1. Start energy monitoring tool
2. Launch the framework application
3. Run test scenarios using Puppeteer scripts
4. Collect metrics:
   - Energy consumption (Joules)
   - Peak power (Watts)
   - Render time (ms)
   - Memory usage (MB)
   - DOM mutations

### Data Format
Measurements are stored in JSON format:
```json
{
  "scenario": "simple",
  "framework": "react",
  "timestamp": "2024-01-01T00:00:00Z",
  "energy_joules": 125.5,
  "peak_power_watts": 45.2,
  "totalDuration": 3245,
  "actions": [...]
}
```

## Statistical Analysis

### Running Analysis
```bash
cd analysis
python analyze.py
```

### Analysis Outputs

The analysis script generates:

1. **Descriptive Statistics** (`descriptive_statistics.csv`)
   - Mean, SD, min, max, median for each framework/scenario

2. **Normality Tests** (`normality_tests.csv`)
   - Shapiro-Wilk test results

3. **Kruskal-Wallis Test** (`kruskal_wallis_*.csv`)
   - Non-parametric test for framework differences

4. **Mann-Whitney U Post-hoc** (`mann_whitney_posthoc_*.csv`)
   - Pairwise comparisons with Bonferroni correction

5. **Correlation Analysis** (`correlation_analysis.csv`)
   - Spearman correlation between energy and performance

6. **Publication-Quality Plots**
   - `01_energy_boxplot.png` - Boxplots comparing frameworks
   - `02_scaling_graph.png` - Scaling curves across workloads
   - `03_correlation.png` - Energy vs. performance scatterplots
   - `04_framework_comparison.png` - Bar chart comparison
   - `05_significance_heatmap.png` - Statistical significance heatmap

## Experiment Design

### Sample Size
- 60 runs total
- 4 frameworks × 3 workloads × 5 repetitions
- Daily measurements (~2 hours) with 10-minute cooldowns

### Variables
- **Independent**: Framework (React, Vue, Angular, Svelte)
- **Dependent**: Energy consumption, performance metrics
- **Control**: Identical functionality, same hardware, same test scenarios

## Research Methodology

1. **Identical Implementation**: All frameworks implement the same features
2. **Controlled Environment**: Same hardware, same browser, same conditions
3. **Repeated Measures**: Multiple runs for statistical validity
4. **Statistical Analysis**: Non-parametric tests (Kruskal-Wallis, Mann-Whitney U)
5. **Multiple Metrics**: Energy, performance, memory, DOM mutations

## Contributing

When adding measurements or modifying applications:
1. Ensure all frameworks maintain identical functionality
2. Update measurements in JSON format
3. Re-run analysis scripts to update results
4. Document any changes to test scenarios

## License

This research project is for academic purposes.

## Contact

For questions about the research or setup, please refer to the Contact page in any of the framework applications.

## References

- RAPL (Running Average Power Limit) - Intel power measurement
- Scaphandre - Energy monitoring tool
- Statistical methods: Kruskal-Wallis, Mann-Whitney U, Spearman correlation