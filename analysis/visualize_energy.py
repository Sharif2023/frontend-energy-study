#!/usr/bin/env python3
"""
Energy Data Visualization Script
Generates comprehensive comparison diagrams for green computing research
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from scipy import stats as scipy_stats

# Configuration
RESULTS_DIR = Path(__file__).parent / "results"
DIAGRAMS_DIR = RESULTS_DIR / "diagrams"
FRAMEWORKS = ["angular", "react", "svelte", "vue"]
SCENARIOS = ["simple", "medium", "complex"]

# Bangladesh Grid Emission Factor (GEF)
BANGLADESH_GEF = 632  # g CO2/kWh

# Set publication-quality style
plt.style.use('seaborn-v0_8-paper')
sns.set_palette("husl")
plt.rcParams['figure.dpi'] = 300
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['font.size'] = 10
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['xtick.labelsize'] = 9
plt.rcParams['ytick.labelsize'] = 9
plt.rcParams['legend.fontsize'] = 9
plt.rcParams['figure.titlesize'] = 13

# Color scheme for frameworks
COLORS = {
    'angular': '#dd0031',
    'react': '#61dafb',
    'svelte': '#ff3e00',
    'vue': '#42b883'
}

def load_data():
    """Load processed data and statistics."""
    df = pd.read_csv(RESULTS_DIR / "processed_data.csv")
    stats = pd.read_csv(RESULTS_DIR / "summary_statistics.csv")
    return df, stats

def plot_overall_comparison(df, stats):
    """
    Diagram 1: Overall framework comparison with error bars.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Calculate overall means and stds
    overall = df.groupby('framework')['total_energy_J'].agg(['mean', 'std']).reset_index()
    overall = overall.sort_values('mean')
    
    colors = [COLORS[fw] for fw in overall['framework']]
    
    bars = ax.bar(range(len(overall)), overall['mean'], 
                   yerr=overall['std'], capsize=5,
                   color=colors, alpha=0.8, edgecolor='black', linewidth=1.2)
    
    ax.set_xlabel('Framework', fontweight='bold')
    ax.set_ylabel('Total Energy Consumption (J)', fontweight='bold')
    ax.set_title('Overall Energy Consumption Comparison Across Frontend Frameworks\n(Bangladesh GEF: 632 g CO₂/kWh)', 
                 fontweight='bold', pad=20)
    ax.set_xticks(range(len(overall)))
    ax.set_xticklabels([fw.capitalize() for fw in overall['framework']])
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels on bars
    for i, (bar, row) in enumerate(zip(bars, overall.itertuples())):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{row.mean:.2f}J\n±{row.std:.2f}',
                ha='center', va='bottom', fontsize=8, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "01_overall_comparison.png", bbox_inches='tight')
    print("✓ Generated: 01_overall_comparison.png")
    plt.close()

def plot_scenario_comparison(stats):
    """
    Diagram 2: Grouped bar chart for scenario-based comparison.
    """
    fig, ax = plt.subplots(figsize=(12, 6))
    
    x = np.arange(len(SCENARIOS))
    width = 0.2
    
    for i, framework in enumerate(FRAMEWORKS):
        fw_data = stats[stats['framework'] == framework].sort_values('scenario', 
                       key=lambda x: x.map({s: i for i, s in enumerate(SCENARIOS)}))
        
        means = fw_data['total_energy_J_mean'].values
        stds = fw_data['total_energy_J_std'].values
        
        offset = (i - 1.5) * width
        bars = ax.bar(x + offset, means, width, label=framework.capitalize(),
                      yerr=stds, capsize=3, color=COLORS[framework], 
                      alpha=0.8, edgecolor='black', linewidth=0.8)
    
    ax.set_xlabel('Test Scenario', fontweight='bold')
    ax.set_ylabel('Energy Consumption (J)', fontweight='bold')
    ax.set_title('Energy Consumption by Framework and Scenario\n(Lower is Better for Environment)', 
                 fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels([s.capitalize() for s in SCENARIOS])
    ax.legend(title='Framework', loc='upper left', framealpha=0.9)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "02_scenario_comparison.png", bbox_inches='tight')
    print("✓ Generated: 02_scenario_comparison.png")
    plt.close()

