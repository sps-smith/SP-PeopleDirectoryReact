import * as React from 'react';
import {  AccessibilityCheckmark32Filled,ArchiveArrowBack32Filled, BookmarkMultiple32Filled, TableSimpleCheckmark32Filled } from '@fluentui/react-icons';
import styles from '../ReactPeopleDirectory.module.scss';
import {  Tooltip, makeStyles } from '@fluentui/react-components';
import { useEffect, useState } from 'react';
import PeopleDirectoryClient from '../../services/PeopleDirectoryClient';

const useStyles = makeStyles({
    tooltip: {
      backgroundColor: "#008ab0",
      color: "#fff",
    }
});

const Badges: React.FC<{email?: string, name?:string, p2Badge: number, peopleDirectoryClient: PeopleDirectoryClient}> = (props) =>{

    const [live, setlive] = useState<boolean>(false);

    const css = useStyles();

    useEffect(() =>{
        if (!props.name) {
            setlive(false);
            return;
        }

        props.peopleDirectoryClient.getLiveStatus(props.name)
        .then(isLive => setlive(isLive))
        .catch(error => console.error('Unable to load badge status', error));
    },[props.name, props.peopleDirectoryClient])

    return(
        <div className={styles.badgescss}>
            {
                live ?
                <div>
                    <Tooltip withArrow content={{ children: "Volaris101 Live", className: css.tooltip}} relationship="label">
                            <span><AccessibilityCheckmark32Filled primaryFill='blue' /> </span> 
                    </Tooltip>
                </div>:<></>
            }
            {
                props.p2Badge === 3 ?
                <div>
                    <Tooltip withArrow content={{ children: "Peer to Peer Badge", className: css.tooltip}} relationship="label">
                            <span><ArchiveArrowBack32Filled primaryFill='yellow' /> </span> 
                    </Tooltip>
                </div>:<></>
            }
            <div>
                <Tooltip withArrow content={{ children: "Third Badge", className: css.tooltip}} relationship="label">
                        <span><BookmarkMultiple32Filled primaryFill='orange' /> </span> 
                </Tooltip>
            </div>
            <div>
                <Tooltip withArrow content={{ children: "Fourth Badge", className: css.tooltip}} relationship="label" {...props}>
                        <span><TableSimpleCheckmark32Filled primaryFill='red' /> </span> 
                </Tooltip>
            </div>
    </div>
    )


}

export default Badges;
