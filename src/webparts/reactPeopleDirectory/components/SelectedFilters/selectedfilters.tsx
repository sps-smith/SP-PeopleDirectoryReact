import * as React from "react";
import styles from "../ReactPeopleDirectory.module.scss";
import SelectedFilterItem from "./selectedfilteritem";
import { useEffect, useState } from "react";
import { FilterObjects } from "../IReactPeopleDirectoryProps";
import { CheckboxProps } from "@fluentui/react-components";


const SelectedFilters: React.FC<{props: any[], removedItems: any}> = (data) =>{
    const [countryvalues, setCountryValues] = useState<FilterObjects[]>([]);
    const [functionvalues, setFuntionValues] = useState<FilterObjects[]>([]);
    const [vbuvalues, setVBUValues] = useState<FilterObjects[]>([]);

    useEffect(() => {
        const dt = data.props[0].filter((rec: { checked: any; }) => rec.checked);
        setCountryValues(dt);

        const dt1 = data.props[1].filter((rec: { checked: any; }) => rec.checked);
        setFuntionValues(dt1);

        const dt2 = data.props[2].filter((rec: { checked: any; }) => rec.checked);
        setVBUValues(dt2);
    },[data.props])

    const removeselected = (name: string, dataz: string):void =>{
        switch(name){
            case "Country":
                data.props[0].forEach((rec: { text: string, checked: CheckboxProps["checked"] }) =>{
                    if (rec.text === dataz)
                        rec.checked = false;
                });
                const dt = data.props[0].filter((rec: { checked: any; }) => rec.checked);
                setCountryValues(dt);
                break;
            case "Function":
                data.props[1].forEach((rec: { text: string, checked: CheckboxProps["checked"] }) =>{
                    if (rec.text === dataz)
                        rec.checked = false;
                });
                const dt1 = data.props[1].filter((rec: { checked: any; }) => rec.checked);
                setFuntionValues(dt1);
                break;
            case "VBU":
                data.props[2].forEach((rec: { text: string, checked: CheckboxProps["checked"] }) =>{
                    if (rec.text === dataz)
                        rec.checked = false;
                });
                const dt2 = data.props[2].filter((rec: { checked: any; }) => rec.checked);
                setVBUValues(dt2);
                break;
        }
        data.removedItems();
    }

    return(
        <div className={styles.selectedmain}>
            <h6>Selected Filters</h6>
            <div className={styles.selectedfiltercss}>
                <div>
                    <h6>Country</h6>
                    {
                        countryvalues.length > 0 ?
                        <SelectedFilterItem props={countryvalues} clearsearch={removeselected} filter="Country" />
                        :<></>
                    }
                </div>
                <div>
                    <h6>Function</h6>
                    {
                        functionvalues.length > 0 ?
                        <SelectedFilterItem props={functionvalues} clearsearch={removeselected} filter="Function"/>
                        :<></>
                    }
                </div>
                <div>
                    <h6>VBU</h6>
                    {
                        vbuvalues.length > 0 ?
                        <SelectedFilterItem props={vbuvalues} clearsearch={removeselected} filter="VBU"/>:<></>
                    }
                </div>
            </div>
        </div>
    )
}

export default SelectedFilters;