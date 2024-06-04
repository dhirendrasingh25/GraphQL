import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useMutation ,useQuery} from "@apollo/client"
// import { ADD_CLIENT } from "../../../Mutations/ClientMutations"
import {  GET_CLIENTS_ID } from "../../../Queries/ClientQueries"
import {ADD_PROJECTS} from "../../../Mutations/ProjectMutations"
import { Client } from "Types/client"
import { Loader } from "@/components/Loader"
import { GET_PROJECTS } from "../../../Queries/ProjectQueries"
 
const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    status: z.enum(["new", "progress", "completed"]),
    clientId: z.string().optional(),
});

const AddProject = () => {
    const {  loading,data:ClientIdData } = useQuery<{ projects: Client[] }>(GET_CLIENTS_ID);
    const [addProject] = useMutation(ADD_PROJECTS);
    // console.log(ClientIdData);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          description:"",
          status:"new",
          clientId:""
        },
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values)
        addProject({
            variables: {
              name: values.name,
              description: values.description,
              status: values.status,
              clientId:values.clientId
            },
            update(cache,{data:{addProject}}){
                const {projects} = cache.readQuery({query:GET_PROJECTS})
                cache.writeQuery({
                    query:GET_PROJECTS,
                    data:{projects:projects.concat([addProject])}
                })
            }
        })
    }
    if (loading) return <Loader />;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Client</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                    <Input placeholder="Add Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg">Status</FormLabel>
                <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Status" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup >
                            <SelectItem value="new" >New</SelectItem>
                            <SelectItem value="progress">Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg">Select Client</FormLabel>
                <FormControl>
                    <Select  value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Client" />
                        </SelectTrigger>
                        <SelectContent  >
                            <SelectGroup className=" overflow-y-scroll" >
                            {ClientIdData.clients.map((client) => (
                                <SelectItem value={client.id} key={client.id}>
                                    {client.name}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Add Project</AlertDialogAction>
            </AlertDialogFooter>
        </form>
        </Form>
        
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddProject