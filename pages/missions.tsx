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

export default function Missions() {

    const { push } = useRouter();
    const [show, setShow] = useState(false);


    type mission = {
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
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
                const result = response.data.map((mission: mission) => {
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
            {show && (
                <>
                    <DataTable columns={columns} data={data} table={table} />
                    <DataTablePagination table={table} />
                </>
            )}
        </div>
    )
}