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
  id: number;
  title: string;
  slug: string;
  githubUrl: string;
  demoUrl: string;
  createdAt: Date;
  publishedAt: Date | null;
  promotionId: number;
  adaProjectsId: number;
  userId: string;
}

export interface Comments {
  id: number;
  content: string;
  createdAt: string;
  projectId: number;
  user?: {
    id: string;
    name: string;
    image: string | null;
  };
}