def plot_distribution_boxplots(df):
    """
    Diagram 3: Box plots showing distribution across runs.
    """
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    
    for idx, scenario in enumerate(SCENARIOS):
        ax = axes[idx]
        scenario_data = df[df['scenario'] == scenario]
        
        # Prepare data for box plot
        data_to_plot = [scenario_data[scenario_data['framework'] == fw]['total_energy_J'].values 
                       for fw in FRAMEWORKS]
        
        bp = ax.boxplot(data_to_plot, labels=[fw.capitalize() for fw in FRAMEWORKS],
                        patch_artist=True, showmeans=True,
                        meanprops=dict(marker='D', markerfacecolor='red', markersize=5))
        
        # Color the boxes
        for patch, framework in zip(bp['boxes'], FRAMEWORKS):
            patch.set_facecolor(COLORS[framework])
            patch.set_alpha(0.7)
        
        ax.set_title(f'{scenario.capitalize()} Scenario', fontweight='bold')
        ax.set_ylabel('Energy Consumption (J)', fontweight='bold')
        ax.set_xlabel('Framework', fontweight='bold')
        ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    fig.suptitle('Energy Consumption Distribution Across 5 Runs', 
                 fontweight='bold', fontsize=14, y=1.02)
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "03_distribution_boxplots.png", bbox_inches='tight')
    print("✓ Generated: 03_distribution_boxplots.png")
    plt.close()

def plot_component_breakdown(stats):
    """
    Diagram 4: Stacked bar charts for CPU component breakdown.
    """
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    
    for idx, scenario in enumerate(SCENARIOS):
        ax = axes[idx]
        scenario_data = stats[stats['scenario'] == scenario].sort_values('framework')
        
        frameworks_list = scenario_data['framework'].values
        core = scenario_data['core_energy_J_mean'].values
        uncore = scenario_data['uncore_energy_J_mean'].values
        
        x = np.arange(len(frameworks_list))
        
        p1 = ax.bar(x, core, label='Core', color='#2ecc71', alpha=0.8, edgecolor='black')
        p2 = ax.bar(x, uncore, bottom=core, label='Uncore', 
                   color='#e74c3c', alpha=0.8, edgecolor='black')
        
        ax.set_title(f'{scenario.capitalize()} Scenario', fontweight='bold')
        ax.set_ylabel('Energy Consumption (J)', fontweight='bold')
        ax.set_xlabel('Framework', fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([fw.capitalize() for fw in frameworks_list])
        ax.legend(loc='upper left')
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        
        # Add percentage labels
        for i, (c, u) in enumerate(zip(core, uncore)):
            total = c + u
            if total > 0:
                core_pct = c / total * 100
                ax.text(i, c/2, f'{core_pct:.1f}%', ha='center', va='center', 
                       fontsize=8, fontweight='bold', color='white')
    
    fig.suptitle('CPU Energy Component Breakdown (Core vs Uncore)', 
                 fontweight='bold', fontsize=14, y=1.02)
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "04_component_breakdown.png", bbox_inches='tight')
    print("✓ Generated: 04_component_breakdown.png")
    plt.close()

