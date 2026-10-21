import * as React from 'react';
import { Button } from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { useState, useEffect } from 'react';
import FilterItem from './filteritem';
import { FilterObjects, FilterSelection, FilterSelectedObjects } from '../IReactPeopleDirectoryProps';
import SelectedFilters from '../SelectedFilters/selectedfilters';
import type {CheckboxProps } from '@fluentui/react-components';
import PeopleDirectoryClient from '../../services/PeopleDirectoryClient';

const FilterComponent: React.FC<{records: number, resetvalues: boolean, setFiltering: any, ApplyClick: any, HideFilters: boolean, FilterApplied:boolean, FilterRemove:any, RemoveValue: boolean, counter: any, CountryValue: string, VBUValue: string, DefaultResults: boolean, peopleDirectoryClient: PeopleDirectoryClient}> = (props) =>{
    const [countryfilters, setCountryFilters] = useState<FilterObjects[]>([]);
    const [vbufilters, setVBUFilters] = useState<FilterObjects[]>([]);
    const [functionfilters, setFunctionFilters] = useState<FilterObjects[]>([]);
    const [filterselected, setFilterSelected] = useState<boolean>(false);
    const [selectedfilter, setSelectedFilter] = useState<string>("");
    const [filterSelections, setFilterSelections] = useState<FilterSelection[]>([{Name: "Country", Selected: false},{Name: "Function", Selected: false},{Name: "VBU", Selected: false}]);
    const [render, setRender] = useState<boolean>(false);

    useEffect(() => {
        setSelectedFilter("");
    },[props.HideFilters])

    useEffect(() =>{
        setSelectedFilter("");
        resetallvalues();
        setFilterSelections([{Name: "Country", Selected: false},{Name: "Function", Selected: false},{Name: "VBU", Selected: false}]);
        setFilterSelected(false);
    },[props.resetvalues])

    useEffect(() =>{
        props.peopleDirectoryClient.getFilters()
            .then(filters =>{
                let data: FilterObjects[] = [];
                //Country
                const dt = filters.filter(rec => rec.filterName === "CountryValue");
                dt.forEach(itm => {
                    if (itm.value !== "")
                        data.push({text: itm.value, checked: false});
                });
                setCountryFilters(data);
                //VBU
                data = [];
                const dt2 = filters.filter(rec => rec.filterName === "VBUValue");
                dt2.forEach(itm => {
                    if (itm.value !== "")
                        data.push({text: itm.value, checked: false});
                });
                setVBUFilters(data);
                //Function
                data = [];
                const dt3= filters.filter(rec => rec.filterName === "FunctionValue");
                dt3.forEach(itm => {
                    if (itm.value !== "")
                        data.push({text: itm.value, checked: false});
                });
                setFunctionFilters(data);
            }).catch(error => console.error('Unable to load directory filter options', error));
    },[props.peopleDirectoryClient])

    const filterSelected = (data: string, filtertype: string, dtchk: CheckboxProps["checked"]): void => {
        switch(filtertype){
            case "Country":
                countryfilters.forEach(itm => {
                    if (itm.text === data)
                        itm.checked = dtchk;
                });
                const fnd = countryfilters.filter(itm => itm.checked);
                if (fnd.length > 0)
                    filterSelections[0].Selected = true;
                else
                    filterSelections[0].Selected = false;
                break;
            case "Function":
                functionfilters.forEach(itm => {
                    if (itm.text === data)
                        itm.checked = dtchk;
                });
                const fnd1= functionfilters.filter(itm => itm.checked);
                if (fnd1.length > 0)
                    filterSelections[1].Selected = true;
                else
                    filterSelections[1].Selected = false;
                break;
            case "VBU":
                vbufilters.forEach(itm => {
                    if (itm.text === data)
                        itm.checked = dtchk;
                });
                const fnd2 = vbufilters.filter(itm => itm.checked);
                if (fnd2.length > 0)
                    filterSelections[2].Selected = true;
                else
                    filterSelections[2].Selected = false;
                break;
        }
        if (filterSelections[0].Selected || filterSelections[1].Selected || filterSelections[2].Selected)
            setFilterSelected(true);
        else
            setFilterSelected(false);
        applyfilter();
        setRender(!render);
    }

    const resetallvalues = () => {
        countryfilters.forEach(itm => itm.checked = false);
        functionfilters.forEach(itm => itm.checked = false);
        vbufilters.forEach(itm => itm.checked = false);
    }

    const filtersremoved = (): void =>{
        const fnd = countryfilters.filter(itm => itm.checked);
        const fnd1 = functionfilters.filter(itm => itm.checked);
        const fnd2= vbufilters.filter(itm => itm.checked);
        if (fnd.length > 0)
            filterSelections[0].Selected = true;
        else
            filterSelections[0].Selected = false;

        if (fnd1.length > 0)
            filterSelections[1].Selected = true;
        else
            filterSelections[1].Selected = false;

        if (fnd2.length > 0)
            filterSelections[2].Selected = true;
        else
            filterSelections[2].Selected = false;

        if (filterSelections[0].Selected || filterSelections[1].Selected || filterSelections[2].Selected)
            setFilterSelected(true);
        else
            setFilterSelected(false);
        applyfilter();
        props.FilterRemove(!props.RemoveValue);
        props.counter(-1);
    }

    const showfilter = (filtertoshow: string):void => {
        if (filtertoshow !== selectedfilter)
            setSelectedFilter(filtertoshow);
        else
            setSelectedFilter("");
    }

    const applyfilter = () =>{
        const data: FilterSelectedObjects[] = [];
        if (filterSelections[0].Selected){
            const fnd = countryfilters.filter(rec => rec.checked);
            const companyObj: FilterSelectedObjects = { Name: 'Country', FilterValues: []};
            fnd.forEach(itm => companyObj.FilterValues.push(itm.text));
            data.push(companyObj);
        }

        if (filterSelections[1].Selected){
            const fnd = functionfilters.filter(rec => rec.checked);
            const functionObj: FilterSelectedObjects = { Name: 'Function', FilterValues: []};
            fnd.forEach(itm => functionObj.FilterValues.push(itm.text));
            data.push(functionObj);
        }

        if (filterSelections[2].Selected){
            const fnd = vbufilters.filter(rec => rec.checked);
            const vbuObj: FilterSelectedObjects = { Name: 'VBU', FilterValues: []};
            fnd.forEach(itm => vbuObj.FilterValues.push(itm.text));
            data.push(vbuObj);
        }
       props.setFiltering(data);
    }

    return(
        <>
            <div className={styles.filtermain}>
                <span className={styles.filterspan}>Filters:</span>
                {
                    props.CountryValue === "" ?
                    <FilterItem props={countryfilters} filtername={"Country"} filterSelected={filterSelected} showFilter={showfilter} Selected={selectedfilter} />: <></>
                }
                <FilterItem props={functionfilters} filtername={"Function"} filterSelected={filterSelected} showFilter={showfilter} Selected={selectedfilter} />
                {
                    props.VBUValue === "" ?
                    <FilterItem props={vbufilters} filtername={"VBU"} filterSelected={filterSelected} showFilter={showfilter} Selected={selectedfilter} />:<></>
                }
                {
                    filterselected ?
                    <div>
                        <Button title="Click to apply filter" className={styles.applybtn} onClick={props.ApplyClick} >Apply Filter</Button>
                    </div>
                    :<></>
                }
                {
                    props.records > 0 && !props.DefaultResults?
                    <div className={styles.reccss}>{props.records} Records</div>
                    :<></>
                }
            </div>
            {
                filterselected ?
                <SelectedFilters props={[countryfilters, functionfilters, vbufilters]} removedItems={filtersremoved}/>
                :<></>
            }
        </>
    )
}

export default FilterComponent;
