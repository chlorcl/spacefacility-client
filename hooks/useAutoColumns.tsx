import {ColumnDef} from "@tanstack/react-table";
import {DataTableColumnHeader} from "@/components/ui/data-table";

const useAutoColumns = <T extends object>(data: T[]): ColumnDef<T>[] => {
    if (!data || !data.length) {
        return [];
    }

    const columns: ColumnDef<T>[] = [];

    for (const key in data[0]) {
        columns.push({
            accessorKey: key,
            header: ({column}) => {
                return <DataTableColumnHeader column={column} title={key}/>
            },
        })
    }

    return columns;
}

export default useAutoColumns;