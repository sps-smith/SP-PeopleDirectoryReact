import * as React from 'react';
import PeopleItemRecord from './peoplerecord';
import { PeopleRecord } from '../IReactPeopleDirectoryProps';
import styles from '../ReactPeopleDirectory.module.scss';
import { useEffect, useState } from 'react';
import PeopleList from './peoplelistresult';
import PeopleDetails from '../Peopledetails/details';
import ContactCard from '../Peopledetails/contactcard';


    const PeopleResults: React.FC<{props: PeopleRecord[], page:number, CountryValue: string, VBUValue: string, SelectedView: string, userEmail: string}> = (data) =>{

    const [records, setRecords] = useState<PeopleRecord[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [contactopen, setContactOpen] = useState<boolean>(false);
    const [detailrecord, setDetailRecord] = useState<PeopleRecord>({employeeName: "",
        jobTitle: "",
        email: "",
        country: "",
        office: "",
        city: "",
        company: "",
        vbu: "",
        employeeId: 0,
        telephone: "",
        userprincipal: "",
        orgID: "",
        page: 0,
        costcenter: ""});

    useEffect(() => {
        setRecords(data.props.filter(rec => rec.page === data.page))
    },[data]);
    
    return(
        <div>
            <h5>People Results
                {
                    data.CountryValue !== "" ?
                    " - Country: " + data.CountryValue: <></>
                }
                {
                    data.VBUValue !== "" ?
                    " - VBU: " + data.VBUValue: <></>
                }
            </h5>
            {
                data.SelectedView === "PeopleView" ?
                <div className={styles.peoplemain}>
                    {
                        records.length > 0 ? 
                        records.map((itm: PeopleRecord) => (
                            <PeopleItemRecord records={itm} userEmail={data.userEmail} showdetails={setOpen} showContacts={setContactOpen} setdetails={setDetailRecord} />
                        )): <div>No Data Found</div>
                    }
                </div>:
                <PeopleList data={records} />
            }
            <PeopleDetails open={open} setOpen={setOpen} record={detailrecord}/>
            <ContactCard open={contactopen} setOpen={setContactOpen} record={detailrecord}/>
        </div>
    )
}

export default PeopleResults;