def plot_efficiency_metrics(stats):
    """
    Diagram 5: Energy efficiency metrics comparison.
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Normalize by simple scenario (efficiency ratio)
    efficiency_data = []
    for framework in FRAMEWORKS:
        fw_stats = stats[stats['framework'] == framework]
        simple_energy = fw_stats[fw_stats['scenario'] == 'simple']['total_energy_J_mean'].values[0]
        
        for scenario in SCENARIOS:
            energy = fw_stats[fw_stats['scenario'] == scenario]['total_energy_J_mean'].values[0]
            ratio = energy / simple_energy
            efficiency_data.append({
                'framework': framework,
                'scenario': scenario,
                'efficiency_ratio': ratio
            })
    
    eff_df = pd.DataFrame(efficiency_data)
    
    # Plot 1: Efficiency ratio
    for framework in FRAMEWORKS:
        fw_data = eff_df[eff_df['framework'] == framework]
        x = [SCENARIOS.index(s) for s in fw_data['scenario']]
        y = fw_data['efficiency_ratio'].values
        ax1.plot(x, y, marker='o', label=framework.capitalize(), 
                color=COLORS[framework], linewidth=2, markersize=8)
    
    ax1.set_xlabel('Test Scenario', fontweight='bold')
    ax1.set_ylabel('Energy Ratio (normalized to Simple)', fontweight='bold')
    ax1.set_title('Energy Scaling Efficiency', fontweight='bold')
    ax1.set_xticks(range(len(SCENARIOS)))
    ax1.set_xticklabels([s.capitalize() for s in SCENARIOS])
    ax1.legend(title='Framework')
    ax1.grid(True, alpha=0.3, linestyle='--')
    ax1.axhline(y=1, color='gray', linestyle='--', alpha=0.5)
    
    # Plot 2: Coefficient of Variation (consistency)
    cv_data = stats.groupby('framework')['energy_cv'].mean().sort_values()
    colors_cv = [COLORS[fw] for fw in cv_data.index]
    
    bars = ax2.barh(range(len(cv_data)), cv_data.values, color=colors_cv, 
                    alpha=0.8, edgecolor='black', linewidth=1.2)
    ax2.set_yticks(range(len(cv_data)))
    ax2.set_yticklabels([fw.capitalize() for fw in cv_data.index])
    ax2.set_xlabel('Coefficient of Variation (%)', fontweight='bold')
    ax2.set_title('Measurement Consistency (Lower is Better)', fontweight='bold')
    ax2.grid(axis='x', alpha=0.3, linestyle='--')
    
    # Add value labels
    for i, (bar, val) in enumerate(zip(bars, cv_data.values)):
        ax2.text(val, bar.get_y() + bar.get_height()/2, f'{val:.2f}%',
                ha='left', va='center', fontsize=9, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "05_efficiency_metrics.png", bbox_inches='tight')
    print("✓ Generated: 05_efficiency_metrics.png")
    plt.close()

def plot_heatmap(stats):
    """
    Diagram 6: Heatmap for framework-scenario comparison.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Pivot data for heatmap
    heatmap_data = stats.pivot(index='framework', columns='scenario', 
                                values='total_energy_J_mean')
    heatmap_data = heatmap_data[[s for s in SCENARIOS]]  # Ensure order
    heatmap_data.index = [fw.capitalize() for fw in heatmap_data.index]
    heatmap_data.columns = [s.capitalize() for s in heatmap_data.columns]
    
    sns.heatmap(heatmap_data, annot=True, fmt='.2f', cmap='YlOrRd', 
                cbar_kws={'label': 'Energy (J)'}, linewidths=0.5,
                ax=ax, vmin=0)
    
    ax.set_title('Energy Consumption Heatmap: Framework × Scenario', 
                 fontweight='bold', pad=20)
    ax.set_xlabel('Test Scenario', fontweight='bold')
    ax.set_ylabel('Framework', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "06_heatmap.png", bbox_inches='tight')
    print("✓ Generated: 06_heatmap.png")
    plt.close()

def plot_timeseries_power(df):
    """
    Diagram 7: Average power consumption comparison.
    """
    fig, ax = plt.subplots(figsize=(12, 6))
    
    x = np.arange(len(SCENARIOS))
    width = 0.2
    
    for i, framework in enumerate(FRAMEWORKS):
        fw_data = df[df['framework'] == framework].groupby('scenario')['avg_power_W'].mean()
        fw_data = fw_data.reindex(SCENARIOS)
        
        offset = (i - 1.5) * width
        bars = ax.bar(x + offset, fw_data.values, width, 
                      label=framework.capitalize(),
                      color=COLORS[framework], alpha=0.8, 
                      edgecolor='black', linewidth=0.8)
        
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.2f}W', ha='center', va='bottom', 
                   fontsize=7, rotation=0)
    
    ax.set_xlabel('Test Scenario', fontweight='bold')
    ax.set_ylabel('Average Power Consumption (W)', fontweight='bold')
    ax.set_title('Average Power Consumption by Framework and Scenario', 
                 fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels([s.capitalize() for s in SCENARIOS])
    ax.legend(title='Framework', loc='upper left', framealpha=0.9)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "07_power_consumption.png", bbox_inches='tight')
    print("✓ Generated: 07_power_consumption.png")
    plt.close()

