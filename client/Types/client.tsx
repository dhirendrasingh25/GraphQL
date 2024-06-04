export interface  Client  {
    id: string |null;
    name: string | null;
    email: string |null;
    phone: string |null;
  };
  
export interface  ClientsResponse  {
    data: {
      clients: Client[];
    };
};
  