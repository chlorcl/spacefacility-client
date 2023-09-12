import React, {useEffect, useState} from "react";
import {
    ColumnDef,
    getCoreRowModel, getPaginationRowModel,
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
import {useCookies} from "react-cookie";
import {Action} from "@radix-ui/react-alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function Rooms() {

    const {push} = useRouter();
    const [show, setShow] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    type Room = {
        id: number,
        description: string,
        name: string,
        area_id: {
            id: number,
            name: string,
        },
    }

    const [columns, setColumns] = useState<ColumnDef<Room>[]>([]);
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [cookie] = useCookies(['privilegeType', 'token']);
    const [selectedRoom, setSelectedRoom] = useState<Room>(null);
    const ac: typeof Action[] = [];

    if (cookie.privilegeType === 'ADMIN') {
        ac.push(
            {
                name: 'edit',
                label: 'Edit',
                onClick: (room: Room) => {
                    setShowEditDialog(true);
                    setSelectedRoom(room);
                },
            },
            {
                name: 'delete',
                label: <p className="text-red-700">Delete</p>,
                onClick: (room: Room) => {
                    setShowDeleteDialog(true);
                    setSelectedRoom(room);
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

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/rooms')
            .then((response) => {
                setData(response.data);
                const result = response.data.map((room: Room) => {
                    return {
                        id: room.id,
                        name: room.name,
                        description: room.description,
                        area_id: room.area_id
                    }
                });
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
                    </DialogHeader>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the record.
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => {
                            setShowDeleteDialog(false)
                        }}>Cancel</Button>
                        <Button onClick={() => {
                            setShowDeleteDialog(false);
                            setShow(false);
                            axios.delete(`http://localhost:8080/api/v1/rooms/${selectedRoom.id}`, {
                                headers: {
                                    Authorization: `Bearer ${cookie.token}`
                                }
                            }).then(async (response) => {
                                await push('/rooms');
                            }).catch((error) => {
                                console.log(error);
                            });
                        }} variant="destructive">Yes, delete record</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={showEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <form>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="name">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Name"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="name"
                                    autoCorrect="off"
                                    defaultValue={selectedRoom ? selectedRoom.name : ''}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="description">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="Description"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="description"
                                    autoCorrect="off"
                                    defaultValue={selectedRoom ? selectedRoom.description : ''}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="Area_id">
                                    Area_id
                                </Label>
                                <Input
                                    id="Area_id"
                                    placeholder="Area_id"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="Area_id"
                                    autoCorrect="off"
                                    defaultValue={selectedRoom ? selectedRoom.area_id : ''}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Button onClick={() => {
                                    setShowEditDialog(false);
                                }}>Cancel</Button>
                                <Button variant="outline" onClick={() => {
                                    setShowEditDialog(false);
                                    setShow(false);
                                    axios.put(`http://localhost:8080/api/v1/rooms`, {
                                        id: selectedRoom.id,
                                        name: document.getElementById('name').value,
                                        description: document.getElementById('description').value,
                                        area_id: document.getElementById('Area_id').value,
                                    }, {
                                        headers: {
                                            Authorization: `Bearer ${cookie.token}`
                                        }
                                    }).then(async (response) => {
                                        await push('/rooms');
                                    }).catch((error) => {
                                        console.log(error);
                                    });
                                }}>Save</Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            {show && (
                <>
                    <DataTable columns={columns} data={data} table={table} actions={ac}/>
                    <DataTablePagination table={table}/>
                </>
            )}
        </div>
    )
}