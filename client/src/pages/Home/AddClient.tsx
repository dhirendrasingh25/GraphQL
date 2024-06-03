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
import { useMutation } from "@apollo/client"
import { ADD_CLIENT } from "../../../Mutations/ClientMutations"
import { GET_CLIENTS } from "../../../Queries/ClientQueries"
 
const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone:z.string(),
})


const AddClient = () => {

    const [addClient] = useMutation(ADD_CLIENT);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email:"",
          phone:""
        },
    })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values)
        addClient({
            variables: {
              name: values.name,
              email: values.email,
              phone: values.phone
            },
            update(cache,{data:{addClient}}){
                const {clients} = cache.readQuery({query:GET_CLIENTS})
                cache.writeQuery({
                    query:GET_CLIENTS,
                    data:{clients:clients.concat([addClient])}
                })
            }
        })
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Client</Button>
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
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input placeholder="Add Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="Add Email" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="Add Phone" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </AlertDialogFooter>
        </form>
        </Form>
        
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddClient