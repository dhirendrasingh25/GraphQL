import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { useMutation, useQuery  } from '@apollo/client';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import DeleteIcon from '@mui/icons-material/Delete';

import {Project} from '../../../Types/project'
import React from "react"
import {GET_PROJECTS} from '../../../Queries/ProjectQueries'
import { Loader } from "@/components/Loader";
import AddProject from "./AddProject";
import { DELETE_PROJECTS } from "../../../Mutations/ProjectMutations";
import UpdateProject from "./UpdateProject";
const Products = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { loading, error, data } = useQuery<{ projects: Project[] }>(GET_PROJECTS);
    const [deleteProject] = useMutation(DELETE_PROJECTS)

    const columns: ColumnDef<Project>[] = [
        {
          id: "id",
          header: ({ table }) => (
            <div className='flex justify-center'>
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value : boolean) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            /> 
            </div>
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: 'sr_no',
          header: () => {
            return <div className="text-center w-full">Sr No.</div>;
          },
          cell: ({ row }) => (
            <div className="flex justify-center text-ellipsis">
              {row.index + 1}
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "name",
          header: () => <div className="text-center">Name</div>,
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name") || "N/A"}</div>
          ),
        },
        {
          accessorKey: "description",
          header: () => <div className="text-center">Description</div>,
          cell: ({ row }) => <div className="lowercase">{row.getValue("description")|| "N/A"}</div>,
        },
        {
          accessorKey: "status",
          header: () => <div className="text-center">Status</div>,
          cell: ({ row }) => 
           <div className="text-center font-medium">{row.getValue("status")|| "N/A"}</div>
          ,
        },
        {
          accessorKey: "client.name",
          header: () => <div className="text-center">Client Name</div>,
          cell: ({ row }) => 
           <div className="text-center font-medium">{row.original.client?.name || "N/A"}</div>
          ,
        },
        {
          accessorKey: "client.email",
          header: () => <div className="text-center">Client Email</div>,
          cell: ({ row }) => 
           <div className="text-center font-medium">{row.original.client?.email || "N/A"}</div>
          ,
        },
        {
          accessorKey: "client.phone",
          header: () => <div className="text-center">Client Phone</div>,
          cell: ({ row }) => 
           <div className="text-center font-medium">{row.original.client?.phone || "N/A"}</div>
          ,
        },
        {
          id: "actions",
          header: () => <div className="text-center">Actions</div>,
          cell: (row) => {
    
            const projectId = row.row.original?.id; 
            // console.log(projectId);
            const handleDeleteClick = () => {
              deleteProject({
                variables:{
                  id:projectId
                },
                update(cache,{data:{deleteProject}}){
                  const {projects} = cache.readQuery({query:GET_PROJECTS})
                  cache.writeQuery({
                    query:GET_PROJECTS,
                    data:{projects:projects.filter(project=>project.id !== deleteProject.id )}
                  })
                }
              })
            };
    
            return (
              <div className="sm:space-x-2 ">
              <button type='button'>
                <UpdateProject projectID={projectId}/>
              </button>
              <button type='button' className='' onClick={handleDeleteClick}>
                <DeleteIcon />
              </button>
              </div>
            );
          },
        },
      ]
    // console.log(data?.projects);
    const table = useReactTable({
        data:data?.projects || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        },
    })
    if (loading) return <Loader />;
    if (error) return (
      <div className='p-4 text-sm overflow-x-scroll'>
        <p>Something Went Wrong ..</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  return (
    <div className="w-full px-6">
      <div className="flex items-center py-4  justify-center w-full">
        <Input
          placeholder="Filter Name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className='px-2'>
          <AddProject/>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md text-center border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Products
