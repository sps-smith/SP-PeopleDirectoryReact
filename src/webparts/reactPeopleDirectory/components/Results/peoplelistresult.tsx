import * as React from 'react';
import {  Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow} from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { useState, useEffect } from 'react';
import { PeopleRecord } from '../IReactPeopleDirectoryProps';

  const columns = [
    { columnKey: "employeeName", label: "Employee Name" },
    { columnKey: "email", label: "Email" },
    { columnKey: "jobTitle", label: "Job Title" },
    { columnKey: "vbu", label: "VBU" },
    { columnKey: "office", label: "Office" },
    { columnKey: "city", label: "City" },
    { columnKey: "country", label: "Country" },
  ];

const PeopleList: React.FC<{data: PeopleRecord[]}> = (props) =>{

    const [records, setRecords] = useState<PeopleRecord[]>([]);

    useEffect(() =>{
        setRecords(props.data);
    },[props.data])

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    {
                        columns.map((column) =>(
                            <TableHeaderCell key={column.columnKey}>
                                {column.label}
                            </TableHeaderCell>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    records.map((item) =>(
                        <TableRow key={item.employeeId}>
                            <TableCell>{item.employeeName}</TableCell>
                            <TableCell className={styles.emailwrap}>{item.email}</TableCell>
                            <TableCell>{item.jobTitle}</TableCell>
                            <TableCell>{item.vbu}</TableCell>
                            <TableCell>{item.office}</TableCell>
                            <TableCell>{item.city}</TableCell>
                            <TableCell>{item.country}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export default PeopleList;