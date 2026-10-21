import * as React from 'react';
import { PeopleRecord } from '../IReactPeopleDirectoryProps';
import styles from '../ReactPeopleDirectory.module.scss';
import {  Person, ViewType} from '@microsoft/mgt-react';
import { Mail24Filled,  Chat24Filled, Call24Filled, Video24Filled, PersonEdit24Filled, PreviewLink24Filled, SlideTextPersonRegular } from '@fluentui/react-icons';
import { useState, useEffect } from 'react';
import {
    useId,
    Toaster,
    useToastController,
    ToastTitle,
    Toast,
    Tooltip,
    makeStyles,
    Button,
  } from "@fluentui/react-components";

const useStyles = makeStyles({
    tooltip: {
      backgroundColor: "#008ab0",
      color: "#fff",
    }
});


const PeopleItemRecord: React.FC<{records: PeopleRecord, userEmail: string, showdetails: any, showContacts: any, setdetails: any }> = (data) =>{

    const css = useStyles();
    
    
    const [user, setUserRecord] = useState<PeopleRecord>();
    const [timeout, ] = useState<number>(1000);

    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    const notify = () =>
        dispatchToast(
        <Toast>
            <ToastTitle>
            Email copied to clipboard
            </ToastTitle>
        </Toast>,
        { timeout, intent: "info" }
    );

    const showitem = ():void =>{
        data.showdetails(true);
        data.setdetails(data.records)
    }

    useEffect(() =>{
        setUserRecord(data.records);
    },[data]);

    const copyemail = (mailto: string) => {
        navigator.clipboard.writeText(mailto);
        notify();
    }

    const teamschat = (mailto?: string) =>{
        window.open("MSTeams:/l/chat/0/0?users=" + mailto);
    }

    const teamscall = (mailto?: string) =>{
        window.open("MSTeams:/l/call/0/0?users=" + mailto);
    }

    const teamsvideo = (mailto?: string) =>{
        window.open("MSTeams:/l/video/0/0?users=" + mailto);
    }

    const profile = (userp?: string) =>{
        //window.open("https://m365.cloud.microsoft/search?q=" + userp);
        
        data.showContacts(true);
        data.setdetails(data.records)
    }

    return(
        <div className={styles.peoplecss}>
             {/* <Person className={styles.personCard} userId={user?.userprincipal} view={ViewType.threelines} title='Click to view details'
             line1Property='displayName' line2Property='jobTitle' line3Property='companyName' showPresence fetchImage={true} personCardInteraction={PersonCardInteraction.click}>
                </Person> */}
                <Person className={styles.personCard} userId={user?.userprincipal} view={ViewType.threelines} line1Property='displayName' line2Property='jobTitle' line3Property='companyName' showPresence fetchImage={true} >
                </Person>
            <Toaster toasterId={toasterId}></Toaster>
            <div className={styles.peopleicons}>
                <div onClick={e => copyemail(data.records.email)}>
                    <Tooltip withArrow content={{ children: "Copy email address", className: css.tooltip}} relationship="label">
                        <Mail24Filled primaryFill='#008ab0'/> 
                    </Tooltip>
                </div>
                <div onClick={e => teamschat(user?.email)}>
                    <Tooltip withArrow content={{ children: "Start Teams Chat", className: css.tooltip}} relationship="label">
                        <Chat24Filled primaryFill='#008ab0'/>
                    </Tooltip>
                </div>
                <div onClick={e => teamsvideo(user?.email)}>
                    <Tooltip withArrow content={{ children: "Start Teams Video", className: css.tooltip}} relationship="label">
                        <Video24Filled primaryFill='#008ab0'/>
                    </Tooltip>
                </div>
                <div onClick={e => teamscall(user?.email)}>
                    <Tooltip withArrow content={{ children: "Start Teams Call", className: css.tooltip}} relationship="label">
                        <Call24Filled primaryFill='#008ab0'/>
                    </Tooltip>
                </div>
                {
                    user?.email === data.userEmail ?
                    <div onClick={e => profile(user?.employeeName)}>
                        <Tooltip withArrow content={{ children: "Manage your profile", className: css.tooltip}} relationship="label">
                            <PersonEdit24Filled primaryFill='#008ab0'/>
                        </Tooltip>
                    </div>:
                    <div onClick={e => profile(user?.employeeName)}>
                        <Tooltip withArrow content={{ children: "View profile details", className: css.tooltip}} relationship="label">
                            <PreviewLink24Filled primaryFill='#008ab0'/>
                        </Tooltip>
                    </div>
                }
            </div>
            <div className={styles.detailsbtndiv}>
                <Button className={styles.popupbtn} icon={<SlideTextPersonRegular />} onClick={showitem}>View employee details</Button>
            </div>
            
        </div>
    )
}

export default PeopleItemRecord;
