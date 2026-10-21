import * as React from 'react';
import styles from '../ReactPeopleDirectory.module.scss';
import { useState, useEffect } from 'react';
import { CaretLeft24Filled, CaretRight24Filled } from '@fluentui/react-icons';

const SearchPager: React.FC<{props: number, counter: any, currentpage: number}> = (totalitems) =>{
    const [firstpage, setFirstPage] = useState<number>(1);
    const [secondpage, setSecondPage] = useState<number>(2);
    const [thirdpage, setThirdPage] = useState<number>(3);
    const [fourthpage, setFourthPage] = useState<number>(4);
    const [selectedpage, setSelectPage] = useState<number>(1);
    const [currentpage, setCurrentPage] = useState<number>(1);
    const [lastpage, setLastPage] = useState<number>(0);
    const [pages, setPages] = useState<number>(0);


    const pageitem: number = 12;
    let pg = parseInt((totalitems.props / pageitem).toString());
    const adpage = totalitems.props % pageitem;
    
    useEffect(() =>{
        if (adpage > 0){
            pg += 1;
            setPages(pg);
        }
        else
            setPages(pg);
        setFirstPage(1)
        setSecondPage(2);
        setThirdPage(3);
        setFourthPage(4);
        setLastPage(pg);
    },[totalitems.props])

    useEffect(() => {
        setCurrentPage(totalitems.currentpage);
    },[totalitems.currentpage])

    useEffect(() => {
        setCurrentPage(selectedpage);
        totalitems.counter(selectedpage);
    },[selectedpage])

    const setPreviousPage = (): void => {
        const pg = currentpage - 1;
        if (pg <= 0)
            setSelectPage(1)
        else{
            if (pg < firstpage){
                setFirstPage(pg)
                setSecondPage(pg + 1);
                setThirdPage(pg + 2);
                setFourthPage(pg + 3);
            }
            setSelectPage(pg);
        }
    }

    const setNextPage = (): void => {
        const pg = currentpage + 1;
        if (pg >= lastpage){
            setSelectPage(lastpage);
            if (pages > 4 && fourthpage !== lastpage){
                setFirstPage(lastpage - 3)
                setSecondPage(lastpage - 2);
                setThirdPage(lastpage - 1);
                setFourthPage(lastpage);
            }
        }
        else
        {
            if (pages > 4 && fourthpage < pg){
                setFirstPage(pg - 3)
                setSecondPage(pg - 2);
                setThirdPage(pg - 1);
                setFourthPage(pg);
            }
            setSelectPage(pg);
        }
    }

    const goToLastPage = (): void => {
        setSelectPage(lastpage);
        if (pages > 4 && fourthpage !== lastpage){
            setFirstPage(lastpage - 3)
            setSecondPage(lastpage - 2);
            setThirdPage(lastpage - 1);
            setFourthPage(lastpage);
        }
    }

    const goToFirstPage = (): void => {
        setSelectPage(1);
        if (pages > 4 && firstpage !== 1){
            setFirstPage(1)
            setSecondPage(2);
            setThirdPage(3);
            setFourthPage(4);
        }
    }

    

    return(
        <div className={styles.pagermain}>
            <div className={styles.pagerbold}>Keywords can be names, email address, job titles, countries</div>
            {
                totalitems.props > 0 ?
                    <div className={styles.pagerdiv}>
                        <div title='First Page' onClick={e => goToFirstPage()}><CaretLeft24Filled/><CaretLeft24Filled className={styles.moveleft} /></div>
                        <div title='Previous Page' onClick={e => setPreviousPage()}><CaretLeft24Filled/></div>
                        <div onClick={e => setSelectPage(firstpage)} className={currentpage === firstpage ? styles.selectedcss:''}>{firstpage}</div>
                        {
                            pages > 1 ?
                            <div onClick={e => setSelectPage(secondpage)} className={currentpage === secondpage ? styles.selectedcss:''}>{secondpage}</div>
                            :<></>
                        }
                        {
                            pages > 2 ?
                            <div onClick={e => setSelectPage(thirdpage)} className={currentpage === thirdpage ? styles.selectedcss:''}>{thirdpage}</div>
                            :<></>
                        }
                        {
                            pages > 3 ?
                            <div onClick={e => setSelectPage(fourthpage)} className={currentpage === fourthpage ? styles.selectedcss:''}>{fourthpage}</div>
                            :<></>
                        }
                        <div title='Next Page' onClick={e => setNextPage()}><CaretRight24Filled/></div>
                        <div title='Last Page' onClick={e => goToLastPage()}><CaretRight24Filled  className={styles.moveright} /><CaretRight24Filled/></div>
                    </div>
                : <></>
            }
        </div>
    )
}

export default SearchPager;