def plot_statistical_summary(df, stats):
    """
    Diagram 8: Statistical summary visualization.
    """
    fig = plt.figure(figsize=(14, 10))
    gs = fig.add_gridspec(3, 2, hspace=0.3, wspace=0.3)
    
    # 1. Overall ranking
    ax1 = fig.add_subplot(gs[0, :])
    overall = df.groupby('framework')['total_energy_J'].mean().sort_values()
    colors_rank = [COLORS[fw] for fw in overall.index]
    bars = ax1.barh(range(len(overall)), overall.values, color=colors_rank, 
                    alpha=0.8, edgecolor='black', linewidth=1.2)
    ax1.set_yticks(range(len(overall)))
    ax1.set_yticklabels([f"{i+1}. {fw.capitalize()}" for i, fw in enumerate(overall.index)])
    ax1.set_xlabel('Average Total Energy (J)', fontweight='bold')
    ax1.set_title('Overall Framework Ranking', fontweight='bold')
    ax1.grid(axis='x', alpha=0.3, linestyle='--')
    for i, (bar, val) in enumerate(zip(bars, overall.values)):
        ax1.text(val, bar.get_y() + bar.get_height()/2, f'  {val:.2f} J',
                ha='left', va='center', fontsize=9, fontweight='bold')
    
    # 2. Min-Max range per framework
    ax2 = fig.add_subplot(gs[1, 0])
    for framework in FRAMEWORKS:
        fw_data = df[df['framework'] == framework]['total_energy_J']
        min_val, max_val = fw_data.min(), fw_data.max()
        mean_val = fw_data.mean()
        
        y_pos = FRAMEWORKS.index(framework)
        ax2.plot([min_val, max_val], [y_pos, y_pos], 'o-', 
                color=COLORS[framework], linewidth=2, markersize=6)
        ax2.plot(mean_val, y_pos, 'D', color='red', markersize=8)
    
    ax2.set_yticks(range(len(FRAMEWORKS)))
    ax2.set_yticklabels([fw.capitalize() for fw in FRAMEWORKS])
    ax2.set_xlabel('Energy (J)', fontweight='bold')
    ax2.set_title('Energy Range (Min-Max) with Mean', fontweight='bold')
    ax2.grid(axis='x', alpha=0.3, linestyle='--')
    ax2.legend(['Range', 'Mean'], loc='best')
    
    # 3. Standard deviation comparison
    ax3 = fig.add_subplot(gs[1, 1])
    std_data = stats.groupby('framework')['total_energy_J_std'].mean().sort_values()
    colors_std = [COLORS[fw] for fw in std_data.index]
    bars = ax3.bar(range(len(std_data)), std_data.values, color=colors_std,
                   alpha=0.8, edgecolor='black', linewidth=1.2)
    ax3.set_xticks(range(len(std_data)))
    ax3.set_xticklabels([fw.capitalize() for fw in std_data.index])
    ax3.set_ylabel('Standard Deviation (J)', fontweight='bold')
    ax3.set_title('Measurement Variability', fontweight='bold')
    ax3.grid(axis='y', alpha=0.3, linestyle='--')
    for bar in bars:
        height = bar.get_height()
        ax3.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.2f}', ha='center', va='bottom', fontsize=8)
    
    # 4. Energy increase from simple to complex
    ax4 = fig.add_subplot(gs[2, 0])
    increases = []
    for framework in FRAMEWORKS:
        simple = stats[(stats['framework'] == framework) & 
                      (stats['scenario'] == 'simple')]['total_energy_J_mean'].values[0]
        complex_val = stats[(stats['framework'] == framework) & 
                           (stats['scenario'] == 'complex')]['total_energy_J_mean'].values[0]
        increase_pct = (complex_val - simple) / simple * 100
        increases.append(increase_pct)
    
    colors_inc = [COLORS[fw] for fw in FRAMEWORKS]
    bars = ax4.bar(range(len(FRAMEWORKS)), increases, color=colors_inc,
                   alpha=0.8, edgecolor='black', linewidth=1.2)
    ax4.set_xticks(range(len(FRAMEWORKS)))
    ax4.set_xticklabels([fw.capitalize() for fw in FRAMEWORKS])
    ax4.set_ylabel('Increase (%)', fontweight='bold')
    ax4.set_title('Energy Increase: Simple → Complex', fontweight='bold')
    ax4.grid(axis='y', alpha=0.3, linestyle='--')
    for bar, val in zip(bars, increases):
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2., height,
                f'{val:.1f}%', ha='center', va='bottom', fontsize=8)
    
    # 5. Core energy percentage
    ax5 = fig.add_subplot(gs[2, 1])
    core_pcts = []
    for framework in FRAMEWORKS:
        fw_stats = stats[stats['framework'] == framework]
        core_avg = fw_stats['core_energy_J_mean'].mean()
        uncore_avg = fw_stats['uncore_energy_J_mean'].mean()
        core_pct = core_avg / (core_avg + uncore_avg) * 100
        core_pcts.append(core_pct)
    
    colors_core = [COLORS[fw] for fw in FRAMEWORKS]
    bars = ax5.bar(range(len(FRAMEWORKS)), core_pcts, color=colors_core,
                   alpha=0.8, edgecolor='black', linewidth=1.2)
    ax5.set_xticks(range(len(FRAMEWORKS)))
    ax5.set_xticklabels([fw.capitalize() for fw in FRAMEWORKS])
    ax5.set_ylabel('Core Energy (%)', fontweight='bold')
    ax5.set_title('Average Core Energy Percentage', fontweight='bold')
    ax5.grid(axis='y', alpha=0.3, linestyle='--')
    ax5.axhline(y=50, color='gray', linestyle='--', alpha=0.5)
    for bar, val in zip(bars, core_pcts):
        height = bar.get_height()
        ax5.text(bar.get_x() + bar.get_width()/2., height,
                f'{val:.1f}%', ha='center', va='bottom', fontsize=8)
    
    fig.suptitle('Statistical Summary Dashboard', fontweight='bold', fontsize=16)
    plt.savefig(DIAGRAMS_DIR / "08_statistical_summary.png", bbox_inches='tight')
    print("✓ Generated: 08_statistical_summary.png")
    plt.close()

