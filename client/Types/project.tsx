import{ Client} from './client'
export interface  Project  {
    name: string |null;
    description: string |null;
    status: string |null;
    client:Client[]|null
  };
  
export interface ProjectResponse  {
    data: {
      project: Project[];
    };
};
  