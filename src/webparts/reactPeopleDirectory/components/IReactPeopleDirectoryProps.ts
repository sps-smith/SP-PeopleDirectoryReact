import type { CheckboxProps } from "@fluentui/react-components";
import PeopleDirectoryClient from '../services/PeopleDirectoryClient';

export interface IReactPeopleDirectoryProps {
	description: string;
	isDarkTheme: boolean;
	environmentMessage: string;
	hasTeamsContext: boolean;
	userDisplayName: string;
	countryName: string;
	VBUName: string;
	Url: string;
	peopleDirectoryClient: PeopleDirectoryClient;
}

export interface SearchBttonProps{
	search: boolean;
	clear: boolean;
}

export interface FilterObjects{
	text: string;
	checked: CheckboxProps["checked"];
}

export interface FilterSelection{
    Name: string;
    Selected: boolean;
}

export interface PeopleRecord{
	employeeName: string;
	jobTitle: string;
	email: string;
	country: string;
	office: string;
	city: string;
	company: string;
	vbu: string;
	employeeId: number;
	telephone: string;
	userprincipal: string;
	orgID: string;
	page: number;
	costcenter: string;
}

export interface FilterSelectedObjects{
	Name: string;
	FilterValues: string[];
}

export interface P2PObject{
	thirtyValue: number;
	sixtyValue: number;
	ninetyValue: number;
}

export interface P2PEmployee{
	employeeEmail: string;
	employeeCount: number;
}
