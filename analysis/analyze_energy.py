#!/usr/bin/env python3
"""
Energy Data Analysis Script
Processes energy measurement data from frontend framework tests
"""

import json
import os
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, List, Tuple

# Configuration
MEASUREMENTS_DIR = Path(__file__).parent.parent / "measurements"
OUTPUT_DIR = Path(__file__).parent / "results"
FRAMEWORKS = ["angular", "react", "svelte", "vue"]
SCENARIOS = ["simple", "medium", "complex"]
RUNS = 5

def parse_energy_file(filepath: Path) -> Dict:
    """
    Parse a single energy measurement JSON file and extract key metrics.
    
    Returns:
        Dict with total_energy, core_energy, uncore_energy, duration, samples
    """
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            # Handle both array format and newline-delimited JSON
            if content.strip().startswith('['):
                data = json.loads(content)
            else:
                # Parse newline-delimited JSON
                data = [json.loads(line) for line in content.strip().split('}\n{') 
                       if line.strip()]
                # Fix the split artifacts
                if len(data) > 1:
                    for i in range(len(data)):
                        if not str(data[i]).startswith('{'):
                            data[i] = '{' + str(data[i])
                        if not str(data[i]).endswith('}'):
                            data[i] = str(data[i]) + '}'
                    data = [json.loads(item) if isinstance(item, str) else item 
                           for item in data]
        
        total_energy = 0
        core_energy = 0
        uncore_energy = 0
        samples = len(data)
        
        # Extract energy from each sample
        for sample in data:
            if 'host' in sample and 'consumption' in sample['host']:
                total_energy += sample['host']['consumption']
            
            # Extract socket-level data for core/uncore breakdown
            if 'sockets' in sample and len(sample['sockets']) > 0:
                for socket in sample['sockets']:
                    if 'domains' in socket:
                        for domain in socket['domains']:
                            if domain['name'] == 'core':
                                core_energy += domain['consumption']
                            elif domain['name'] == 'uncore':
                                uncore_energy += domain['consumption']
        
        # Get duration (timestamp difference between first and last sample)
        duration = 0
        if samples > 1:
            first_ts = data[0].get('host', {}).get('timestamp', 0)
            last_ts = data[-1].get('host', {}).get('timestamp', 0)
            duration = last_ts - first_ts
        
        return {
            'total_energy': total_energy,
            'core_energy': core_energy,
            'uncore_energy': uncore_energy,
            'duration': duration,
            'samples': samples,
            'avg_power': total_energy / duration if duration > 0 else 0
        }
    
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None

def collect_all_measurements() -> pd.DataFrame:
    """
    Collect all energy measurements into a structured DataFrame.
    """
    results = []
    
    for framework in FRAMEWORKS:
        framework_dir = MEASUREMENTS_DIR / framework
        
        if not framework_dir.exists():
            print(f"Warning: Directory not found: {framework_dir}")
            continue
        
        for scenario in SCENARIOS:
            for run in range(1, RUNS + 1):
                filename = f"energy_{scenario}_run{run}.json"
                filepath = framework_dir / filename
                
                if not filepath.exists():
                    print(f"Warning: File not found: {filepath}")
                    continue
                
                print(f"Processing: {framework}/{scenario}/run{run}")
                metrics = parse_energy_file(filepath)
                
                if metrics:
                    results.append({
                        'framework': framework,
                        'scenario': scenario,
                        'run': run,
                        'total_energy_uJ': metrics['total_energy'],
                        'total_energy_J': metrics['total_energy'] / 1_000_000,
                        'core_energy_uJ': metrics['core_energy'],
                        'core_energy_J': metrics['core_energy'] / 1_000_000,
                        'uncore_energy_uJ': metrics['uncore_energy'],
                        'uncore_energy_J': metrics['uncore_energy'] / 1_000_000,
                        'duration_s': metrics['duration'],
                        'avg_power_W': metrics['avg_power'] / 1_000_000,
                        'samples': metrics['samples']
                    })
    
    return pd.DataFrame(results)

