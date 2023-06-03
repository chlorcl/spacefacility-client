import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {DataTable, DataTablePagination, DataTableViewOptions} from "../components/ui/data-table";
import {Switch} from "@/components/ui/switch";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {
    ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import useAutoColumns from "@/hooks/useAutoColumns";

export default function Home() {



}
