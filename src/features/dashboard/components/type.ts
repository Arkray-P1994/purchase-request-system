export interface StatusBreakdown {
  status_label: string;
  count: string;
}

export interface TeamBreakdown {
  team_name: string;
  count: string;
}

export interface YearlyByCategory {
  year: string;
  category_name: string;
  total_price: string;
  asset_count: string;
}

export interface YearlyOverall {
  year: string;
  total_price: string;
}

export interface AssetData {
  success: boolean;
  summary: {
    total_assets: number;
  };
  breakdowns: {
    yearly_by_category: YearlyByCategory[];
    yearly_overall: YearlyOverall[];
    status_distribution: StatusBreakdown[];
    by_team: TeamBreakdown[];
  };
}
