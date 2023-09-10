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

export default function Missions() {

    const {push} = useRouter();
    const [show, setShow] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    type Mission = {
        id: number,
        name: string,
        description: string,
        done: boolean,
        purpose: string,
    }

    const [columns, setColumns] = useState<ColumnDef<mission>[]>([]);
    const [data, setData] = useState([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [cookie] = useCookies(['privilegeType', 'token']);
    const [selectedMission, setSelectedMission] = useState<Mission>(null);
    const [selectedDone, setSelectedDone] = useState<boolean>(false);
    const ac: typeof Action[] = [];

    if (cookie.privilegeType === 'ADMIN') {
        ac.push(
            {
                name: 'edit',
                label: 'Edit',
                onClick: (mission: Mission) => {
                    setShowEditDialog(true);
                    setSelectedMission(mission);
                },
            },
            {
                name: 'delete',
                label: <p className="text-red-700">Delete</p>,
                onClick: (mission: Mission) => {
                    setShowDeleteDialog(true);
                    setSelectedMission(mission);
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
        axios.get('http://localhost:8080/api/v1/missions')
            .then((response) => {
                setData(response.data);
                const result = response.data.map((mission: Mission) => {
                    return {
                        id: mission.id,
                        name: mission.name,
                        description: mission.description,
                        done: mission.done,
                        purpose: mission.purpose,
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
                            axios.delete(`http://localhost:8080/api/v1/missions/${selectedMission.id}`, {
                                headers: {
                                    Authorization: `Bearer ${cookie.token}`
                                }
                            }).then(async (response) => {
                                await push('/missions');
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
                                    defaultValue={selectedMission ? selectedMission.name : ''}
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
                                    defaultValue={selectedMission ? selectedMission.description : ''}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="purpose">
                                    Done
                                </Label>
                                <Select onValueChange={(value) => {
                                    setSelectedDone(value === 'Yes');
                                }}>
                                    <SelectTrigger>
                                        <SelectValue>
                                            {selectedMission ? selectedMission.done ? 'Yes' : 'No' : ''}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                        <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="purpose">
                                    Purpose
                                </Label>
                                <Input
                                    id="purpose"
                                    placeholder="Purpose"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="purpose"
                                    autoCorrect="off"
                                    defaultValue={selectedMission ? selectedMission.purpose : ''}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Button onClick={() => {
                                    setShowEditDialog(false);
                                }}>Cancel</Button>
                                <Button variant="outline" onClick={() => {
                                    setShowEditDialog(false);
                                    setShow(false);
                                    axios.put(`http://localhost:8080/api/v1/missions`, {
                                        id: selectedMission.id,
                                        name: document.getElementById('name').value,
                                        description: document.getElementById('description').value,
                                        done: selectedDone,
                                        purpose: document.getElementById('purpose').value,
                                    }, {
                                        headers: {
                                            Authorization: `Bearer ${cookie.token}`
                                        }
                                    }).then(async (response) => {
                                        await push('/missions');
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