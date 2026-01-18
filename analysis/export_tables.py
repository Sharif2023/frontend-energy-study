#!/usr/bin/env python3
"""
LaTeX Table Export Script
Generates publication-ready tables for research paper
"""

import pandas as pd
import numpy as np
from pathlib import Path
from scipy import stats as scipy_stats

# Configuration
RESULTS_DIR = Path(__file__).parent / "results"
TABLES_DIR = RESULTS_DIR / "tables"
FRAMEWORKS = ["angular", "react", "svelte", "vue"]
SCENARIOS = ["simple", "medium", "complex"]

def load_data():
    """Load processed data and statistics."""
    df = pd.read_csv(RESULTS_DIR / "processed_data.csv")
    stats = pd.read_csv(RESULTS_DIR / "summary_statistics.csv")
    return df, stats

def generate_summary_table(stats):
    """
    Generate main summary statistics table.
    """
    latex = []
    latex.append("% Summary Statistics Table")
    latex.append("% Copy this into your LaTeX document")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{Energy Consumption Summary Statistics by Framework and Scenario}")
    latex.append("\\label{tab:energy_summary}")
    latex.append("\\begin{tabular}{llrrrrr}")
    latex.append("\\toprule")
    latex.append("\\textbf{Framework} & \\textbf{Scenario} & \\textbf{Mean (J)} & \\textbf{Std (J)} & \\textbf{Min (J)} & \\textbf{Max (J)} & \\textbf{CV (\\%)} \\\\")
    latex.append("\\midrule")
    
    for framework in FRAMEWORKS:
        fw_stats = stats[stats['framework'] == framework]
        
        for idx, scenario in enumerate(SCENARIOS):
            row = fw_stats[fw_stats['scenario'] == scenario].iloc[0]
            
            fw_name = framework.capitalize() if idx == 0 else ""
            
            latex.append(f"{fw_name:10s} & {scenario.capitalize():8s} & "
                        f"{row['total_energy_J_mean']:7.2f} & "
                        f"{row['total_energy_J_std']:6.2f} & "
                        f"{row['total_energy_J_min']:7.2f} & "
                        f"{row['total_energy_J_max']:7.2f} & "
                        f"{row['energy_cv']:5.2f} \\\\")
        
        if framework != FRAMEWORKS[-1]:
            latex.append("\\midrule")
    
    latex.append("\\bottomrule")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def generate_ranking_table(df, stats):
    """
    Generate framework ranking table.
    """
    latex = []
    latex.append("% Framework Ranking Table")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{Framework Ranking by Energy Efficiency}")
    latex.append("\\label{tab:framework_ranking}")
    latex.append("\\begin{tabular}{clrrr}")
    latex.append("\\toprule")
    latex.append("\\textbf{Rank} & \\textbf{Framework} & \\textbf{Avg Energy (J)} & \\textbf{Avg Power (W)} & \\textbf{Consistency} \\\\")
    latex.append("\\midrule")
    
    # Calculate overall metrics
    overall = df.groupby('framework').agg({
        'total_energy_J': 'mean',
        'avg_power_W': 'mean'
    }).round(2)
    
    cv = stats.groupby('framework')['energy_cv'].mean().round(2)
    overall['cv'] = cv
    overall = overall.sort_values('total_energy_J')
    
    for rank, (framework, row) in enumerate(overall.iterrows(), 1):
        consistency = "High" if row['cv'] < 5 else "Medium" if row['cv'] < 10 else "Low"
        latex.append(f"{rank} & {framework.capitalize():8s} & "
                    f"{row['total_energy_J']:7.2f} & "
                    f"{row['avg_power_W']:6.2f} & "
                    f"{consistency} (CV: {row['cv']:.2f}\\%) \\\\")
    
    latex.append("\\bottomrule")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def generate_component_table(stats):
    """
    Generate CPU component breakdown table.
    """
    latex = []
    latex.append("% CPU Component Breakdown Table")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{CPU Energy Component Breakdown (Core vs Uncore)}")
    latex.append("\\label{tab:component_breakdown}")
    latex.append("\\begin{tabular}{llrrrr}")
    latex.append("\\toprule")
    latex.append("\\textbf{Framework} & \\textbf{Scenario} & \\textbf{Core (J)} & \\textbf{Uncore (J)} & \\textbf{Total (J)} & \\textbf{Core \\%} \\\\")
    latex.append("\\midrule")
    
    for framework in FRAMEWORKS:
        fw_stats = stats[stats['framework'] == framework]
        
        for idx, scenario in enumerate(SCENARIOS):
            row = fw_stats[fw_stats['scenario'] == scenario].iloc[0]
            
            fw_name = framework.capitalize() if idx == 0 else ""
            core = row['core_energy_J_mean']
            uncore = row['uncore_energy_J_mean']
            total = core + uncore
            core_pct = (core / total * 100) if total > 0 else 0
            
            latex.append(f"{fw_name:10s} & {scenario.capitalize():8s} & "
                        f"{core:7.2f} & "
                        f"{uncore:7.2f} & "
                        f"{total:7.2f} & "
                        f"{core_pct:5.1f} \\\\")
        
        if framework != FRAMEWORKS[-1]:
            latex.append("\\midrule")
    
    latex.append("\\bottomrule")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def generate_anova_table(df):
    """
    Generate ANOVA statistical significance table.
    """
    latex = []
    latex.append("% ANOVA Statistical Significance Table")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{ANOVA Results for Framework Comparison}")
    latex.append("\\label{tab:anova}")
    latex.append("\\begin{tabular}{lrrrl}")
    latex.append("\\toprule")
    latex.append("\\textbf{Scenario} & \\textbf{F-statistic} & \\textbf{p-value} & \\textbf{df} & \\textbf{Significance} \\\\")
    latex.append("\\midrule")
    
    for scenario in SCENARIOS:
        scenario_data = df[df['scenario'] == scenario]
        
        # Prepare data for ANOVA
        groups = [scenario_data[scenario_data['framework'] == fw]['total_energy_J'].values 
                 for fw in FRAMEWORKS]
        
        # Perform one-way ANOVA
        f_stat, p_value = scipy_stats.f_oneway(*groups)
        
        # Determine significance level
        if p_value < 0.001:
            sig = "***"
        elif p_value < 0.01:
            sig = "**"
        elif p_value < 0.05:
            sig = "*"
        else:
            sig = "ns"
        
        df_between = len(FRAMEWORKS) - 1
        df_within = len(scenario_data) - len(FRAMEWORKS)
        
        latex.append(f"{scenario.capitalize():8s} & "
                    f"{f_stat:8.2f} & "
                    f"{p_value:.4f} & "
                    f"({df_between}, {df_within}) & "
                    f"{sig} \\\\")
    
    latex.append("\\bottomrule")
    latex.append("\\multicolumn{5}{l}{\\footnotesize *** p < 0.001, ** p < 0.01, * p < 0.05, ns = not significant} \\\\")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def generate_pairwise_table(df):
    """
    Generate pairwise comparison table (t-tests).
    """
    latex = []
    latex.append("% Pairwise Comparison Table")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{Pairwise Framework Comparisons (Overall)}")
    latex.append("\\label{tab:pairwise}")
    latex.append("\\begin{tabular}{llrrr}")
    latex.append("\\toprule")
    latex.append("\\textbf{Framework 1} & \\textbf{Framework 2} & \\textbf{Mean Diff (J)} & \\textbf{t-statistic} & \\textbf{p-value} \\\\")
    latex.append("\\midrule")
    
    # Perform pairwise t-tests
    for i, fw1 in enumerate(FRAMEWORKS):
        for fw2 in FRAMEWORKS[i+1:]:
            data1 = df[df['framework'] == fw1]['total_energy_J'].values
            data2 = df[df['framework'] == fw2]['total_energy_J'].values
            
            t_stat, p_value = scipy_stats.ttest_ind(data1, data2)
            mean_diff = data1.mean() - data2.mean()
            
            latex.append(f"{fw1.capitalize():8s} & {fw2.capitalize():8s} & "
                        f"{mean_diff:7.2f} & "
                        f"{t_stat:7.2f} & "
                        f"{p_value:.4f} \\\\")
    
    latex.append("\\bottomrule")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def generate_scaling_table(stats):
    """
    Generate energy scaling analysis table.
    """
    latex = []
    latex.append("% Energy Scaling Analysis Table")
    latex.append("\\begin{table}[htbp]")
    latex.append("\\centering")
    latex.append("\\caption{Energy Scaling from Simple to Complex Scenario}")
    latex.append("\\label{tab:scaling}")
    latex.append("\\begin{tabular}{lrrrr}")
    latex.append("\\toprule")
    latex.append("\\textbf{Framework} & \\textbf{Simple (J)} & \\textbf{Medium (J)} & \\textbf{Complex (J)} & \\textbf{Increase (\\%)} \\\\")
    latex.append("\\midrule")
    
    for framework in FRAMEWORKS:
        fw_stats = stats[stats['framework'] == framework]
        
        simple = fw_stats[fw_stats['scenario'] == 'simple']['total_energy_J_mean'].values[0]
        medium = fw_stats[fw_stats['scenario'] == 'medium']['total_energy_J_mean'].values[0]
        complex_val = fw_stats[fw_stats['scenario'] == 'complex']['total_energy_J_mean'].values[0]
        
        increase = (complex_val - simple) / simple * 100
        
        latex.append(f"{framework.capitalize():8s} & "
                    f"{simple:7.2f} & "
                    f"{medium:7.2f} & "
                    f"{complex_val:7.2f} & "
                    f"{increase:6.1f} \\\\")
    
    latex.append("\\bottomrule")
    latex.append("\\end{tabular}")
    latex.append("\\end{table}")
    
    return "\n".join(latex)

def main():
    """Main execution function."""
    print("Starting LaTeX table generation...")
    
    # Create tables directory
    TABLES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load data
    print("\nLoading data...")
    df, stats = load_data()
    
    # Generate all tables
    print("\nGenerating LaTeX tables...")
    
    tables = {
        'summary_table.tex': generate_summary_table(stats),
        'ranking_table.tex': generate_ranking_table(df, stats),
        'component_table.tex': generate_component_table(stats),
        'anova_table.tex': generate_anova_table(df),
        'pairwise_table.tex': generate_pairwise_table(df),
        'scaling_table.tex': generate_scaling_table(stats)
    }
    
    for filename, content in tables.items():
        filepath = TABLES_DIR / filename
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"✓ Generated: {filename}")
    
    # Generate combined file
    combined = []
    combined.append("% Combined LaTeX Tables for Energy Analysis")
    combined.append("% Generated automatically from energy measurement data")
    combined.append("% Include \\usepackage{booktabs} in your LaTeX preamble")
    combined.append("")
    
    for content in tables.values():
        combined.append(content)
        combined.append("")
        combined.append("")
    
    with open(TABLES_DIR / "all_tables.tex", 'w') as f:
        f.write("\n".join(combined))
    
    print(f"\n✓ All tables generated successfully in {TABLES_DIR}")
    print("\nGenerated files:")
    for filename in tables.keys():
        print(f"  {filename}")
    print("  all_tables.tex (combined)")
    
    print("\nNote: Include \\usepackage{booktabs} in your LaTeX preamble")

if __name__ == "__main__":
    main()
