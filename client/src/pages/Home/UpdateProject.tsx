import EditIcon from '@mui/icons-material/Edit';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROJECT_BY_ID, GET_PROJECTS } from '../../../Queries/ProjectQueries';
import { Project } from '../../../Types/project';
import { Loader } from '@/components/Loader';
import { useEffect } from 'react';
import { UPDATE_PROJECT } from '../../../Mutations/ProjectMutations';

const formSchema = z.object({
    name: z.string() ,
    description: z.string() ,
    status: z.enum(["Not Started", "In Progress", "Completed"]) ,
});

interface UpdateProjectProps {
    projectID: string;
  }

const UpdateProject: React.FC<UpdateProjectProps> =({ projectID }) => {

    const { loading, data: projectData } = useQuery<{ project: Project }>(GET_PROJECT_BY_ID, {
        variables: { id: projectID },
      });
    
    const [updateProject] = useMutation(UPDATE_PROJECT)

    // console.log(projectData);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          description: "",
          status: "Not Started",
        }
      });

    
    useEffect(() => {
        if (projectData) {
        form.reset({
            name: projectData?.project.name ,
            description: projectData?.project.description,
            status: projectData?.project.status,
        });
        // console.log(form.getValues());
        }
    }, [projectData, form]);
    if (loading) return  <Loader/>

    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values)
        const theStatus = values.status === "Completed" ? "completed" :values.status === "In Progress"  ? "progress" : "new";
        // console.log(theStatus);
        updateProject(({
          variables:{
            id:projectID,
            name:values.name,
            description:values.description,
            status:theStatus
          },
          refetchQueries:[{query:GET_PROJECTS}]
          // update(cache,{data:{updateProject}}){
          //   const existingProjects = cache.readQuery({ query: GET_PROJECTS });

          //   if (existingProjects) {
          //       const updatedProjects = existingProjects.projects.map(project =>
          //           project.id === projectID ? updateProject : project
          //       );

          //       cache.writeQuery({
          //           query: GET_PROJECTS,
          //           data: { projects: updatedProjects }
          //       });
          //   }
          // },
        }))
    }
  return (
    <Dialog>
    <DialogTrigger asChild>
       <EditIcon />
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogDescription>
          Make changes to your Project here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input  {...field} />
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
                    <Input  {...field} />
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
                            <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                        <SelectContent  >
                            <SelectGroup >
                            <SelectItem value="Not Started" >New</SelectItem>
                            <SelectItem value="In Progress">Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <DialogFooter>
            <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
        </Form>

    </DialogContent>
  </Dialog>
  )
}

export default UpdateProject
