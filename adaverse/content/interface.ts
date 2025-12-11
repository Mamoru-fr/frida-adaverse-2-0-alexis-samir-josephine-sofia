export interface adaProjects {
  id: number;
  name: string;
}

export interface Promotions {
  id: number;
  name: string;
  startDate: Date;
}

export interface Projects {
  title: string;
  github_url: string;
  demo_url: string;
  promotion_id: string;
  ada_projects_id: string;
  user_id: string;
}