def calculate_statistics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate statistical metrics for each framework-scenario combination.
    """
    stats = df.groupby(['framework', 'scenario']).agg({
        'total_energy_J': ['mean', 'std', 'min', 'max', 'median'],
        'core_energy_J': ['mean', 'std'],
        'uncore_energy_J': ['mean', 'std'],
        'avg_power_W': ['mean', 'std'],
        'duration_s': ['mean', 'std']
    }).round(4)
    
    # Flatten column names
    stats.columns = ['_'.join(col).strip() for col in stats.columns.values]
    stats = stats.reset_index()
    
    # Calculate coefficient of variation (CV) for reliability analysis
    stats['energy_cv'] = (stats['total_energy_J_std'] / stats['total_energy_J_mean'] * 100).round(2)
    
    # Calculate core/uncore ratio
    stats['core_ratio'] = (stats['core_energy_J_mean'] / 
                          (stats['core_energy_J_mean'] + stats['uncore_energy_J_mean']) * 100).round(2)
    
    return stats

def generate_summary_report(df: pd.DataFrame, stats: pd.DataFrame) -> str:
    """
    Generate a text summary report of the analysis.
    """
    report = []
    report.append("=" * 80)
    report.append("ENERGY CONSUMPTION ANALYSIS REPORT")
    report.append("Frontend Framework Comparison Study")
    report.append("=" * 80)
    report.append("")
    
    report.append(f"Total measurements analyzed: {len(df)}")
    report.append(f"Frameworks: {', '.join(FRAMEWORKS)}")
    report.append(f"Scenarios: {', '.join(SCENARIOS)}")
    report.append(f"Runs per scenario: {RUNS}")
    report.append("")
    
    report.append("-" * 80)
    report.append("OVERALL FRAMEWORK RANKING (by average total energy)")
    report.append("-" * 80)
    
    overall = df.groupby('framework')['total_energy_J'].mean().sort_values()
    for rank, (framework, energy) in enumerate(overall.items(), 1):
        report.append(f"{rank}. {framework.capitalize():10s} - {energy:.2f} J (avg)")
    report.append("")
    
    report.append("-" * 80)
    report.append("SCENARIO-WISE COMPARISON")
    report.append("-" * 80)
    
    for scenario in SCENARIOS:
        report.append(f"\n{scenario.upper()} Scenario:")
        scenario_data = stats[stats['scenario'] == scenario].sort_values('total_energy_J_mean')
        for _, row in scenario_data.iterrows():
            report.append(f"  {row['framework'].capitalize():10s}: "
                        f"{row['total_energy_J_mean']:8.2f} J ± {row['total_energy_J_std']:6.2f} J "
                        f"(CV: {row['energy_cv']:5.2f}%)")
    
    report.append("")
    report.append("-" * 80)
    report.append("ENERGY EFFICIENCY INSIGHTS")
    report.append("-" * 80)
    
    # Most consistent framework (lowest CV)
    most_consistent_series = stats.groupby('framework')['energy_cv'].mean().sort_values()
    most_consistent_fw = most_consistent_series.index[0]
    most_consistent_val = most_consistent_series.iloc[0]
    report.append(f"Most consistent: {most_consistent_fw.capitalize()} "
                 f"(avg CV: {most_consistent_val:.2f}%)")
    
    # Best scaling (smallest increase from simple to complex)
    scaling = {}
    for framework in FRAMEWORKS:
        simple = stats[(stats['framework'] == framework) & 
                      (stats['scenario'] == 'simple')]['total_energy_J_mean'].values[0]
        complex_val = stats[(stats['framework'] == framework) & 
                           (stats['scenario'] == 'complex')]['total_energy_J_mean'].values[0]
        scaling[framework] = (complex_val - simple) / simple * 100
    
    best_scaling = min(scaling.items(), key=lambda x: x[1])
    report.append(f"Best scaling: {best_scaling[0].capitalize()} "
                 f"({best_scaling[1]:.1f}% increase from simple to complex)")
    
    report.append("")
    report.append("=" * 80)
    
    return "\n".join(report)

def main():
    """Main execution function."""
    print("Starting energy data analysis...")
    print(f"Measurements directory: {MEASUREMENTS_DIR}")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "diagrams").mkdir(exist_ok=True)
    (OUTPUT_DIR / "tables").mkdir(exist_ok=True)
    
    # Collect all measurements
    print("\nCollecting measurements...")
    df = collect_all_measurements()
    
    if df.empty:
        print("Error: No data collected!")
        return
    
    print(f"Collected {len(df)} measurements")
    
    # Calculate statistics
    print("\nCalculating statistics...")
    stats = calculate_statistics(df)
    
    # Save processed data
    print("\nSaving processed data...")
    df.to_csv(OUTPUT_DIR / "processed_data.csv", index=False)
    stats.to_csv(OUTPUT_DIR / "summary_statistics.csv", index=False)
    
    # Generate and save report
    print("\nGenerating summary report...")
    report = generate_summary_report(df, stats)
    with open(OUTPUT_DIR / "analysis_report.txt", 'w') as f:
        f.write(report)
    
    print(report)
    
    print(f"\n✓ Analysis complete! Results saved to {OUTPUT_DIR}")
    print(f"  - processed_data.csv: Raw measurements")
    print(f"  - summary_statistics.csv: Statistical summary")
    print(f"  - analysis_report.txt: Text report")

if __name__ == "__main__":
    main()
