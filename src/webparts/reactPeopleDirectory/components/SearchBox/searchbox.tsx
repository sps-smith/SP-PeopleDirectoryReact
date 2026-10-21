import * as React from 'react';
import { Input, Spinner} from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { useState, useEffect } from 'react';
import { PeopleRecord, FilterSelectedObjects } from '../IReactPeopleDirectoryProps';
import SearchPager from '../SearchPage/searchpager';
import FilterComponent from '../Filters/filtercomponent';
import PeopleResults from '../Results/peopleresults';
import SearchButtons from './searchbuttons';
import PeopleDirectoryClient, { IApiPeopleRecord } from '../../services/PeopleDirectoryClient';

const SearchBox: React.FC<{CountryValue: string, VBUValue: string, userEmail: string, Url: string, peopleDirectoryClient: PeopleDirectoryClient}> = (props) =>{

    const _siteurl = "https://ourvolaris.sharepoint.com/sites/peopledirectory";

    const [searchtext, setSearchText] = useState<string>('');
    const [defaultresults, setDefault] = useState<PeopleRecord[]>([]);
    const [recordscount, setRecordCount] = useState<number>(0);
    const [dataresults, setDataResults] = useState<PeopleRecord[]>([]);
    const [allresults, setAllResults] = useState<PeopleRecord[]>([]);
    const [clearpressed, setClearPresses] = useState<boolean>(false);
    const [searchpressed, setSearchPressed] = useState<boolean>(false);
    const [currentpage, setCurrentPage] = useState<number>(1);
    const [resetvalues, setResetValues] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<FilterSelectedObjects[]>([]);
    const [applyclicked, setApplyClick] = useState<boolean>(false);
    const [hidefilters, setHideFilters] = useState<boolean>(false);
    const [filterapplied, setFilterApplied] = useState<boolean>(false);
    const [filterremoved, setFilterRemoved] = useState<boolean>(false);
    const [reloaddata, setReloadData] = useState<boolean>(false);
    const [peopleview, setPeopleView] = useState<string>('PeopleView')
    const [isdefaultresults, setDefaultResults] = useState<boolean>(false);
    const [customdir, setCustomDir] = useState<boolean>(false);

    const keypress = (ev: any):void =>  {
        if (ev.key === 'Enter' && searchtext !== ''){
            if (filters.length === 0)
                getSearchResults(searchtext);
            else
                getpeoplebyfilterandsearch();
        }
    }

    const setPage = (current: number):number =>{
        current += 1;
        let dt = Math.floor(current / 12);
        if (current <= 12)
            return 1;
        else
        {
            const adpage = current % 12;
            if (adpage > 0)
                dt += 1;
        }
        return dt;
    }

    const getSearchResults = async (search: string): Promise<void> => {
        setLoading(true);
        setCurrentPage(-1);
        try {
            const results = await props.peopleDirectoryClient.searchPeople(search, props.CountryValue, props.VBUValue);
            const data = getdata(results);
            setAllResults(data);
            setCurrentPage(1);
            setRecordCount(data.length);
            if (filters.length === 0)
                setResetValues(!resetvalues);
            setDefaultResults(false);
        } catch (error) {
            console.error('Unable to search the people directory', error);
        } finally {
            setLoading(false);
        }
    }

    const getdata = (results: any[]): PeopleRecord[] => {
        const data: PeopleRecord[] = [];
        results.forEach((rec: any, idx:number) => {
            let dt: PeopleRecord = {
                employeeName: rec.employeeName,
                jobTitle: rec.jobTitle,
                email: rec.email,
                telephone: rec.telephone,
                country: rec.country,
                office: rec.office,
                city: rec.city,
                company: rec.company,
                vbu: rec.vbu,
                employeeId: rec.employeeUserId,
                userprincipal: rec.userPrincipalId,
                orgID: rec.attribute9,
                page: setPage(idx),
                costcenter: rec.costCenter
            };
            data.push(dt);
        });
        return data;
    }

    const getpeoplebyfilters = async (): Promise<void> =>{
        setLoading(true);
        try {
            const results = await props.peopleDirectoryClient.filterPeople(filters, props.CountryValue, props.VBUValue);
            loaddata(results);
            setReloadData(!reloaddata);
            setHideFilters(!hidefilters);
            setFilterApplied(true);
        } catch (error) {
            console.error('Unable to apply people directory filters', error);
        } finally {
            setLoading(false);
        }
    }

    const getpeoplebyfilterandsearch = async (): Promise<void> =>{
        setLoading(true);
        setCurrentPage(-1);
        try {
            const results = await props.peopleDirectoryClient.filterAndSearchPeople(filters, searchtext, props.CountryValue, props.VBUValue);
            loaddata(results);
        } catch (error) {
            console.error('Unable to search the filtered people directory', error);
        } finally {
            setLoading(false);
        }

    }

    const getDefaultResults = () =>{
        setAllResults(defaultresults);
        setRecordCount(defaultresults.length);
        setSearchText('');
        if (currentpage === 1)
            setReloadData(!reloaddata);
        else
            setCurrentPage(1);
        setFilters([]);
        setFilterApplied(false);
        setHideFilters(false);
        setResetValues(!resetvalues);
        setDefaultResults(true);
    }

    const loaddefaultdata = (results: IApiPeopleRecord[]) =>{
        const data = getdata(results);
        setAllResults(data);
        setDefault(data);
        setRecordCount(data.length);
        setReloadData(!reloaddata);
        setLoading(false);
        setDefaultResults(true);
    }

    const loaddata = (results: IApiPeopleRecord[]) => {
        const data = getdata(results);
        setAllResults(data);
        setCurrentPage(1);
        setRecordCount(data.length);
        setLoading(false);
        setDefaultResults(false);
    }

    useEffect(() =>{
        if (filterapplied){
            console.log("applied here")
            if (searchtext === "" && filters.length > 0){
                getpeoplebyfilters();
            }
            else if (searchtext !== "" && filters.length > 0){
                getpeoplebyfilterandsearch();
                setHideFilters(!hidefilters);
                setFilterApplied(true);
            }
            else if (searchtext !== "" && filters.length === 0){
                getSearchResults(searchtext);
                setHideFilters(!hidefilters);
                setFilterApplied(false);
            }
            else if (searchtext === "" && filters.length === 0){
                getDefaultResults();
            }
        }
    },[filterremoved])

    useEffect(() =>{
        if (searchtext === "" && filters.length > 0){
            getpeoplebyfilters();
        }
        else if (searchtext !== "" && filters.length > 0){
            getpeoplebyfilterandsearch();
            setHideFilters(!hidefilters);
            setFilterApplied(true);
        }
        setDefaultResults(false);
    },[applyclicked])

    useEffect(() =>{
        if (defaultresults.length > 0){
            getDefaultResults();
        }
    },[clearpressed])

    useEffect(() =>{
        if (searchtext !== '' && filters.length === 0){
            getSearchResults(searchtext);
        }
        if (searchtext !== '' && filters.length > 0){
            getpeoplebyfilterandsearch();
        }
        setDefaultResults(false);
    },[searchpressed])

    useEffect(() =>{
        if (allresults.length > 0 && currentpage > 0){
            const records = allresults.filter(rec => rec.page === currentpage);
            setDataResults(records);
        }
    },[currentpage])

    useEffect(() =>{
        if (allresults.length > 0 && currentpage === 1){
            const records = allresults.filter(rec => rec.page === 1);
            setDataResults(records);
        }
    },[reloaddata])

    useEffect(() =>{
        if (props.Url.toLocaleLowerCase() !== _siteurl.toLocaleLowerCase())
            if (props.CountryValue === "" && props.VBUValue === "")
                setCustomDir(true);
        
        if (!customdir){
            if (dataresults.length === 0)
                if (props.CountryValue === "" && props.VBUValue === "")
                    props.peopleDirectoryClient.getDefaultPeople(props.CountryValue, props.VBUValue)
                    .then(results => loaddefaultdata(results))
                    .catch(error => console.error('Unable to load people directory data', error));
                else
                    props.peopleDirectoryClient.getDefaultPeople(props.CountryValue, props.VBUValue)
                    .then(results => loaddefaultdata(results))
                    .catch(error => console.error('Unable to load people directory data', error));
        }
    },[])

    return(
        <>  
            {
            !customdir ? 
            <div>
                <div className={styles.searchboxdiv}>
                    <Input appearance='outline' type='text' onKeyDown={keypress}  
                    onChange={(e: any) => setSearchText(e.target.value)} 
                    value={searchtext} contentBefore={<span className={styles.stnowrap}>
                    Enter a keyword
                    </span>} contentAfter={<SearchButtons setpage={setCurrentPage} clearresults={setClearPresses} clearvalue={clearpressed} runsearch={setSearchPressed} searchvalue={searchpressed} theView={setPeopleView}></SearchButtons>}/>
                </div>
                {
                    recordscount > 0 ?
                    <SearchPager props={recordscount} counter={setCurrentPage} currentpage={currentpage}/>: <></>
                }
                <FilterComponent records={recordscount} resetvalues={resetvalues} setFiltering={setFilters} ApplyClick={setApplyClick} HideFilters={hidefilters} FilterApplied={filterapplied} FilterRemove={setFilterRemoved} RemoveValue={filterremoved} counter={setCurrentPage} CountryValue={props.CountryValue} VBUValue={props.VBUValue} DefaultResults={isdefaultresults} peopleDirectoryClient={props.peopleDirectoryClient}/>
                <hr/>
                {
                    recordscount > 0 && currentpage > 0 && !loading ?
                    <PeopleResults props={dataresults} page={currentpage} CountryValue={props.CountryValue} VBUValue={props.VBUValue} SelectedView={peopleview} userEmail={props.userEmail} />
                    :<></>
                }
                {
                    recordscount === 0 && currentpage > 0 && !loading ?
                    <div><div></div><div>No data found for your query</div></div>
                    :<></>
                }
                {
                    loading ?
                    <div>
                        <Spinner appearance="primary" labelPosition="after"
                        label="loading please wait ..." />
                    </div>:<></>
                }
            </div>:<>You must select either a Country and/or VBU from the webpart properties for this component</>
            }
        </>
    )
}

export default SearchBox;
