#!/usr/bin/env python3
"""
Energy Data Merger Script
Parses Scaphandre JSON output and merges energy consumption data
with performance metrics from test scenario runs.
"""

import json
import os
import glob
from datetime import datetime

MEASUREMENTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'measurements')

def parse_scaphandre_json(filepath):
    """Parse Scaphandre JSON file and extract energy metrics."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Scaphandre outputs multiple JSON objects concatenated
        # Split by }{ to separate them
        content = content.replace('}{', '}\n{')
        records = []
        for line in content.strip().split('\n'):
            if line.strip():
                try:
                    records.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
        
        if not records:
            return None
        
        # Calculate total energy from host consumption values
        total_host_consumption_uj = 0
        peak_consumption = 0
        socket_consumptions = []
        
        for record in records:
            if 'host' in record and 'consumption' in record['host']:
                consumption = record['host']['consumption']
                total_host_consumption_uj += consumption
                if consumption > peak_consumption:
                    peak_consumption = consumption
            
            # Also get socket-level data
            if 'sockets' in record:
                for socket in record['sockets']:
                    if 'consumption' in socket:
                        socket_consumptions.append(socket['consumption'])
        
        # Calculate metrics
        total_energy_joules = total_host_consumption_uj / 1_000_000
        peak_power_watts = peak_consumption / 1_000_000  # Approximate
        
        # Socket total if available
        socket_total_uj = sum(socket_consumptions) if socket_consumptions else 0
        socket_total_joules = socket_total_uj / 1_000_000
        
        return {
            'total_energy_joules': round(total_energy_joules, 4),
            'peak_power_watts': round(peak_power_watts, 4),
            'socket_energy_joules': round(socket_total_joules, 4),
            'sample_count': len(records),
            'source_file': os.path.basename(filepath)
        }
    
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None


def merge_with_performance_data(framework, scenario, energy_data):
    """Merge energy data with performance metrics."""
    perf_file = os.path.join(MEASUREMENTS_DIR, framework, f'{scenario}.json')
    
    if not os.path.exists(perf_file):
        print(f"Performance file not found: {perf_file}")
        return None
    
    try:
        # Read existing performance data (multiple JSON lines)
        with open(perf_file, 'r') as f:
            lines = f.readlines()
        
        if not lines:
            return None
        
        # Get the last (most recent) record
        last_record = None
        for line in reversed(lines):
            if line.strip():
                try:
                    last_record = json.loads(line.strip())
                    break
                except json.JSONDecodeError:
                    continue
        
        if not last_record:
            return None
        
        # Merge energy data into the record
        last_record['energy_joules'] = energy_data['total_energy_joules']
        last_record['peak_power_watts'] = energy_data['peak_power_watts']
        last_record['socket_energy_joules'] = energy_data['socket_energy_joules']
        last_record['energy_sample_count'] = energy_data['sample_count']
        last_record['energy_source_file'] = energy_data['source_file']
        
        return last_record
    
    except Exception as e:
        print(f"Error merging data: {e}")
        return None


def save_merged_data(framework, scenario, merged_data):
    """Save merged data to a new file."""
    output_dir = os.path.join(MEASUREMENTS_DIR, framework)
    output_file = os.path.join(output_dir, f'{scenario}_merged.json')
    
    try:
        with open(output_file, 'w') as f:
            json.dump(merged_data, f, indent=2)
        print(f"Saved merged data to: {output_file}")
        return output_file
    except Exception as e:
        print(f"Error saving: {e}")
        return None


def process_framework_scenario(framework, scenario):
    """Process a framework-scenario combination."""
    print(f"\n{'='*60}")
    print(f"Processing: {framework} - {scenario}")
    print('='*60)
    
    # Find the latest energy file for this scenario
    energy_pattern = os.path.join(MEASUREMENTS_DIR, framework, f'energy_{scenario}_*.json')
    energy_files = sorted(glob.glob(energy_pattern))
    
    if not energy_files:
        print(f"No energy files found matching: {energy_pattern}")
        return None
    
    # Use the most recent energy file
    latest_energy_file = energy_files[-1]
    print(f"Using energy file: {latest_energy_file}")
    
    # Parse energy data
    energy_data = parse_scaphandre_json(latest_energy_file)
    if not energy_data:
        print("Failed to parse energy data")
        return None
    
    print(f"\nEnergy Metrics:")
    print(f"  Total Energy: {energy_data['total_energy_joules']:.4f} Joules")
    print(f"  Peak Power:   {energy_data['peak_power_watts']:.4f} Watts")
    print(f"  Socket Energy:{energy_data['socket_energy_joules']:.4f} Joules")
    print(f"  Samples:      {energy_data['sample_count']}")
    
    # Merge with performance data
    merged = merge_with_performance_data(framework, scenario, energy_data)
    if not merged:
        print("Failed to merge data")
        return None
    
    print(f"\nPerformance Metrics:")
    if 'totalDuration' in merged:
        print(f"  Total Duration: {merged['totalDuration']} ms")
    if 'actions' in merged:
        for action in merged['actions']:
            if isinstance(action, dict) and 'action' in action:
                print(f"  - {action['action']}: {action.get('duration', 'N/A')} ms")
    
    # Save merged data
    output_file = save_merged_data(framework, scenario, merged)
    
    return merged


def main():
    print("="*60)
    print("Energy Data Merger - Frontend Energy Study")
    print("="*60)
    
    # Process all frameworks
    frameworks = ['react', 'vue']  # Add more: 'angular', 'svelte'
    scenarios = ['simple', 'medium', 'complex']  # All 3 scenarios
    
    results = []
    for framework in frameworks:
        for scenario in scenarios:
            result = process_framework_scenario(framework, scenario)
            if result:
                results.append(result)
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    for result in results:
        print(f"\n{result['framework'].upper()} - {result['scenario']}:")
        print(f"  Energy:   {result.get('energy_joules', 'N/A')} J")
        print(f"  Duration: {result.get('totalDuration', 'N/A')} ms")
        if 'error' not in result:
            print(f"  Status:   ✅ Complete")
        else:
            print(f"  Status:   ⚠️ {result['error']}")


if __name__ == '__main__':
    main()
