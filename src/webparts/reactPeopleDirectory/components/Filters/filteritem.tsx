import * as React from 'react';
import { Input, Button, Checkbox } from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { useState, useEffect  } from 'react';
import { FilterObjects } from '../IReactPeopleDirectoryProps';
import type {CheckboxProps } from '@fluentui/react-components';

const FilterItem: React.FC<{props: any[], filtername: string, filterSelected:any, showFilter: any, Selected: string, }> = (data) =>{

    const [filters, setFilters] = useState<FilterObjects[]>([]);
    const [showbox, setShowBox] = useState<boolean>(false);
    const [searchtext, setSearchText] = useState<string>("");
    const placeholdertext: string = "Search for " + data.filtername;

    useEffect(() =>{
        setFilters(data.props);
    },[data.props]);

    useEffect(() => {
        if (data.Selected === data.filtername)
            setShowBox(true);
        else
            setShowBox(false);
    },[data.Selected])

    useEffect(() =>{
        if (searchtext !== ""){
            const dt = data.props.filter(itm => itm.text.toLowerCase()
            .indexOf(searchtext.toLocaleLowerCase()) > -1);
            setFilters(dt);
        }
        else
            setFilters(data.props);
    },[searchtext])

    const onChange = (sdata: string, dtchk: CheckboxProps["checked"]):void => {
        data.filterSelected(sdata,data.filtername,dtchk);
    }

    const clearsearch = ():void => {
        setSearchText("");
    }

    return(
        <div className={styles.filterdiv}>
            <Button className={styles.filterbutton} 
                onClick={e => data.showFilter(data.filtername)}>{data.filtername}</Button>
            {
                <div className={showbox ? styles.cmbmain: styles.cmbmainone}>
                    <div className={styles.cmbmaindiv}>
                        <Input value={searchtext} onChange={(e, data) => setSearchText(data.value) } contentAfter={<span title="Clear search value" className={searchtext !== "" ? styles.clearbtn : styles.clearbtnhide} onClick={clearsearch}>X</span>} placeholder={placeholdertext} />
                    </div>
                    <div className={styles.cmbocss}>
                        {
                            filters.map((item: any) =>(
                                <div key={item.text}>
                                    <Checkbox className={styles.chkbx} label={item.text} checked={item.checked} onChange={(ev, data) => onChange(item.text, data.checked)} title={item.text} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default FilterItem;
