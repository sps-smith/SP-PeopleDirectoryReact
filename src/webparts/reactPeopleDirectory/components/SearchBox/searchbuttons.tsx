import * as React from 'react';
import { Button } from '@fluentui/react-components';
import styles from '../ReactPeopleDirectory.module.scss';
import { Search24Filled, TextClearFormatting24Regular, TextBulletListSquare24Regular, PeopleTeam24Regular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';

const SearchButtons: React.FC<{setpage: any, clearresults: any, runsearch: any, clearvalue: boolean, searchvalue: boolean, theView: any}> = (props) =>{

    const [peopleview, setPeopleView] = useState<string>('PeopleView')
    const [viewlabel, setViewLabel] = useState<string>('List View');

    const resetresults = (): void =>{
        props.setpage(-1);
        props.clearresults(!props.clearvalue);
    }

    const execresults = (): void =>{
        props.runsearch(!props.searchvalue);
    }

    const setView = () =>{
        if (peopleview === "PeopleView")
            setPeopleView("ListView");
        else
            setPeopleView("PeopleView");
    }

    useEffect(() =>{
        if (peopleview === "PeopleView")
            setViewLabel("List View");
        else
            setViewLabel("People View");
        props.theView(peopleview);
    },[peopleview])

    return(
        <>
            <div className={styles.searchbuttons}>
                <Button icon={<Search24Filled />} onClick={execresults}>Search</Button>
                <Button icon={<TextClearFormatting24Regular />} onClick={resetresults}>Clear</Button>
                <Button icon={peopleview === "PeopleView" ? <TextBulletListSquare24Regular />: <PeopleTeam24Regular />} onClick={setView}>{viewlabel}</Button>
            </div>
        </>
    )
}

export default SearchButtons;
