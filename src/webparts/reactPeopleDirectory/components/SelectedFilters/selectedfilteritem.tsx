import * as React from "react";
import styles from "../ReactPeopleDirectory.module.scss";
import { Avatar } from '@fluentui/react-components';
import { FilterObjects } from "../IReactPeopleDirectoryProps";
import { Delete20Filled } from '@fluentui/react-icons';


const SelectedFilterItem: React.FC<{props: FilterObjects[], clearsearch: any, filter: string}> = (data) =>{

    const deleteselection = (name: string): void =>{
        data.clearsearch(data.filter, name);
    }

    return(
        <div>
            {
                data.props.map(itm => (
                    <div key={itm.text} className={styles.selecteditemfilter}>
                        <span>{itm.text} </span> <Avatar className={styles.deleteicn} icon={<Delete20Filled color="red"/>} aria-label="Delete" onClick={e => deleteselection(itm.text)} title="Remove filter"/>
                    </div>
                ))
            }      
        </div>
    )
}

export default SelectedFilterItem;