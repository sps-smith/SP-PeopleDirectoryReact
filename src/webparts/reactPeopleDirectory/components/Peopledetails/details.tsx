import * as React from 'react';
import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle, Table, TableCell, TableRow, Toast, Toaster, ToastTitle, Tooltip, useId, useToastController } from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { PeopleRecord } from '../IReactPeopleDirectoryProps';
import { CopyArrowRight24Filled } from '@fluentui/react-icons';
import { useState } from 'react';


    const PeopleDetails: React.FC<{open: boolean, setOpen: any, record: PeopleRecord}> = (props) =>{

        const [timeout, ] = useState<number>(1000);
       
        const toasterId = useId("toaster");
        const { dispatchToast } = useToastController(toasterId);
        const notify = (name: string) =>
            dispatchToast(
            <Toast>
                <ToastTitle>
                {name} copied to clipboard
                </ToastTitle>
            </Toast>,
            { timeout, intent: "info" }
        );
       
        const copydata = (name: string, value: string) => {
            navigator.clipboard.writeText(value);
            notify(name);
        }

        return(
            <Dialog modalType='non-modal' open={props.open} onOpenChange={(event, data) => props.setOpen(data.open)}>
                <DialogSurface className={styles.popupbackground}>
                    <DialogBody>
                        <DialogTitle className={styles.headstyle}><h3>{props.record.employeeName} Details</h3></DialogTitle>
                        <DialogContent>
                            <Toaster toasterId={toasterId}></Toaster>
                            <Table>
                                <TableRow>
                                    <TableCell>Employee ID:</TableCell>
                                    <TableCell>{props.record.employeeId}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy Employee ID", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("Employee ID", props.record.employeeId.toString())}/></Tooltip></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Office:</TableCell>
                                    <TableCell>{props.record.office}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy Office location", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("Office", props.record.office)}/></Tooltip></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>City:</TableCell>
                                    <TableCell>{props.record.city}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy City", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("City", props.record.city)}/></Tooltip></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Country:</TableCell>
                                    <TableCell>{props.record.country}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy Country", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("Country", props.record.country)}/></Tooltip></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>OrgID/VBUID:</TableCell>
                                    <TableCell>{props.record.orgID}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy OrgID/VBUID", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("OrgID", props.record.orgID.toString())}/></Tooltip></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cost Center:</TableCell>
                                    <TableCell>{props.record.costcenter}</TableCell>
                                    <TableCell><Tooltip withArrow content={{ children: "Copy Cost Center", className: styles.popupbtn}} relationship="label"><CopyArrowRight24Filled primaryFill='#008ab0'  onClick={e => copydata("Cost Center", props.record.costcenter)}/></Tooltip></TableCell>
                                </TableRow>
                            </Table>
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        )
    }

    export default PeopleDetails;