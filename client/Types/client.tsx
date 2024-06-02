export interface  Client  {
    id: string;
    name: string | null;
    email: string;
    phone: string;
  };
  
  export interface  ClientsResponse  {
    data: {
      clients: Client[];
    };
  };
  