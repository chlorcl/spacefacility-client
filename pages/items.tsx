import React, {useEffect, useState} from "react";
import {
    ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import axios from "axios";
import useAutoColumns from "@/hooks/useAutoColumns";
import {DataTable, DataTablePagination} from "@/components/ui/data-table";
import {redirect} from "next/navigation";
import {useRouter} from "next/router";
import {RedirectType} from "next/dist/client/components/redirect";
import {Action} from "@radix-ui/react-alert-dialog";
import {useCookies} from "react-cookie";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input";

export default function Missions() {
    const {push} = useRouter();
    const [show, setShow] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    type Item = {
        id: number,
        name: string,
        description: string,
        itemCategory: {
            id: number,
            name: string,
            description: string,
        }
    }


    const [columns, setColumns] = useState<ColumnDef<Item>[]>([]);
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [cookie] = useCookies(['privilegeType', 'token']);
    const [selectedItem, setSelectedItem] = useState<Item>(null);
    const ac: typeof Action[] = [];
    if (cookie.privilegeType === 'ADMIN') {
        ac.push(
            {
                name: 'edit',
                label: 'Edit',
                onClick: (item: Item) => {
                    setShowEditDialog(true);
                    setSelectedItem(item);
                },
            },
            {
                name: 'delete',
                label: <p className="text-red-700">Delete</p>,
                onClick: (item: Item) => {
                    setShowDeleteDialog(true);
                    setSelectedItem(item);
                },
            },
        );
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
        },
    });

    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/items')
            .then((response) => {
                setData(response.data);
                const result = response.data.map((item: Item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        'itemCategory.name': item.itemCategory.name,
                    }
                });

                setItems(result);
                setColumns(useAutoColumns(result));
                setShow(true);
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-2">
            <Dialog open={showDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the record.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => {setShowDeleteDialog(false)}}>Cancel</Button>
                            <Button onClick={() => {
                                setShowDeleteDialog(false);
                                setShow(false);
                                axios.delete(`http://localhost:8080/api/v1/items/${selectedItem.id}`, {
                                    headers: {
                                        Authorization: `Bearer ${cookie.token}`
                                    }}).then(async (response) => {
                                        await push('/items');
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                            }} variant="destructive">Yes, delete record</Button>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {show && (
                <>
                    {/* @ts-ignore */}
                    <DataTable columns={columns} data={items} table={table} actions={ac}/>
                    <DataTablePagination table={table}/>
                </>
            )}
        </div>
    )
}