def plot_co2_emissions_comparison(df, stats):
    """
    Diagram 9: CO₂ Emissions Comparison (Bangladesh GEF: 632 g CO₂/kWh).
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Plot 1: Overall CO₂ emissions bar chart
    overall_co2 = df.groupby('framework')['co2_emissions_g'].agg(['mean', 'std']).reset_index()
    overall_co2 = overall_co2.sort_values('mean')
    
    colors = [COLORS[fw] for fw in overall_co2['framework']]
    
    bars = ax1.bar(range(len(overall_co2)), overall_co2['mean'], 
                   yerr=overall_co2['std'], capsize=5,
                   color=colors, alpha=0.8, edgecolor='black', linewidth=1.2)
    
    ax1.set_xlabel('Framework', fontweight='bold')
    ax1.set_ylabel('CO₂ Emissions (g)', fontweight='bold')
    ax1.set_title('Overall CO₂ Emissions Comparison\\n(Bangladesh GEF: 632 g CO₂/kWh)', 
                  fontweight='bold', pad=20)
    ax1.set_xticks(range(len(overall_co2)))
    ax1.set_xticklabels([fw.capitalize() for fw in overall_co2['framework']])
    ax1.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels on bars
    for i, (bar, row) in enumerate(zip(bars, overall_co2.itertuples())):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height,
                f'{row.mean:.6f}g\\n±{row.std:.6f}',
                ha='center', va='bottom', fontsize=8, fontweight='bold')
    
    # Plot 2: CO₂ emissions by scenario (grouped bars)
    x = np.arange(len(SCENARIOS))
    width = 0.2
    
    for i, framework in enumerate(FRAMEWORKS):
        fw_data = stats[stats['framework'] == framework].sort_values('scenario', 
                       key=lambda x: x.map({s: i for i, s in enumerate(SCENARIOS)}))
        
        means = fw_data['co2_emissions_g_mean'].values
        stds = fw_data['co2_emissions_g_std'].values
        
        offset = (i - 1.5) * width
        bars = ax2.bar(x + offset, means, width, label=framework.capitalize(),
                      yerr=stds, capsize=3, color=COLORS[framework], 
                      alpha=0.8, edgecolor='black', linewidth=0.8)
    
    ax2.set_xlabel('Test Scenario', fontweight='bold')
    ax2.set_ylabel('CO₂ Emissions (g)', fontweight='bold')
    ax2.set_title('CO₂ Emissions by Framework and Scenario\\n(Lower emissions = Greener choice)', 
                  fontweight='bold', pad=20)
    ax2.set_xticks(x)
    ax2.set_xticklabels([s.capitalize() for s in SCENARIOS])
    ax2.legend(title='Framework', loc='upper left', framealpha=0.9)
    ax2.grid(axis='y', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    plt.savefig(DIAGRAMS_DIR / "09_co2_emissions_comparison.png", bbox_inches='tight')
    print("✓ Generated: 09_co2_emissions_comparison.png")
    plt.close()

def main():
    """Main execution function."""
    print("Starting visualization generation...")
    
    # Create diagrams directory
    DIAGRAMS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load data
    print("\nLoading data...")
    df, stats = load_data()
    
    print(f"Loaded {len(df)} measurements and {len(stats)} statistical summaries")
    
    # Generate all diagrams
    print("\nGenerating diagrams...")
    plot_overall_comparison(df, stats)
    plot_scenario_comparison(stats)
    plot_distribution_boxplots(df)
    plot_component_breakdown(stats)
    plot_efficiency_metrics(stats)
    plot_heatmap(stats)
    plot_timeseries_power(df)
    plot_statistical_summary(df, stats)
    plot_co2_emissions_comparison(df, stats)  # New CO₂ diagram
    
    print(f"\n✓ All diagrams generated successfully in {DIAGRAMS_DIR}")
    print("\nGenerated files:")
    for i in range(1, 10):  # Updated to 10 diagrams
        print(f"  {i:02d}_*.png")

if __name__ == "__main__":
    main()
